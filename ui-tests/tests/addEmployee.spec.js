const { test, expect } = require('@playwright/test');

const URL =
  'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/Login';

// =========================
// LOGIN
// =========================
const login = async (page) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  const username = page.getByRole('textbox').first();
  const password = page.getByRole('textbox').nth(1);
  const loginBtn = page.getByRole('button', { name: /log in/i });

  await expect(username).toBeVisible();
  await expect(password).toBeVisible();

  await username.fill('TestUser962');
  await password.fill('wLDj6m4Hm]$!');

  await Promise.all([
    page.waitForLoadState('networkidle').catch(() => {}),
    loginBtn.click()
  ]);

  await expect(page.getByRole('button', { name: /add employee/i }))
    .toBeVisible({ timeout: 15000 });
};

// =========================
// OPEN MODAL
// =========================
const openModal = async (page) => {
  const addBtn = page.getByRole('button', { name: /add employee/i });

  await addBtn.click();

  const modal = page.locator('#employeeModal');
  await expect(modal).toBeVisible();

  return modal;
};

// =========================
// HELPERS
// =========================
const getField = (modal, name) => {
  if (name === 'dependents') return modal.locator('#dependants');
  return modal.locator(`input[name="${name}"]`);
};

const safeFill = async (field, value) => {
  await expect(field).toBeVisible();
  await field.click();
  await field.fill(String(value));
};

const safeNumberFill = async (field, value) => {
  await field.click();
  await field.fill(String(value));
  await field.press('Tab');
};

// =========================
// FIX BUTTON BEHAVIOR
// =========================
const clickAddEmployee = async (page) => {
  const addBtn = page.locator('#addEmployee');

  await expect(addBtn).toBeVisible();

  await page.keyboard.press('Tab');
  await addBtn.focus();
  await addBtn.hover();

  await page.waitForTimeout(300);

  await addBtn.scrollIntoViewIfNeeded();
  await addBtn.click();
};

// =========================
// CANCEL FLOW
// =========================
const clickCancel = async (page) => {
  const cancelBtn = page.getByRole('button', { name: /cancel/i });

  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();

  await expect(page.locator('#employeeModal')).not.toBeVisible();
};

// =========================
// CALCULATION MODEL
// =========================
const calculateBenefits = ({ salary, dependents }) => {
  const gross = salary * 26;

  const benefits =
    (1000 / 26) +
    ((500 / 26) * dependents);

  const net = salary - benefits;

  return {
    gross: gross.toFixed(2),
    benefits: benefits.toFixed(2),
    net: net.toFixed(2),
  };
};

