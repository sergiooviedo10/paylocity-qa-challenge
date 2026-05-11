# Delete Employee returns 401 Unauthorized but still deletes employee record

## Severity
API Bug High

---

## Environment
Application: Benefits Dashboard
Environment: QA / Test
Browser: Chrome (macOS)

---

## Description
When attempting to delete an employee, the application returns a 401 Unauthorized error response. However, after refreshing the page, the employee record is actually deleted from the system.

---

## Steps to Reproduce
1. Log in to the application
2. Navigate to the employee dashboard
3. Select the Delete (X) action for an employee
4. Observe API/network response
5. Refresh the page

---

## Expected Result
If deletion succeeds:
- API should return a successful response (200/204)
- UI should accurately reflect successful deletion

If authorization fails:
- employee should remain in the system

---

## Actual Result
The application returns:
401 Unauthorized

However, after refreshing the page, the employee record is deleted.

---

## Frequency
Always

---

## Impact
The application provides incorrect feedback regarding a destructive action. Users may believe the deletion failed and attempt repeated actions, causing confusion and inconsistent system behavior.

---

## Evidence
- Screenshot of 401 Unauthorized response
- Employee removed after page refresh

---

## Notes
This may indicate inconsistent backend authorization handling or incorrect frontend interpretation of API responses.
