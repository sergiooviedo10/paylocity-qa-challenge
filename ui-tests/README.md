
---

# 🧪 2. `ui-tests/README.md` (PLAYWRIGHT FRAMEWORK)

```markdown id="ui1"
# UI Automation Tests (Playwright)

This folder contains UI automation tests for the Employee Management system using Playwright.

The tests validate core workflows including CRUD operations, input validation, and boundary scenarios.

---

## 📁 Structure

tests/
  login.spec.js
  addEmployee.spec.js
  editEmployee.spec.js
  deleteEmployee.spec.js

---

## 🧪 Covered Scenarios

### Login
- Valid login authentication

### Add Employee
- Valid employee creation
- Missing fields validation
- Invalid salary input
- Negative dependents
- Boundary values (0, 50, 999)
- Duplicate employee prevention
- Cancel flow validation

### Edit Employee
- Update employee details
- Cancel update scenario
- Invalid salary handling
- Dependency boundary testing

### Delete Employee
- Confirm deletion
- Cancel deletion
- Idempotency validation
- Bulk deletion flow

---

## ⚙️ Test Design Highlights

- Dynamic test data generation
- Stable selectors with Playwright best practices
- UI synchronization handling (waits, hover, scroll fixes)
- Edge case and negative testing included

---

## 🚀 Run Tests

```bash id="ui2"
npx playwright test ui-tests/tests