// =========================
// TESTS
// =========================
test.describe('Add Employee - Full QA Coverage', () => {

  // -------------------------
  // Test
  // -------------------------

  test('Happy path', async ({ page }) => {
    await login(page);
    const modal = await openModal(page);

    const user = `emp.${Date.now()}`;

    await safeFill(getField(modal, 'firstName'), 'Tony');
    await safeFill(getField(modal, 'lastName'), 'Stark');
    await safeNumberFill(getField(modal, 'dependents'), 2);
    await safeFill(getField(modal, 'salary'), 2000);
    await safeFill(getField(modal, 'username'), user);

    await clickAddEmployee(page);

    const row = page.locator('table tbody tr', { hasText: user });
    await expect(row).toBeVisible();

    const calc = calculateBenefits({ salary: 2000, dependents: 2 });

    await expect(row).toContainText(calc.gross);
    await expect(row).toContainText(calc.benefits);
    await expect(row).toContainText(calc.net);
  });

  test('Missing required fields', async ({ page }) => {
    await login(page);
    await openModal(page);

    await clickAddEmployee(page);

    await expect(page.locator('#employeeModal')).toBeVisible();
  });

  test('Invalid salary', async ({ page }) => {
    await login(page);
    const modal = await openModal(page);

    const user = `invalid.${Date.now()}`;

    await safeFill(getField(modal, 'firstName'), 'Tony');
    await safeFill(getField(modal, 'lastName'), 'Stark');
    await safeFill(getField(modal, 'salary'), 'ABC');
    await safeFill(getField(modal, 'username'), user);

    await clickAddEmployee(page);

    await expect(page.locator('table tbody tr', { hasText: user }))
      .not.toBeVisible();
  });

  test('Invalid dependents (negative)', async ({ page }) => {
    await login(page);
    const modal = await openModal(page);

    const user = `negdep.${Date.now()}`;

    await safeFill(getField(modal, 'firstName'), 'Tony');
    await safeFill(getField(modal, 'lastName'), 'Stark');
    await safeNumberFill(getField(modal, 'dependents'), -5);
    await safeFill(getField(modal, 'salary'), 2000);
    await safeFill(getField(modal, 'username'), user);

    await clickAddEmployee(page);

    await expect(page.locator('table tbody tr', { hasText: user }))
      .toBeVisible();
  });

  test('Empty inputs', async ({ page }) => {
    await login(page);
    await openModal(page);

    await clickAddEmployee(page);

    await expect(page.locator('#employeeModal')).toBeVisible();
  });

  test('Very long inputs', async ({ page }) => {
    await login(page);
    const modal = await openModal(page);

    const longText = 'A'.repeat(300);

    await safeFill(getField(modal, 'firstName'), longText);
    await safeFill(getField(modal, 'lastName'), longText);
    await safeFill(getField(modal, 'salary'), 2000);
    await safeFill(getField(modal, 'username'), `user${Date.now()}`);

    await clickAddEmployee(page);

    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Zero dependents', async ({ page }) => {
    await login(page);
    const modal = await openModal(page);

    const user = `zero.${Date.now()}`;

    await safeFill(getField(modal, 'firstName'), 'Tony');
    await safeFill(getField(modal, 'lastName'), 'Stark');
    await safeNumberFill(getField(modal, 'dependents'), 0);
    await safeFill(getField(modal, 'salary'), 2000);
    await safeFill(getField(modal, 'username'), user);

    await clickAddEmployee(page);

    const row = page.locator('table tbody tr', { hasText: user });
    await expect(row).toBeVisible();

    const calc = calculateBenefits({ salary: 2000, dependents: 0 });

    await expect(row).toContainText(calc.gross);
    await expect(row).toContainText(calc.benefits);
    await expect(row).toContainText(calc.net);
  });

  test('Cancel button should not create employee', async ({ page }) => {
    await login(page);
    const modal = await openModal(page);

    const user = `cancel.${Date.now()}`;

    await safeFill(getField(modal, 'firstName'), 'Bruce');
    await safeFill(getField(modal, 'lastName'), 'Wayne');
    await safeFill(getField(modal, 'username'), user);

    await clickCancel(page);

    await expect(page.locator('table tbody tr', { hasText: user }))
      .not.toBeVisible();
  });

  test('Duplicate employee should not create multiple entries', async ({ page }) => {
    await login(page);
    const modal = await openModal(page);

    const user = `dup.${Date.now()}`;

    const create = async () => {
      await safeFill(getField(modal, 'firstName'), 'Tony');
      await safeFill(getField(modal, 'lastName'), 'Stark');
      await safeNumberFill(getField(modal, 'dependents'), 1);
      await safeFill(getField(modal, 'salary'), 2000);
      await safeFill(getField(modal, 'username'), user);
      await clickAddEmployee(page);
    };

    await create();
    await openModal(page);
    await create();

    const rows = await page.locator('table tbody tr', { hasText: user }).count();
    expect(rows).toBe(1);
  });
  test('Negative dependents should not break employee creation', async ({ page }) => {
    await login(page);
    const modal = await openModal(page);
  
    const user = uniqueUser('negdep');
  
    await safeFill(getField(modal, 'firstName'), 'Tony');
    await safeFill(getField(modal, 'lastName'), 'Stark');
    await safeNumberFill(getField(modal, 'dependents'), -1);
    await safeFill(getField(modal, 'salary'), 2000);
    await safeFill(getField(modal, 'username'), user);
  
    await clickAddEmployee(page);
  
    const row = page.locator('table tbody tr', { hasText: user });
  
    // App behavior may vary:
    // - either rejects
    // - or normalizes to 0
    await expect(row).toBeVisible();
  });
  test('Extreme dependents (999) boundary test', async ({ page }) => {
    await login(page);
    const modal = await openModal(page);
  
    const user = uniqueUser('extreme');
  
    await safeFill(getField(modal, 'firstName'), 'Bruce');
    await safeFill(getField(modal, 'lastName'), 'Wayne');
    await safeNumberFill(getField(modal, 'dependents'), 999);
    await safeFill(getField(modal, 'salary'), 2000);
    await safeFill(getField(modal, 'username'), user);
  
    await clickAddEmployee(page);
  
    const row = page.locator('table tbody tr', { hasText: user });
  
    // Expected behavior depends on system rules:
    // - should still create employee OR validate max dependents rule
    await expect(row).toBeVisible();
  });
  test('High dependents boundary (50)', async ({ page }) => {
    await login(page);
    const modal = await openModal(page);

    const user = `bound.${Date.now()}`;

    await safeFill(getField(modal, 'firstName'), 'Clark');
    await safeFill(getField(modal, 'lastName'), 'Kent');
    await safeNumberFill(getField(modal, 'dependents'), 50);
    await safeFill(getField(modal, 'salary'), 2000);
    await safeFill(getField(modal, 'username'), user);

    await clickAddEmployee(page);

    const row = page.locator('table tbody tr', { hasText: user });
    await expect(row).toBeVisible();
  });

});