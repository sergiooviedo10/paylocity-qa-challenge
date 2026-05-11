# Employee list disappears after hard refresh following successful login

## Bug Type
UI / State Management Issue

## Severity
Medium

---

## Environment
Application: Benefits Dashboard  
Browser: Chrome (macOS)  
Environment: QA

---

## Description
After successfully logging into the application, the employee list is displayed correctly. However, performing a hard refresh (browser reload) causes the employee list to disappear.

The UI does not consistently restore or reload employee data after the page refresh.

---

## Steps to Reproduce
1. Navigate to the application login page
2. Enter valid credentials and log in
3. Observe employee list is displayed
4. Perform a hard refresh (Ctrl+R / Cmd+R)
5. Observe the employee list is no longer visible

---

## Expected Result
- After refresh, the application should restore session state
- Employee list should be re-fetched and displayed correctly

---

## Actual Result
- Employee list disappears after refresh
- No data is shown in the UI until further interaction (if applicable)

---

## Frequency
Always

---

## Impact
This affects user experience and data visibility after page reload. Users may believe their data has been lost or session is broken, reducing trust in application stability.

---

## Evidence
- Screenshot before refresh showing employee list
- Screenshot after refresh showing empty state
- Network tab showing whether GET employees is triggered (if applicable)

---

## Notes
Likely related to frontend state initialization or missing data fetch on page load after authentication.
