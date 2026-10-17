// Two-step login. The emailed code cannot be read from a test, so the network is stubbed
// to test how the form behaves in each step.

describe("login form", () => {
  beforeEach(() => {
    cy.visitWithConsent("/login");
  });

  it("asks for the emailed code after the password step", () => {
    cy.intercept("POST", "/api/auth/login", { statusCode: 202, body: {} }).as("login");
    cy.intercept("POST", "/api/auth/login/verify", { statusCode: 200, body: {} }).as("verify");

    cy.get("#email").type("grace@example.com");
    cy.get("#password").type("a-long-enough-password");
    cy.get("form").submit();
    cy.wait("@login").its("request.body").should("deep.equal", {
      email: "grace@example.com",
      password: "a-long-enough-password",
    });

    cy.get("#code").should("be.visible").type("123456");
    cy.get("form").submit();
    cy.wait("@verify").its("request.body").should("include", { code: "123456" });
    cy.location("pathname").should("eq", "/ask");
  });

  it("shows one message for a wrong email or password", () => {
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 401,
      body: { error: "Invalid email or password" },
    });

    cy.get("#email").type("grace@example.com");
    cy.get("#password").type("a-long-enough-password");
    cy.get("form").submit();
    cy.get('[role="alert"]').should("be.visible");
    cy.get("#code").should("not.exist");
  });
});
