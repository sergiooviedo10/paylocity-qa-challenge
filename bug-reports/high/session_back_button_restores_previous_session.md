# Application allows access to previous authenticated session via browser back button after session expiration

## Severity
High

---

## Environment
Application: Benefits Dashboard
Browser: Chrome (macOS)

---

## Description
After a period of inactivity, the application displays an HTTP 405 error page. However, using the browser Back button allows the user to return to a previously authenticated session state.

---

## Steps to Reproduce
1. Log in to the application with wrong user or password
2. check you get HTTP 405 error page
3. Click browser Back button
4. check you see the previous login session

---

## Expected Result
After getting http 405 error, the user should be fully logged out and prevented from accessing any previously authenticated pages. The system should redirect to the login page.

---

## Actual Result
The user is able to navigate back to a previous authenticated session using the browser Back button.

---

## Impact
This creates inconsistent session behavior and may allow users to view stale authenticated pages after session expiration, leading to confusion and potential security concerns.

---

## Evidence
Not captured due to session reset state.

---

## Notes
Likely related to improper session invalidation and missing cache-control or route protection after authentication failed.
