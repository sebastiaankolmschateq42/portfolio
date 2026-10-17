import Field from "@/app/components/Field";

describe("<Field>", () => {
  it("links the label to its input", () => {
    cy.mount(
      <Field label="Email" htmlFor="email">
        <input id="email" />
      </Field>,
    );
    cy.contains("label", "Email").click();
    cy.focused().should("have.id", "email");
  });

  it("shows the error with an id the input can point to", () => {
    cy.mount(
      <Field label="Email" htmlFor="email" error="Invalid email address">
        <input id="email" aria-describedby="email-error" />
      </Field>,
    );
    cy.get("#email-error").should("have.text", "Invalid email address");
  });

  it("shows no error element when there is no error", () => {
    cy.mount(
      <Field label="Email" htmlFor="email">
        <input id="email" />
      </Field>,
    );
    cy.get("#email-error").should("not.exist");
  });
});
