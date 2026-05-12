# Login page does not allow submitting form using ENTER key

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
Pressing the ENTER key on the login page does not trigger the login action. Users are forced to click the "Log In" button manually.

---

## Steps to Reproduce
1. Open login page
2. Enter valid username and password
3. Press ENTER key instead of clicking Log In button

---

## Expected Result
- Pressing ENTER should submit the login form
- User should be authenticated and redirected to dashboard

---

## Actual Result
- Nothing happens when ENTER is pressed
- User remains on login page

---

## Frequency
Always

---

## Impact
Poor user experience and non-standard form behavior across web applications

---

## Notes
Form submission event is not properly bound to keypress event.
