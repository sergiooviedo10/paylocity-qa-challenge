# API allows creation of employee with extra accepted negative salary value in the json

## Severity
High

## Type
API / Business Logic Validation

## Environment
Paylocity Benefits API

## Description
The API accepts negative salary values during employee creation.

A negative salary is not valid business data for payroll processing and may result in incorrect payroll and benefits calculations.

## Steps to Reproduce
1. Send POST request to:
   /api/Employees

2. Use payload:

```json
{
  "firstName": "Negative",
  "lastName": "Salary",
  "username": "negative_salary_test",
  "dependants": 1,
  "salary": -50000
}
