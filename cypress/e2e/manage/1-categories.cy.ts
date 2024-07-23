import { ErrorMessage } from "../../../src/types/error";
import noPermissionUser from "../../fixtures/users/no_permission_user.json";
import categoryUser from "../../fixtures/users/category_user.json";

describe("Manage Categories Test", () => {
    // run once before all tests
    before(() => {
        // Cypress automatically clears all session storage before each test to prevent state from being shared across tests when test isolation is enabled. You shouldn't need to use this command unless you're using it to clear sessionStorage inside a single test or test isolation is disabled.
        cy.clearAllSessionStorage();
    });

    // run on every it block test
    beforeEach(() => {
        // cy.login(noPermissionUser.email, noPermissionUser.password);
        cy.session(categoryUser.email, () => {
            cy.login(categoryUser.email, categoryUser.password);
            cy.getByTest("manageCategories").click();
        });
    });

    // run once after all tests
    after(() => {
        cy.clearAllSessionStorage();
    });

    it("Should be able to visit manage categories", () => {
        cy.url().should("include", "/dashboard/categories");
        cy.getByTest("errorMessage").should(
            "not.eq",
            ErrorMessage.NoPermissionToThisPage,
        );
    });

    const name = "FromCypress";
    const description = "FromCypressDescription";

    it("Should be able to add new category", () => {
        cy.getByTest("createCategory").click();

        // fill the form
        cy.get('input[name="name"]').type(name);
        cy.get('input[name="description"]').type(`${description}{enter}`);

        cy.getByTest(`categoryName-${name}`).should("contain.text", name);
        cy.getByTest(`categoryDescription-${description}`).should(
            "contain.text",
            description,
        );
    });

    const newName = "FromCypressEdited";
    const newDescription = "FromCypressDescriptionEdited";

    it("Should be able to edit category", () => {
        // edit the category
        cy.getByTest(`editCategory-${name}`).click();
        cy.get('input[name="name"]').clear().type(newName);
        cy.get('input[name="description"]')
            .clear()
            .type(`${newDescription}{enter}`);

        // check if the category is edited
        cy.getByTest(`categoryName-${newName}`).should("contain.text", newName);
        cy.getByTest(`categoryDescription-${newDescription}`).should(
            "contain.text",
            newDescription,
        );
    });

    it("Should be able to delete category", () => {
        // click delete button to show overlay
        cy.getByTest(`deleteCategory-${newName}`).click();
        // actual delete button
        cy.getByTest("deleteCategoryBtn").click();

        // check if the category is deleted
        cy.getByTest(`categoryName-${newName}`).should("not.exist");
    });
});
