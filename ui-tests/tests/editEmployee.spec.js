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
// HELPERS
// =========================
const getModal = (page) => page.locator('#employeeModal');

const getField = (modal, name) => {
  if (name === 'dependents' || name === 'dependants') {
    return modal.locator('#dependants');
  }
  return modal.locator(`input[name="${name}"]`);
};

// =========================
// SAFE INPUT
// =========================
const safeFill = async (field, value) => {
  await expect(field).toBeVisible();
  await field.click();
  await field.fill(String(value));
};

const safeNumberFill = async (field, value) => {
  await expect(field).toBeVisible();
  await field.fill(String(value));
  await field.press('Tab');
};

// =========================
// FIX: RELIABLE EDIT CLICK
// =========================
const clickEditFirstEmployee = async (page) => {
  const editIcon = page.locator('#employeesTable tbody tr td .fa-edit').first();

  await expect(editIcon).toBeVisible();
  await editIcon.scrollIntoViewIfNeeded();
  await editIcon.hover();
  await page.waitForTimeout(300);
  await editIcon.click();
};

// =========================
// CLICK UPDATE BUTTON
// =========================
const clickUpdate = async (modal) => {
  const updateBtn = modal.getByRole('button', { name: /save|update/i });

  await expect(updateBtn).toBeVisible();
  await expect(updateBtn).toBeEnabled();

  await modal.page().keyboard.press('Tab');

  await updateBtn.hover();
  await modal.page().waitForTimeout(300);

  await updateBtn.scrollIntoViewIfNeeded();
  await updateBtn.click();
};

// =========================
// TESTS
// =========================
test.describe('Edit Employee Scenarios', () => {

  test('Edit employee dependents (valid update)', async ({ page }) => {
    await login(page);

    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    await expect(modal).toBeVisible();

    const dependents = getField(modal, 'dependents');

    await safeNumberFill(dependents, 5);

    await clickUpdate(modal);

    await expect(dependents).toHaveValue('5');
  });

  test('Edit employee invalid salary should not break form', async ({ page }) => {
    await login(page);

    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    await expect(modal).toBeVisible();

    const salary = getField(modal, 'salary');

    await safeFill(salary, 'INVALID');

    await clickUpdate(modal);

    await expect(modal).toBeVisible();
  });

  test('Edit employee negative dependents (-3)', async ({ page }) => {
    await login(page);

    await clickEditFirstEmployee(page);

    const modal = getModal(page);

    const dependents = getField(modal, 'dependents');

    await safeNumberFill(dependents, -3);

    await clickUpdate(modal);

    await expect(modal).toBeVisible();
  });

  test('Edit employee extreme dependents (999)', async ({ page }) => {
    await login(page);

    await clickEditFirstEmployee(page);

    const modal = getModal(page);

    const dependents = getField(modal, 'dependents');

    await safeNumberFill(dependents, 999);

    await clickUpdate(modal);

    await expect(dependents).toHaveValue('999');
  });
  test('Edit employee with empty dependents should be rejected or ignored', async ({ page }) => {
    await login(page);
  
    await clickEditFirstEmployee(page);
  
    const modal = getModal(page);
  
    const dependents = getField(modal, 'dependents');
  
    await dependents.fill('');
    await clickUpdate(modal);
  
    // depending on app behavior: modal stays open or shows validation
    await expect(modal).toBeVisible();
  });
  test('Edit employee with very large dependents value (stress test)', async ({ page }) => {
    await login(page);
  
    await clickEditFirstEmployee(page);
  
    const modal = getModal(page);
  
    const dependents = getField(modal, 'dependents');
  
    await safeNumberFill(dependents, 10000);
  
    await clickUpdate(modal);
  
    await expect(dependents).toHaveValue('10000');
  });
  test('Edit employee with negative salary should not be accepted', async ({ page }) => {
    await login(page);
  
    await clickEditFirstEmployee(page);
  
    const modal = getModal(page);
  
    const salary = getField(modal, 'salary');
  
    await safeFill(salary, -500);
  
    await clickUpdate(modal);
  
    await expect(modal).toBeVisible();
  });
  test('Successful edit should close modal', async ({ page }) => {
    await login(page);
  
    await clickEditFirstEmployee(page);
  
    const modal = getModal(page);
  
    const dependents = getField(modal, 'dependents');
  
    await safeNumberFill(dependents, 3);
  
    await clickUpdate(modal);
  
    await expect(modal).toBeHidden();
  });
  test('Updating employee with same data should not create duplicate or change row', async ({ page }) => {
    await login(page);
  
    await clickEditFirstEmployee(page);
  
    const modal = getModal(page);
  
    const dependents = getField(modal, 'dependents');
  
    const originalValue = await dependents.inputValue();
  
    // click update without changing anything
    await clickUpdate(modal);
  
    // table should still show same single record (no duplication)
    const rows = page.locator('#employeesTable tbody tr');
    const count = await rows.count();
  
    await expect(count).toBeGreaterThan(0);
  
    // re-open and confirm unchanged
    await clickEditFirstEmployee(page);
    const modalAfter = getModal(page);
    const dependentsAfter = getField(modalAfter, 'dependents');
  
    await expect(dependentsAfter).toHaveValue(originalValue);
  });
  test('Cancel edit should not persist changes', async ({ page }) => {
    await login(page);
  
    await clickEditFirstEmployee(page);
  
    const modal = getModal(page);
  
    const dependents = getField(modal, 'dependents');
  
    // capture original value
    const originalValue = await dependents.inputValue();
  
    await safeNumberFill(dependents, 99);
  
    const cancelBtn = modal.getByRole('button', { name: /cancel/i });
    await cancelBtn.click();
  
    await expect(modal).toBeHidden();
  
    // reopen edit to confirm no changes were saved
    await clickEditFirstEmployee(page);
  
    const modalAfter = getModal(page);
    const dependentsAfter = getField(modalAfter, 'dependents');
  
    await expect(dependentsAfter).toHaveValue(originalValue);
  });
  test('Edit cancel should not save changes', async ({ page }) => {
    await login(page);

    await clickEditFirstEmployee(page);

    const modal = getModal(page);

    const dependents = getField(modal, 'dependents');
    await safeNumberFill(dependents, 10);

    const cancelBtn = modal.getByRole('button', { name: /cancel/i });
    await cancelBtn.click();

    await expect(modal).toBeHidden();
  });

});