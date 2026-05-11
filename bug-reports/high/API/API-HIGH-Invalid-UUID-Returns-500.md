# API returns 500 Internal Server Error for invalid UUID input

## Severity
High

## Type
API / Input Validation

## Environment
Paylocity Benefits API

## Description
The API returns a 500 Internal Server Error when an invalid UUID value is provided in employee endpoint path parameters.

Malformed client input should be validated and rejected gracefully with a 400 Bad Request response instead of causing a server-side exception.

## Steps to Reproduce

1. Send GET request to:

/api/Employees/abc123

OR

2. Send DELETE request to:

/api/Employees/abc123

## Expected Result
API should return a validation error such as:
- 400 Bad Request

## Actual Result
API returns:
- 500 Internal Server Error

## Impact
Improper input validation may expose backend instability and poor error handling behavior.
