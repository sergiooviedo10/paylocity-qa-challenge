# Add Employee fails with 401 Unauthorized due to missing Authorization header

## Severity
Critical

---

## Environment
Application: Benefits Dashboard
Environment: QA / Test
Browser: Chrome (macOS)

---

## Description
When attempting to add a new employee via the UI, the request fails with a 401 Unauthorized response. The request does not include the required Authorization header, preventing employee creation.

---

## Steps to Reproduce
1. Log in to the application
2. Navigate to Add Employee
3. Enter valid employee details
4. Click Save
5. Observe network request in DevTools

---

## Expected Result
The request should include a valid Authorization header and successfully create the employee (200/201 response).

---

## Actual Result
The API request returns:
401 Unauthorized

No Authorization header is present in the request.

---

## Frequency
Always

---

## Impact
Users cannot create employees, which breaks the core functionality of the application. This affects payroll setup, benefit calculations, and overall system usability.

---

## Evidence
![401 Unauthorized Add Employee](../../evidence/add_employee_401_unauthorized.png)

---

## Notes
This indicates a frontend authentication/session handling issue where the Authorization token is not attached to API requests.
