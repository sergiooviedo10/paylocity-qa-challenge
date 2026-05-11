# Paylocity QA Automation Framework

This repository contains a complete QA automation solution for an Employee Management system, covering both UI and API testing.

The project demonstrates end-to-end test automation, including functional testing, validation scenarios, boundary testing, and CI/CD integration using GitHub Actions.

---

## Tech Stack

- Playwright (UI Automation)
- Postman (API Testing)
- JavaScript (Node.js)
- GitHub Actions (CI/CD)

---

## Project Structure

ui-tests/         → Playwright UI automation tests  
postman/          → API test collections  
.github/workflows → CI/CD pipeline (GitHub Actions)

---

## Test Coverage Overview

### UI Automation (Playwright)
- Login authentication
- Add Employee (positive + negative + boundary)
- Edit Employee (update, cancel, validation rules)
- Delete Employee (confirm, cancel, idempotency)
- Input validation (salary, dependents, empty fields)

### API Testing (Postman)
- Employee CRUD operations
- API validation scenarios
- Data consistency checks

---

## CI/CD Pipeline

This project includes a GitHub Actions workflow that:

- Installs dependencies
- Installs Playwright browsers
- Executes UI test suite
- Runs on every push to `main`

Workflow:
.github/workflows/playwright.yml

---

## How to Run UI Tests

```bash id="root2"
npm install
npx playwright install
npx playwright test
## Notes
Sensitive credentials and confidential information have been excluded from this repository.
