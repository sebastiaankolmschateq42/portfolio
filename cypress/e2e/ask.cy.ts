// Showcase: Ask Me Anything with roles and live updates, against the real app and database.

describe("ask me anything", () => {
  beforeEach(() => {
    cy.task("resetTestData");
  });

  // Leave no test accounts or questions behind in the development database.
  after(() => {
    cy.task("resetTestData");
  });

  it("asks visitors to log in before they can ask", () => {
    cy.visit("/ask");
    cy.contains("a", "Log in").should("have.attr", "href", "/login");
    cy.get("#body").should("not.exist");
  });

  it("lets a user ask a question and edit it", () => {
    cy.loginAs("Grace");
    cy.visitWithConsent("/ask");

    cy.get("#body").type("How did you build the visual search?");
    cy.contains("button", "Ask").click();
    cy.contains("li", "How did you build the visual search?").should("contain.text", "Grace");

    cy.contains("li", "How did you build the visual search?").contains("button", "Edit").click();
    cy.get("li textarea").clear().type("How does the visual search work?");
    cy.contains("li button", "Save").click();
    cy.contains("li", "How does the visual search work?").should("exist");
  });

  it("does not show answer or delete buttons on someone else's question to a user", () => {
    cy.loginAs("Alan").then((alanToken) => {
      cy.request({
        method: "POST",
        url: "/api/questions",
        headers: { Cookie: `session=${alanToken}` },
        body: { body: "Alan's question" },
      });
    });
    cy.clearCookies();

    cy.loginAs("Grace");
    cy.visit("/ask");
    cy.contains("li", "Alan's question").within(() => {
      cy.contains("button", "Answer").should("not.exist");
      cy.contains("button", "Delete").should("not.exist");
      cy.contains("button", "Edit").should("not.exist");
    });
  });

  it("shows an admin's answer to a visitor without reloading", () => {
    // Set up a question with a user, then watch the page as a visitor.
    cy.loginAs("Grace").then((graceToken) => {
      cy.request({
        method: "POST",
        url: "/api/questions",
        headers: { Cookie: `session=${graceToken}` },
        body: { body: "What are you working on?" },
      }).then(({ body }) => cy.wrap(body.id).as("questionId"));
    });
    cy.clearCookies();

    cy.visit("/ask");
    cy.contains("Live").should("exist");
    cy.contains("li", "What are you working on?").should("not.contain.text", "Answered on");

    // The admin answers from "another browser": a request with the admin's cookie.
    cy.task<string>("createSession", { name: "Admin", role: "ADMIN" }).then((adminToken) => {
      cy.get<string>("@questionId").then((id) => {
        cy.request({
          method: "POST",
          url: `/api/questions/${id}/answer`,
          headers: { Cookie: `session=${adminToken}` },
          body: { answer: "This portfolio!" },
        });
      });
    });

    cy.contains("li", "What are you working on?", { timeout: 10000 }).should(
      "contain.text",
      "This portfolio!",
    );
  });
});
