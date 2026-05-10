# Add Employee allows empty submission with no validation and returns 401 Unauthorized

## Severity
High

---

## Environment
Application: Benefits Dashboard
Environment: QA / Test
Browser: Chrome (macOS)

---

## Description
The Add Employee form allows submission with all fields left blank. No client-side validation messages are displayed. The API request is sent and returns a 401 Unauthorized response instead of a validation error.

---

## Steps to Reproduce
1. Open Add Employee form
2. Leave all input fields empty
3. Click Save
4. Observe UI behavior and network response

---

## Expected Result
- UI should display validation messages for required fields
- Form submission should be blocked until valid input is provided
- API should not be called with invalid data

---

## Actual Result
- No validation errors are shown in the UI
- Form submits empty data
- API returns 401 Unauthorized

---

## Frequency
Always

---

## Impact
Users can attempt to submit incomplete employee data without guidance, resulting in poor user experience and unnecessary API requests.

---

## Evidence
- Network response: 401 Unauthorized
- No UI validation messages displayed

---

## Notes
This indicates missing frontend validation and improper backend error handling for invalid input payloads.
