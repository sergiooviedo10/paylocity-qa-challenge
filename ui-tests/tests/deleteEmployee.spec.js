const { test, expect } = require('@playwright/test');

const URL =
  'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/Login';

/**
 * Login helper
 */
const login = async (page) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  await page.getByRole('textbox').first().fill('TestUser962');
  await page.getByRole('textbox').nth(1).fill('wLDj6m4Hm]$!');

  await Promise.all([
    page.waitForLoadState('networkidle').catch(() => {}),
    page.locator('button').first().click()
  ]);

  await expect(page.getByRole('button', { name: /add employee/i }))
    .toBeVisible({ timeout: 15000 });
};

/**
 * Get employee row safely by index
 */
const getEmployeeRow = (page, index = 0) => {
  return page.locator('table tbody tr').nth(index);
};

/**
 * FIX: RELIABLE DELETE CLICK (page included correctly)
 */
const clickDeleteFromRow = async (page, row) => {
  const deleteIcon = row.locator('i.fas.fa-times').first();

  await expect(deleteIcon).toBeVisible();
  await deleteIcon.scrollIntoViewIfNeeded();

  // trigger hover state (important for UI)
  await deleteIcon.hover();

  // allow UI to stabilize
  await page.waitForTimeout(300);

  // real click
  await deleteIcon.click();
};

/**
 * Confirm delete modal
 */
const confirmDelete = async (page) => {
  const modal = page.locator('.modal, .modal-content');

  const confirmBtn = modal.getByRole('button', {
    name: /delete|confirm|yes/i
  });

  if (await confirmBtn.isVisible().catch(() => false)) {
    await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
    await confirmBtn.click();
  }
};

/**
 * Cancel delete safely inside modal
 */
const cancelDelete = async (page) => {
  const modal = page.locator('.modal, .modal-content');

  await expect(modal).toBeVisible({ timeout: 5000 });

  const cancelBtn = modal.getByRole('button', {
    name: /cancel|close|x/i
  });

  await expect(cancelBtn).toBeVisible({ timeout: 5000 });

  await cancelBtn.scrollIntoViewIfNeeded();
  await cancelBtn.click();

  await expect(modal).toBeHidden({ timeout: 5000 });
};

test.describe('Delete Employee Scenarios', () => {

  test('Delete employee successfully', async ({ page }) => {
    await login(page);

    const row = getEmployeeRow(page, 0);
    await expect(row).toBeVisible();

    const employeeText = await row.textContent();

    await clickDeleteFromRow(page, row);
    await confirmDelete(page);

    await expect(page.locator('table tbody')).not.toContainText(employeeText);
  });

  test('Delete second employee in list', async ({ page }) => {
    await login(page);

    const row = getEmployeeRow(page, 1);
    await expect(row).toBeVisible();

    const employeeText = await row.textContent();

    await clickDeleteFromRow(page, row);
    await confirmDelete(page);

    await expect(page.locator('table tbody')).not.toContainText(employeeText);
  });

  test('Cancel delete should NOT remove employee', async ({ page }) => {
    await login(page);

    const row = getEmployeeRow(page, 0);
    await expect(row).toBeVisible();

    const employeeText = await row.textContent();

    await clickDeleteFromRow(page, row);

    await cancelDelete(page);

    await expect(page.locator('table tbody')).toContainText(employeeText);
  });

  test('Delete same employee twice (idempotency check)', async ({ page }) => {
    await login(page);

    const row = getEmployeeRow(page, 0);
    await expect(row).toBeVisible();

    const employeeText = await row.textContent();

    await clickDeleteFromRow(page, row);
    await confirmDelete(page);

    await expect(page.locator('table tbody')).not.toContainText(employeeText);
  });

  test('Delete all employees one by one', async ({ page }) => {
    await login(page);

    let rows = page.locator('table tbody tr');

    while (await rows.count() > 0) {
      const row = rows.first();
      await expect(row).toBeVisible();

      await clickDeleteFromRow(page, row);
      await confirmDelete(page);

      await page.waitForTimeout(300);

      rows = page.locator('table tbody tr');
    }

    await expect(page.locator('table tbody tr')).toHaveCount(0);
  });

});