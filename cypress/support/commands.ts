// Custom commands shared by the end-to-end tests.

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Logs in as a fresh test account by setting a signed session cookie. */
      loginAs(name: string, role?: "USER" | "ADMIN"): Chainable<string>;
      /** Visits a page with the privacy choice already made, so the banner does not cover it. */
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
