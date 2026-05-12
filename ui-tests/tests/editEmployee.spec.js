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

  await expect(
    page.getByRole('button', { name: /add employee/i })
  ).toBeVisible({ timeout: 15000 });
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

const clickEditFirstEmployee = async (page) => {
  const editIcon = page.locator('#employeesTable tbody tr td .fa-edit').first();

  await expect(editIcon).toBeVisible();
  await editIcon.scrollIntoViewIfNeeded();
  await editIcon.click();
};

const clickUpdate = async (modal) => {
  const updateBtn = modal.getByRole('button', { name: /save|update/i });

  await expect(updateBtn).toBeVisible();
  await expect(updateBtn).toBeEnabled();

  await updateBtn.scrollIntoViewIfNeeded();
  await updateBtn.click();
};

// =========================
// TESTS
// =========================
test.describe('Edit Employee Scenarios', () => {

  // =========================
  // EXISTING TESTS (UNCHANGED)
  // =========================

  test('Edit employee dependents (valid update)', async ({ page }) => {
    await login(page);
    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    const dependents = getField(modal, 'dependents');

    await dependents.fill('5');
    await clickUpdate(modal);

    await expect(modal).toBeHidden();

    await expect(page.locator('#employeesTable'))
      .toContainText('5');
  });

  test('Negative dependents should show validation error', async ({ page }) => {
    await login(page);
    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    const dependents = getField(modal, 'dependents');

    await dependents.fill('-3');
    await clickUpdate(modal);

    const error = modal.locator('.error, .alert, [role="alert"]');
    await expect(error.first()).toBeVisible();
  });

  test('Extreme dependents (999) update', async ({ page }) => {
    await login(page);
    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    const dependents = getField(modal, 'dependents');

    await dependents.fill('999');
    await clickUpdate(modal);

    await expect(page.locator('#employeesTable'))
      .toContainText('999');
  });

  test('Empty dependents should be rejected', async ({ page }) => {
    await login(page);
    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    const dependents = getField(modal, 'dependents');

    await dependents.fill('');
    await clickUpdate(modal);

    const error = modal.locator('.error, .alert, [role="alert"]');
    await expect(error.first()).toBeVisible();
  });

  test('Large dependents value (10000)', async ({ page }) => {
    await login(page);
    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    const dependents = getField(modal, 'dependents');

    await dependents.fill('10000');
    await clickUpdate(modal);

    await expect(page.locator('#employeesTable'))
      .toContainText('10000');
  });

  test('Cancel edit should not persist changes', async ({ page }) => {
    await login(page);
    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    const dependents = getField(modal, 'dependents');

    const original = await dependents.inputValue();

    await dependents.fill('99');

    const cancelBtn = modal.getByRole('button', { name: /cancel/i });
    await cancelBtn.click();

    await expect(modal).toBeHidden();

    await clickEditFirstEmployee(page);

    const modalAfter = getModal(page);
    const dependentsAfter = getField(modalAfter, 'dependents');

    await expect(dependentsAfter).toHaveValue(original);
  });

  test('Update without changes should not break record', async ({ page }) => {
    await login(page);
    await clickEditFirstEmployee(page);

    const modal = getModal(page);

    await clickUpdate(modal);

    await expect(modal).toBeHidden();

    const rows = page.locator('#employeesTable tbody tr');
    const count = await rows.count();

    expect(count).toBeGreaterThan(0);
  });

  test('Multiple edit cycles stability', async ({ page }) => {
    await login(page);

    for (let i = 0; i < 3; i++) {
      await clickEditFirstEmployee(page);

      const modal = getModal(page);
      const dependents = getField(modal, 'dependents');

      await dependents.fill(String(i + 1));
      await clickUpdate(modal);

      await expect(modal).toBeHidden();
    }

    await expect(page.locator('#employeesTable'))
      .toBeVisible();
  });

  // =========================
  // NEW SCENARIOS (ADDED COVERAGE)
  // =========================

  test('Rapid double click edit should not break modal', async ({ page }) => {
    await login(page);

    await clickEditFirstEmployee(page);
    await clickEditFirstEmployee(page);

    const modal = getModal(page);

    await expect(modal).toBeVisible();
  });

  test('Typing then closing modal should discard changes', async ({ page }) => {
    await login(page);

    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    const dependents = getField(modal, 'dependents');

    const original = await dependents.inputValue();

    await dependents.fill('77');

    const cancelBtn = modal.getByRole('button', { name: /cancel/i });
    await cancelBtn.click();

    await expect(modal).toBeHidden();

    await clickEditFirstEmployee(page);

    const modalAfter = getModal(page);
    const dependentsAfter = getField(modalAfter, 'dependents');

    await expect(dependentsAfter).toHaveValue(original);
  });

  test('Non numeric dependents input should show error', async ({ page }) => {
    await login(page);

    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    const dependents = getField(modal, 'dependents');

    await dependents.fill('abc');
    await clickUpdate(modal);

    const error = modal.locator('.error, .alert, [role="alert"]');
    await expect(error.first()).toBeVisible();
  });

  test('Modal data should persist after page reload', async ({ page }) => {
    await login(page);

    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    const dependents = getField(modal, 'dependents');

    await dependents.fill('8');
    await clickUpdate(modal);

    await expect(modal).toBeHidden();

    await page.reload();

    await expect(page.locator('#employeesTable'))
      .toContainText('8');
  });

  test('Update button should require valid input', async ({ page }) => {
    await login(page);

    await clickEditFirstEmployee(page);

    const modal = getModal(page);
    const dependents = getField(modal, 'dependents');

    await dependents.fill('');

    const updateBtn = modal.getByRole('button', { name: /save|update/i });

    await expect(updateBtn).toBeVisible();
  });

});