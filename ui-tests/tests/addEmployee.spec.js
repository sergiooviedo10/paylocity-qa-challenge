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
// OPEN MODAL
// =========================
const openModal = async (page) => {
  await page
    .getByRole('button', { name: /add employee/i })
    .click();

  const modal = page.locator('#employeeModal');

  await expect(modal).toBeVisible();

  return modal;
};

// =========================
// HELPERS
// =========================
const getField = (modal, name) => {
  if (name === 'dependents') {
    return modal.locator('#dependants');
  }

  return modal.locator(`input[name="${name}"]`);
};

const safeFill = async (field, value) => {
  await expect(field).toBeVisible();

  await field.click();
  await field.fill(String(value));
};

const safeNumberFill = async (field, value) => {
  await expect(field).toBeVisible();

  await field.click();
  await field.fill('');
  await field.type(String(value));
  await field.press('Tab');
};

// =========================
// ADD EMPLOYEE
// =========================
const clickAddEmployee = async (modal) => {
  const addBtn = modal.locator('#addEmployee');

  await expect(addBtn).toBeVisible();
  await expect(addBtn).toBeEnabled();

  await addBtn.scrollIntoViewIfNeeded();

  await addBtn.click();
};

// =========================
// CANCEL FLOW
// =========================
const clickCancel = async (page) => {
  const cancelBtn = page.getByRole('button', {
    name: /cancel/i
  });

  await cancelBtn.click();

  await expect(
    page.locator('#employeeModal')
  ).not.toBeVisible();
};

