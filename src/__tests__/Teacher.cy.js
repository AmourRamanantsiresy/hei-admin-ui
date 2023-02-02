import { mount } from '@cypress/react'
import App from '../App'
import { teacher1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { teacher1Mock, whoamiTeacherMock, student1Mock, studentsMock, studentNameToBeCheckedMock, TaecherNameToBeCheckedMock } from './mocks/responses'

describe(specTitle('Teacher'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(teacher1.username)
    cy.get('#password').type(teacher1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', `/whoami`, whoamiTeacherMock).as('getWhoami')
    cy.intercept('GET', `/teachers/${teacher1Mock.id}`, teacher1Mock).as('getTeacher')
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudentsPage1')
    cy.intercept('GET', `/students?page=2&page_size=10`, studentsMock).as('getStudentsPage2')
    cy.intercept('GET', `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`, [student1Mock]).as('getStudentByName')
  })

  it('lands on profile page if succeeds', () => {
    cy.get('#first_name').contains(TaecherNameToBeCheckedMock)
  })

  it('can list and filter students', () => {
    cy.contains(TaecherNameToBeCheckedMock)
    cy.get('a[href="#/students"]').click() // Étudiants menu
    cy.wait('@getStudentsPage1')
    cy.get('body').click(200, 0) //note(uncover-menu)
    //cy.contains('Page : 1')
    //cy.contains('Taille : 10')

    cy.get('button').contains('Suivant').click()
    cy.wait(['@getStudentsPage2'])
    //cy.contains('Page : 2')

    cy.wait(['@getTeacher', '@getWhoami'])
    
    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="last_name"]').click()
    cy.get('#last_name').type(studentNameToBeCheckedMock)
    //cy.contains('Page : 1')
    //cy.contains('Taille : 1')
  })
})
