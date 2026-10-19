import ConsentBanner from "@/app/components/ConsentBanner";

describe("<ConsentBanner>", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("shows when no choice was made yet", () => {
    cy.mount(<ConsentBanner />);
    cy.get('section[aria-label="Privacy"]').should("be.visible");
  });

  it("saves the choice and hides itself", () => {
    cy.mount(<ConsentBanner />);
    cy.contains("button", "Accept").click();
    cy.get('section[aria-label="Privacy"]').should("not.exist");
    cy.window().its("localStorage").invoke("getItem", "privacy-consent").should("eq", "accepted");
  });

  it("stays hidden when a choice was saved before", () => {
    cy.window().then((win) => win.localStorage.setItem("privacy-consent", "declined"));
    cy.mount(<ConsentBanner />);
    cy.get('section[aria-label="Privacy"]').should("not.exist");
  });
});
