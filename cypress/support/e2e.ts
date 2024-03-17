// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

Cypress.Commands.add("login", (email, password) => {
    cy.visit("/");
    // click on 'Into Radi Center'
    cy.get('a[href="/login"]').click();

    // fill in the form
    cy.get("input[name=email]").type(email);
    // {enter} causes the form to submit
    cy.get("input[name=password]").type(`${password}{enter}`, {
        log: false,
    });

    // we should be redirected to /dashboard
    cy.url().should("include", "/dashboard/manage/associated-project");
    // expect a cookie to be set
    cy.getCookie("auth_session").should("exist");
});

Cypress.Commands.add("getByTest", (selector, ...args) => {
    return cy.get(`[data-test=${selector}]`, ...args);
});

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>;
            getByTest(selector: string, ...args: any[]): Chainable<JQuery>;
        }
    }
}
