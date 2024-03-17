describe("Login Test", () => {
    it("Click on 'Into Radi Center' to login", () => {
        cy.visit("/");

        // click on 'Into Radi Center
        cy.get('a[href="/login"]').click();
        cy.login(Cypress.env("email"), Cypress.env("password"));
    });
});