// =========================
// TESTS
// =========================
test.describe('Add Employee - QA Coverage', () => {

  test('Happy path', async ({ page }) => {
    await login(page);

    const modal = await openModal(page);

    await safeFill(
      getField(modal, 'firstName'),
      'Tony'
    );

    await safeFill(
      getField(modal, 'lastName'),
      'Stark'
    );

    await safeNumberFill(
      getField(modal, 'dependents'),
      2
    );

    await clickAddEmployee(modal);

    await expect(
      page.locator('table tbody tr')
    ).toContainText('Tony');

    await expect(
      page.locator('table tbody tr')
    ).toContainText('Stark');
  });

  test('Missing required fields', async ({ page }) => {
    await login(page);

    const modal = await openModal(page);

    await clickAddEmployee(modal);

    await expect(modal).toBeVisible();
  });

  test('Negative dependents', async ({ page }) => {
    await login(page);

    const modal = await openModal(page);

    await safeFill(
      getField(modal, 'firstName'),
      'Tony'
    );

    await safeFill(
      getField(modal, 'lastName'),
      'Stark'
    );

    await safeNumberFill(
      getField(modal, 'dependents'),
      -1
    );

    await clickAddEmployee(modal);

    await expect(
      page.locator('table tbody tr')
    ).toContainText('Tony');
  });

  test('Zero dependents', async ({ page }) => {
    await login(page);

    const modal = await openModal(page);

    await safeFill(
      getField(modal, 'firstName'),
      'Bruce'
    );

    await safeFill(
      getField(modal, 'lastName'),
      'Wayne'
    );

    await safeNumberFill(
      getField(modal, 'dependents'),
      0
    );

    await clickAddEmployee(modal);

    await expect(
      page.locator('table tbody tr')
    ).toContainText('Bruce');
  });

  test('Very long inputs', async ({ page }) => {
    await login(page);

    const modal = await openModal(page);

    const longText = 'A'.repeat(300);

    await safeFill(
      getField(modal, 'firstName'),
      longText
    );

    await safeFill(
      getField(modal, 'lastName'),
      longText
    );

    await safeNumberFill(
      getField(modal, 'dependents'),
      1
    );

    await clickAddEmployee(modal);

    await expect(
      page.locator('table tbody tr').first()
    ).toBeVisible();
  });

  test('Cancel button should close modal', async ({ page }) => {
    await login(page);

    const modal = await openModal(page);

    await safeFill(
      getField(modal, 'firstName'),
      'Bruce'
    );

    await safeFill(
      getField(modal, 'lastName'),
      'Wayne'
    );

    await clickCancel(page);

    await expect(modal).not.toBeVisible();
  });

  test('Extreme dependents boundary (999)', async ({ page }) => {
    await login(page);

    const modal = await openModal(page);

    await safeFill(
      getField(modal, 'firstName'),
      'Clark'
    );

    await safeFill(
      getField(modal, 'lastName'),
      'Kent'
    );

    await safeNumberFill(
      getField(modal, 'dependents'),
      999
    );

    await clickAddEmployee(modal);

    await expect(
      page.locator('table tbody tr')
    ).toContainText('Clark');
  });
  test('Special characters in names', async ({ page }) => {
    await login(page);
  
    const modal = await openModal(page);
  
    await safeFill(
      getField(modal, 'firstName'),
      '!@#$%'
    );
  
    await safeFill(
      getField(modal, 'lastName'),
      '(){}[]'
    );
  
    await safeNumberFill(
      getField(modal, 'dependents'),
      2
    );
  
    await clickAddEmployee(modal);
  
    await expect(
      page.locator('table tbody tr')
    ).toContainText('!@#$%');
  });
  test('Decimal dependents', async ({ page }) => {
    await login(page);
  
    const modal = await openModal(page);
  
    await safeFill(
      getField(modal, 'firstName'),
      'Juan'
    );
  
    await safeFill(
      getField(modal, 'lastName'),
      'Ramírez'
    );
  
    await safeNumberFill(
      getField(modal, 'dependents'),
      1.5
    );
  
    await clickAddEmployee(modal);
  
    await expect(
      page.locator('#employeeModal')
    ).toBeVisible();
  });
  test('Whitespace only inputs', async ({ page }) => {
    await login(page);
  
    const modal = await openModal(page);
  
    await safeFill(
      getField(modal, 'firstName'),
      '     '
    );
  
    await safeFill(
      getField(modal, 'lastName'),
      '     '
    );
  
    await safeNumberFill(
      getField(modal, 'dependents'),
      1
    );
  
    await clickAddEmployee(modal);
  
    await expect(modal).toBeVisible();
  });
  test('Open and close modal multiple times', async ({ page }) => {
    await login(page);
  
    for (let i = 0; i < 5; i++) {
      const modal = await openModal(page);
  
      await expect(modal).toBeVisible();
  
      await clickCancel(page);
    }
  });
  test('Unicode characters', async ({ page }) => {
    await login(page);
  
    const modal = await openModal(page);
  
    await safeFill(
      getField(modal, 'firstName'),
      'José'
    );
  
    await safeFill(
      getField(modal, 'lastName'),
      'Niño'
    );
  
    await safeNumberFill(
      getField(modal, 'dependents'),
      3
    );
  
    await clickAddEmployee(modal);
  
    await expect(
      page.locator('table tbody tr')
    ).toContainText('José');
  });
  test('Huge dependents number', async ({ page }) => {
    await login(page);
  
    const modal = await openModal(page);
  
    await safeFill(
      getField(modal, 'firstName'),
      'Luis'
    );
  
    await safeFill(
      getField(modal, 'lastName'),
      'Torres'
    );
  
    await safeNumberFill(
      getField(modal, 'dependents'),
      999999999
    );
  
    await clickAddEmployee(modal);
  
    await expect(
      page.locator('body')
    ).toBeVisible();
  });
  test('Submit using Enter key', async ({ page }) => {
    await login(page);
  
    const modal = await openModal(page);
  
    await safeFill(
      getField(modal, 'firstName'),
      'Mario'
    );
  
    await safeFill(
      getField(modal, 'lastName'),
      'Sánchez'
    );
  
    await safeNumberFill(
      getField(modal, 'dependents'),
      2
    );
  
    await page.keyboard.press('Enter');
  
    await expect(
      page.locator('table tbody tr')
    ).toContainText('Mario');
  });

  test('High dependents boundary (50)', async ({ page }) => {
    await login(page);

    const modal = await openModal(page);

    await safeFill(
      getField(modal, 'firstName'),
      'Peter'
    );

    await safeFill(
      getField(modal, 'lastName'),
      'Parker'
    );

    await safeNumberFill(
      getField(modal, 'dependents'),
      50
    );

    await clickAddEmployee(modal);

    await expect(
      page.locator('table tbody tr')
    ).toContainText('Peter');
  });

});