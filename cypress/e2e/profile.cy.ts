// UC1: the profile page, against the real app.

describe("profile page", () => {
  it("shows the developer's photo, skills, education and personal details", () => {
    cy.visitWithConsent("/");

    cy.get("main h1").should("contain.text", "Sebastiaan Henri Kolmschate");
    cy.get('main img[alt^="Portrait"]').should("be.visible");
    cy.contains("h2", "Skills").next("ul").find("li").should("have.length.greaterThan", 5);
    cy.contains("h2", "Education")
      .next("ul")
      .within(() => {
        cy.contains("Windesheim University of Applied Sciences, Zwolle");
        cy.contains("Corderius College, Amersfoort");
      });
    cy.contains("h2", "Personal details").next("dl").find('a[href^="mailto:"]').should("exist");
  });

  it("opens a project from the list", () => {
    cy.visit("/");
    cy.contains("h3", "Rijksmuseum Visual Search").click();
    cy.location("pathname").should("eq", "/projects/rijksmuseum-visual-search");
    cy.get("main h1").should("have.text", "Rijksmuseum Visual Search");
  });

  // Mobile first and responsive: the same content on a phone, without sideways scrolling.
  it("fits a phone screen", () => {
    cy.viewport("iphone-x");
    cy.visit("/");
    cy.contains("h2", "Education").should("be.visible");
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth);
    });
  });
});

describe("privacy banner", () => {
  it("shows until a choice is made and remembers the choice", () => {
    cy.clearLocalStorage();
    cy.visit("/");
    cy.get('section[aria-label="Privacy"]')
      .should("be.visible")
      .contains("button", "Decline")
      .click();
    cy.get('section[aria-label="Privacy"]').should("not.exist");

    cy.window().its("localStorage").invoke("getItem", "privacy-consent").should("eq", "declined");
    cy.reload();
    cy.contains("h2", "Education").should("be.visible");
    cy.get('section[aria-label="Privacy"]').should("not.exist");
  });
});
