# Add Employee allows invalid characters in name fields with no validation

## Severity
High

---

## Environment
Application: Benefits Dashboard
Environment: QA / Test
Browser: Chrome (macOS)

---

## Description
The Add Employee form allows invalid input in First Name and Last Name fields, including numeric and special characters. No client-side validation is displayed. The API request is sent and returns a 401 Unauthorized response instead of a validation error.

---

## Steps to Reproduce
1. Open Add Employee form
2. Enter numeric values in First Name (e.g., 12345)
3. Enter special characters in Last Name (e.g., @@@###!!!)
4. Click Save
5. Observe UI and network response

---

## Expected Result
- UI should validate name fields and restrict invalid characters
- Form submission should be blocked until valid input is provided
- API should return a validation error (400 Bad Request)

---

## Actual Result
- No validation messages are shown in the UI
- Form allows submission of invalid input
- API returns 401 Unauthorized

---

## Frequency
Always

---

## Impact
Users can enter invalid employee data, leading to poor data quality and inconsistent system behavior.

---

## Evidence
- Network response: 401 Unauthorized
- No UI validation displayed for invalid characters

---

## Notes
This indicates missing frontend validation and inconsistent backend error handling for invalid input data.

## Additional Validation Observation (Long Input Test)

When extremely long strings were entered into First Name and Last Name fields, the application behaved the same way:

- No UI validation was displayed
- The form accepted oversized input
- API returned 401 Unauthorized

This confirms lack of input validation for both invalid characters and boundary length conditions.
