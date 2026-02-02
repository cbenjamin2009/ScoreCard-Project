const uploadFixture = 'dept-scorecard.xlsx';

describe('Scorecard dashboard', () => {
  beforeEach(() => {
    cy.request('POST', '/api/reset');
    cy.setCookie('scorecard-cadence', 'weekly');
    cy.visit('/');
  });

  it('renders data and core controls', () => {
    cy.get('.dashboard__header').should('be.visible');
    cy.get('.dashboard__logo').should('be.visible');
    cy.get('.metric-card').should('have.length.greaterThan', 0);

    cy.contains('button', 'Refresh data').should('be.enabled');
    cy.contains('button', 'Export PDF').should('be.enabled');
    cy.contains('button', 'Reset template').should('be.enabled');

    cy.intercept('GET', '/api/scorecard*').as('refresh');
    cy.contains('button', 'Refresh data').click();
    cy.wait('@refresh', { timeout: 20000 }).its('response.statusCode').should('eq', 200);
  });

  it('switches cadence and updates the label', () => {
    cy.contains('button', 'Monthly').click();
    cy.contains('button.segment--active', 'Monthly', { timeout: 20000 }).should('exist');
    cy.contains('.summary-card', 'Cadence', { timeout: 20000 }).find('h2').should('contain', 'Monthly');
  });

  it('uploads a workbook and resets back to the default template', () => {
    cy.intercept('POST', '/api/upload*').as('upload');
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${uploadFixture}`, { force: true });
    cy.wait('@upload', { timeout: 20000 }).its('response.statusCode').should('eq', 200);
    cy.contains('Upload complete. Dashboard refreshed.').should('be.visible');
    cy.contains('.link-button', uploadFixture).should('be.visible');

    cy.intercept('POST', '/api/reset*').as('reset');
    cy.contains('button', 'Reset template').click();
    cy.wait('@reset', { timeout: 20000 }).its('response.statusCode').should('eq', 200);
    cy.contains('.link-button', 'Scorecard Template.xlsx').should('be.visible');
  });
});
