declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginAs(name: string, role?: "USER" | "ADMIN"): Chainable<string>;
      visitWithConsent(path: string): Chainable<Cypress.AUTWindow>;
    }
  }
}

Cypress.Commands.add("loginAs", (name: string, role: "USER" | "ADMIN" = "USER") => {
  return cy.task<string>("createSession", { name, role }).then((token) => {
    cy.setCookie("session", token, { httpOnly: true, sameSite: "strict" });
    return cy.wrap(token);
  });
});

Cypress.Commands.add("visitWithConsent", (path: string) => {
  return cy.visit(path, {
    onBeforeLoad: (win) => win.localStorage.setItem("privacy-consent", "accepted"),
  });
});

export {};
