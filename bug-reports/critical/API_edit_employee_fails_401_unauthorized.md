# Edit Employee fails with 401 Unauthorized error

## Severity
API Bug Critical

---

## Environment
Application: Benefits Dashboard
Environment: QA / Test
Browser: Chrome (macOS)

---

## Description
When attempting to edit employee information through the UI, the request fails with a 401 Unauthorized response, preventing any updates from being saved.

---

## Steps to Reproduce
1. Log in to the application
2. Navigate to the employee dashboard
3. Select Edit for an existing employee
4. Modify any employee field
5. Click Save
6. Observe network response in DevTools

---

## Expected Result
Employee information should update successfully and changes should be reflected in the employee table.

---

## Actual Result
The API request returns:
401 Unauthorized

Employee changes are not saved.

---

## Frequency
Always

---

## Impact
Users are unable to edit employee information, which breaks a core business workflow and prevents maintenance of employee records.

---

## Evidence
- Screenshot of network response showing 401 Unauthorized
- API response:
```json
{
  "type": "https://tools.ietf.org/html/rfc7235#section-3.1",
  "title": "Unauthorized",
  "status": 401
}
```

---

## Notes
Likely related to missing or invalid Authorization header in the API request initiated by the UI.
