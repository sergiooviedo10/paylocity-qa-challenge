# API allows duplicate usernames and duplicate info during employee creation

## Severity
Medium

## Type
API / Data Validation

## Environment
Paylocity Benefits API

## Description
The API allows multiple employees to be created using the same username value without validation or uniqueness enforcement.

This may lead to data integrity issues and ambiguity when identifying employees.

## Steps to Reproduce
1. Send POST request to:
   /api/Employees

2. Use payload:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "duplicate_test_user",
  "dependants": 1,
  "salary": 50000
}
