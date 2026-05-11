
---

# 📡 3. `postman/README.md` (API TESTING)

```markdown id="api1"
# API Testing (Postman Collection)

This folder contains API tests for the Employee Management system using Postman.

It validates backend functionality, data consistency, and CRUD operations.

---

## 📁 Structure

postman/
  Employee_API_Collection.json
  environment.json

---

## 🧪 Covered API Scenarios

### Employee API
- Create employee
- Get employee details
- Update employee
- Delete employee

### Validation Testing
- Required fields validation
- Invalid payload handling
- Data type validation
- Edge cases for input data

---

## 🚀 How to Run

### Option 1: Postman UI
1. Import collection into Postman
2. Select environment
3. Run collection

### Option 2: Newman CLI

```bash id="api2"
npm install -g newman
newman run postman/Employee_API_Collection.json
