describe('Todo App', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('/');
    // Clear existing todos
    cy.window().then((win) => {
      win.fetch('http://localhost:8080/todos').then((res) => res.json()).then((todos) => {
        todos.forEach((todo: { id: string }) => {
          win.fetch(`http://localhost:8080/todos/${todo.id}`, { method: 'DELETE' });
        });
      });
    });
  });

  it('should create a new todo', () => {
    cy.get('[aria-label="Add Todo"]').click();
    cy.get('input[placeholder="Enter todo title..."]').type('Test Todo');
    cy.get('textarea[placeholder="Enter description..."]').type('Test Description');
    cy.get('select').select('high');
    cy.contains('Save').click();

    cy.contains('Test Todo').should('be.visible');
    cy.contains('Test Description').should('be.visible');
  });

  it('should edit an existing todo', () => {
    // Create a todo first
    cy.get('[aria-label="Add Todo"]').click();
    cy.get('input[placeholder="Enter todo title..."]').type('Original Todo');
    cy.get('textarea[placeholder="Enter description..."]').type('Original Description');
    cy.contains('Save').click();

    // Edit the todo
    cy.contains('Edit').click();
    cy.get('input[placeholder="Enter todo title..."]').clear().type('Updated Todo');
    cy.get('textarea[placeholder="Enter description..."]').clear().type('Updated Description');
    cy.contains('Save').click();

    cy.contains('Updated Todo').should('be.visible');
    cy.contains('Updated Description').should('be.visible');
  });

  it('should mark a todo as completed', () => {
    // Create a todo first
    cy.get('[aria-label="Add Todo"]').click();
    cy.get('input[placeholder="Enter todo title..."]').type('Todo to Complete');
    cy.contains('Save').click();

    // Mark as completed
    cy.get('[data-testid="todo-checkbox"]').first().click();
    cy.get('[data-testid="todo-checkbox"]').first().should('be.checked');
  });

  it('should delete a todo', () => {
    // Create a todo first
    cy.get('[aria-label="Add Todo"]').click();
    cy.get('input[placeholder="Enter todo title..."]').type('Todo to Delete');
    cy.contains('Save').click();

    // Set up the intercept before the action
    cy.intercept('DELETE', '**/todos/*').as('deleteTodo');
    
    // Delete the todo
    cy.get('[data-testid="delete-button"]').first().click();
    
    // Wait for the delete request to complete
    cy.wait('@deleteTodo');
    
    // Verify the todo is deleted
    cy.contains('Todo to Delete').should('not.exist');
  });
}); 