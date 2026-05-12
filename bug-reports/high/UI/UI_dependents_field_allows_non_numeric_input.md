# Dependents field does not validate numeric input in Add and Edit Employee

## Severity
UI bug  
High

---

## Environment
Application: Benefits Dashboard  
Environment: QA / Test  
Browser: Chrome (macOS)

---

## Description
The Dependents field accepts non-numeric input without validation in both Add and Edit Employee flows.

---

## Steps to Reproduce
1. Open Add or Edit Employee modal
2. Enter text like "abc" in Dependents field
3. Click Save/Update

---

## Expected Result
- Field should only accept numeric values
- Validation error should be displayed for invalid input

---

## Actual Result
- Non-numeric values are accepted or silently ignored
- Request is still submitted

---

## Frequency
Always

---

## Impact
Incorrect benefit calculations and invalid employee data

---

## Notes
No input type enforcement or validation rules applied.
