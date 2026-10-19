type ContactFixture = Record<
  "firstName" | "lastName" | "email" | "phone" | "subject" | "message",
  string
>;

function fillForm(contact: ContactFixture) {
  cy.get("#firstName").type(contact.firstName);
  cy.get("#lastName").type(contact.lastName);
  cy.get("#email").type(contact.email);
  cy.get("#phone").type(contact.phone);
  cy.get("#subject").type(contact.subject);
  cy.get("#message").type(contact.message);
}

describe("contact form (real server)", () => {
  it("solves the sum, sends the message and clears the form", () => {
    cy.intercept("POST", "/api/contact").as("send");
    cy.visitWithConsent("/contact");

    cy.fixture("contact").then(fillForm);
    cy.get('label[for="captchaAnswer"]')
      .invoke("text")
      .then((label) => {
        const [a, b] = label.match(/\d+/g)!.map(Number);
        cy.get("#captchaAnswer").type(String(a + b));
      });

    cy.contains("button", "Send").should("be.enabled").click();
    cy.wait("@send").its("response.statusCode").should("eq", 201);
    cy.get('[role="status"]').should("contain.text", "has been sent");
    cy.get("#firstName").should("have.value", "");
  });
});

describe("contact form (stubbed network)", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/contact/captcha", { fixture: "captcha.json" }).as("captcha");
    cy.visitWithConsent("/contact");
    cy.get('label[for="captchaAnswer"]').should("contain.text", "What is");
  });

  it("keeps the send button locked until every field is valid", () => {
    cy.contains("button", "Send").should("be.disabled");
    cy.fixture("contact").then(fillForm);
    cy.contains("button", "Send").should("be.disabled");
    cy.get("#captchaAnswer").type("5");
    cy.contains("button", "Send").should("be.enabled");
  });

  it("marks invalid fields and explains what is wrong", () => {
    cy.get("#email").type("not-an-email").blur();
    cy.get("#email").should("have.attr", "aria-invalid", "true");
    cy.get("#email-error").should("have.text", "Invalid email address");

    cy.get("#message").type("Read this: https://example.com").blur();
    cy.get("#message-error").should("have.text", "Links are not allowed");
  });

  it("sends the fields and the captcha token, shows a spinner and then a flash message", () => {
    cy.intercept("POST", "/api/contact", {
      statusCode: 201,
      body: { success: true },
      delay: 500,
    }).as("send");

    cy.fixture("contact").then(fillForm);
    cy.get("#captchaAnswer").type("5");
    cy.contains("button", "Send").click();

    cy.contains("button", "Sending...").find(".animate-spin").should("exist");
    cy.wait("@send").its("request.body").should("deep.include", {
      firstName: "Ada",
      captchaAnswer: "5",
    });
    cy.get("@send").its("request.body.captchaToken").should("be.a", "string").and("not.be.empty");
    cy.get('[role="status"]').should("contain.text", "has been sent");

    cy.get('[role="status"]', { timeout: 8000 }).should("not.exist");
  });

  it("keeps what the visitor typed when sending fails", () => {
    cy.intercept("POST", "/api/contact", { statusCode: 500, body: { error: "down" } }).as("send");

    cy.fixture("contact").then(fillForm);
    cy.get("#captchaAnswer").type("5");
    cy.contains("button", "Send").click();
    cy.wait("@send");

    cy.get('[role="alert"]').should("contain.text", "not sent");
    cy.get("#firstName").should("have.value", "Ada");
    cy.get("@captcha.all").should("have.length", 1);
  });

  it("shows the server's message when the sum was wrong", () => {
    cy.intercept("POST", "/api/contact", {
      statusCode: 400,
      body: { errors: { captchaAnswer: ["Wrong answer, try again"] } },
    });

    cy.fixture("contact").then(fillForm);
    cy.get("#captchaAnswer").type("4");
    cy.contains("button", "Send").click();
    cy.get("#captchaAnswer-error").should("have.text", "Wrong answer, try again");
  });
});
