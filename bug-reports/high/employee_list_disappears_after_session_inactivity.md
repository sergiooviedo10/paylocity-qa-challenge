# Employee list disappears after session inactivity

## Severity
High

---

## Environment
Application: Benefits Dashboard
Environment: QA / Test
Browser: Chrome (macOS)

---

## Description
After a period of inactivity, the employee list is no longer displayed even though the user remains on the dashboard page.

---

## Steps to Reproduce
1. Log in to the application
2. Navigate to the employee dashboard
3. Leave the session inactive for a period of time
4. Return to the application

---

## Expected Result
The application should either:
- reload employee data correctly, or
- redirect the user to the login page if the session has expired.

---

## Actual Result
The user remains on the dashboard page, but the employee list is no longer displayed.

---

## Frequency
Always

---

## Impact
This creates the impression that employee data has been lost and results in inconsistent session behavior within the application.

---

## Evidence
Not captured due to session expiration and state reset behavior.

---

## Notes
Likely related to improper handling of expired authentication state or failure to refresh employee data after inactivity.
