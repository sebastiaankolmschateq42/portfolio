import ContactForm from "@/app/components/ContactForm";

// The form on its own, with the API replaced by stubs.
describe("<ContactForm>", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/contact/captcha", { fixture: "captcha.json" }).as("captcha");
    cy.mount(<ContactForm />);
    cy.wait("@captcha");
  });

  it("asks the sum from the server", () => {
    cy.get('label[for="captchaAnswer"]').should("have.text", "What is 2 + 3?");
  });

  it("enforces the maximum length of the subject while typing", () => {
    cy.get("#subject").type("a".repeat(201), { delay: 0 }).blur();
    cy.get("#subject-error").should("have.text", "Subject must be at most 200 characters");
  });

  it("rejects HTML in the message", () => {
    cy.get("#message").type("<b>hello</b>", { parseSpecialCharSequences: false }).blur();
    cy.get("#message-error").should("have.text", "HTML is not allowed");
  });

  it("clears the form after a successful send", () => {
    const send = cy.stub().as("send");
    cy.intercept("POST", "/api/contact", (req) => {
      send(req.body);
      req.reply({ statusCode: 201, body: { success: true } });
    });

    cy.fixture("contact").then((contact: Record<string, string>) => {
      for (const [name, value] of Object.entries(contact)) cy.get(`#${name}`).type(value);
    });
    cy.get("#captchaAnswer").type("5");
    cy.contains("button", "Send").click();

    cy.get("@send").should("have.been.calledOnce");
    cy.get('[role="status"]').should("be.visible");
    cy.get("#email").should("have.value", "");
  });
});
