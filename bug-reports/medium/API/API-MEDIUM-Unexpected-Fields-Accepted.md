# API accepts unexpected request fields despite schema restriction

## Severity
Medium

## Type
API / Schema Validation

## Environment
Paylocity Benefits API

## Description
The Employee API accepts additional unexpected properties in the request payload even though the Swagger schema defines strict validation with:

"additionalProperties": false

Despite this rule, the API processes the request successfully and returns a 200 OK response instead of rejecting unsupported fields.

## Steps to Reproduce

1. Send a POST request to:

/api/Employees

2. Include the following request body:

```json id="fmt2"
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "extra_field_test",
  "dependants": 1,
  "salary": 50000,
  "isAdmin": true,
  "hackField": "unexpected"
}

## Expected Result

API should reject the request due to unsupported fields and return:

400 Bad Request
## Actual Result

API accepts the request and returns:

200 OK

Employee record is created successfully, including unsupported fields in the payload.

## Impact

API does not enforce the defined schema restrictions, which may allow unintended or unsupported data to be processed. This indicates a gap in request validation and contract enforcement.
