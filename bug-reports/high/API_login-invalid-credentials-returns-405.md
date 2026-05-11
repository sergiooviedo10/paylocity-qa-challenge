# Login Failure Returns HTTP 405 Error on Invalid Credentials

## Severity
API bug High

---

## Environment
Application: Benefits Dashboard
Environment: QA / Test Environment
Browser / Tool: (add your browser, e.g. Chrome)
Version: (add version if known)

---

## Description
When invalid login credentials are entered (both username and password incorrect), the application returns an HTTP 405 error page instead of a user-friendly authentication error message.

---

## Steps to Reproduce
1. Navigate to the login page
2. Enter an invalid username
3. Enter an invalid password
4. Click on the Login button

---

## Expected Result
The system should display a user-friendly validation message such as:
“Invalid username or password.”

No server error page should be displayed.

---

## Actual Result
The application displays a server error page:
“This page isn’t working – HTTP ERROR 405”

---

## Frequency
Always

---

## Impact
- Poor user experience due to technical error being exposed to end users
- Authentication failure is not handled gracefully
- Potential backend misconfiguration or improper error handling
- Could reduce user trust in the system

---

## Evidence
Screenshots: (attach screenshot of HTTP 405 page)
Logs: N/A
API response: N/A

---

## Notes
Other login scenarios behave correctly:
- Incorrect password only → proper validation message displayed
- Empty fields → proper field validation messages displayed
