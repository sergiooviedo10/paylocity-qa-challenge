# Login authentication issues: case sensitivity inconsistencies and incorrect error response (405)

## Severity
UI / API bug  
High

---

## Environment
Application: Benefits Dashboard  
Environment: QA / Test  
Browser: Chrome (macOS)

---

## Description
The login functionality has multiple authentication inconsistencies related to case sensitivity:

1. Username case sensitivity behaves inconsistently depending on input variation.
2. Password case mismatch triggers an HTTP 405 Method Not Allowed error instead of a proper authentication failure response.

These issues indicate improper authentication handling and incorrect API error responses.

---

## Steps to Reproduce

### Scenario 1: Username case variation
1. Open login page  
2. Enter username in uppercase (e.g. `TESTUSER962`)  
3. Enter valid password (`wLDj6m4Hm]$!`)  
4. Click Log In  

---

### Scenario 2: Password case sensitivity
1. Open login page  
2. Enter valid username (`TestUser962`)  
3. Enter password with incorrect casing (e.g. `WLDJ6M4HM]$!`)  
4. Click Log In  

---

## Expected Result
- Username handling should be consistent (case-insensitive or clearly defined rule)
- Password mismatch should return:
  - HTTP 401 Unauthorized
  - or a controlled authentication error message
- UI should display a user-friendly message such as "Invalid credentials"

---

## Actual Result
- Username case variation leads to inconsistent login behavior
- Password case mismatch returns HTTP 405 Method Not Allowed
- No proper UI error message is shown for authentication failure

---

## Frequency
Always reproducible

---

## Impact
- Authentication inconsistency for end users
- Incorrect API behavior (wrong HTTP status code)
- Poor UX due to missing or misleading error handling
- Potential backend routing or authentication misconfiguration

---

## Notes
- HTTP 405 indicates improper endpoint handling rather than authentication failure
- Authentication layer does not consistently normalize or validate credentials
- Frontend and backend error handling are not aligned
