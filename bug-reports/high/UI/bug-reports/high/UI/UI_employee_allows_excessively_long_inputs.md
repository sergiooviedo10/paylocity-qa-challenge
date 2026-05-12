# Add and Edit Employee allow excessively long input values without validation

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
The system allows excessively long text input in employee fields (First Name, Last Name, etc.) without validation or restriction.

---

## Steps to Reproduce
1. Open Add or Edit Employee modal
2. Enter a very long string (e.g. 200–300 characters) in name fields
3. Click Save/Update

---

## Expected Result
- Input should be limited to reasonable length
- Validation error or character limit should be enforced

---

## Actual Result
- Long input is accepted
- Employee is created/updated successfully without restriction

---

## Frequency
Always

---

## Impact
- UI layout issues in employee table
- Potential database storage problems
- Poor data quality

---

## Notes
No max-length validation implemented on frontend or backend.
