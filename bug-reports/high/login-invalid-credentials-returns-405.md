# Login fails with HTTP 405 error on invalid credentials

## Severity
High

## Steps to Reproduce
1. Go to login page
2. Enter invalid username
3. Enter invalid password
4. Click login

## Expected Result
User should see a validation message such as:
"Invalid username or password"

## Actual Result
The application returns an HTTP 405 error page:
"This page isn’t working"

## Impact
User experience is broken and backend error handling is exposed when incorrect credentials are submitted.

## Notes
Other login validation scenarios (empty fields and wrong password only) behave correctly.
