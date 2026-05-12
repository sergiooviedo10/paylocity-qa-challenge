const { test, expect } = require('@playwright/test');

const URL =
  'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/Login';

test.describe('Login Scenarios', () => {

  // =========================
  // STABLE LOGIN HELPER
  // =========================
  const login = async (page, user, pass) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const username = page.locator('input[name="username"], input[type="text"]').first();
    const password = page.locator('input[name="password"], input[type="password"]').first();

    await expect(username).toBeVisible();
    await expect(password).toBeVisible();

    await username.fill(user);
    await password.fill(pass);

    await page.waitForTimeout(500);

    const loginBtn = page.getByRole('button', { name: 'Log In' });
    const fallbackBtn = page.locator('button:has-text("Log In")');

    const btn = (await loginBtn.count()) ? loginBtn : fallbackBtn;

    await expect(btn).toBeVisible({ timeout: 10000 });

    await btn.scrollIntoViewIfNeeded();
    await btn.click();

    await page.waitForLoadState('networkidle').catch(() => {});
  };

  // =========================
  // ERROR ASSERTION
  // =========================
  const expectLoginError = async (page) => {
    const errorMsg = page.locator(
      'div.alert, .alert, .toast, .toast-message, [role="alert"]'
    ).filter({ hasText: /invalid|error|incorrect/i });

    await expect(errorMsg.first()).toBeVisible({ timeout: 10000 });
  };

  // =========================
  // BASE TESTS (YOUR ORIGINAL)
  // =========================

  test('Valid login', async ({ page }) => {
    await login(page, 'TestUser962', 'wLDj6m4Hm]$!');

    await expect(
      page.getByRole('button', { name: 'Add Employee' })
    ).toBeVisible({ timeout: 15000 });
  });

  test('Invalid username + valid password', async ({ page }) => {
    await login(page, 'wrongUser', 'wLDj6m4Hm]$!');

    await expectLoginError(page);
  });

  test('Valid username + invalid password', async ({ page }) => {
    await login(page, 'TestUser962', 'wrongPass');

    await expectLoginError(page);
  });

  test('Empty username and password', async ({ page }) => {
    await login(page, '', '');

    const loginBtn = page.getByRole('button', { name: 'Log In' });
    await expect(loginBtn).toBeVisible();
  });

  test('Long username and password input', async ({ page }) => {
    const longUser = 'a'.repeat(300);
    const longPass = 'b'.repeat(300);

    await login(page, longUser, longPass);

    await expectLoginError(page);
  });

  // =========================
  // NEW COVERAGE SCENARIOS
  // =========================

  test('Leading and trailing spaces in credentials', async ({ page }) => {
    await login(page, '  TestUser962  ', '  wLDj6m4Hm]$!  ');

    await expect(
      page.getByRole('button', { name: 'Add Employee' })
    ).toBeVisible({ timeout: 15000 });
  });

  test('Username uppercase variation', async ({ page }) => {
    await login(page, 'TESTUSER962', 'wLDj6m4Hm]$!');

    await expectLoginError(page);
  });

  test('Password case sensitivity', async ({ page }) => {
    await login(page, 'TestUser962', 'WLDJ6M4HM]!$');

    await expectLoginError(page);
  });

  test('Login using Enter key', async ({ page }) => {
    await page.goto(URL);

    const username = page.locator('input[name="username"]').first();
    const password = page.locator('input[name="password"]').first();

    await username.fill('TestUser962');
    await password.fill('wLDj6m4Hm]$!');

    await page.keyboard.press('Enter');

    await expect(
      page.getByRole('button', { name: 'Add Employee' })
    ).toBeVisible();
  });

  test('Multiple login attempts (recover from failure)', async ({ page }) => {
    await login(page, 'wrongUser', 'wrongPass');
    await expectLoginError(page);

    await login(page, 'TestUser962', 'wLDj6m4Hm]$!');

    await expect(
      page.getByRole('button', { name: 'Add Employee' })
    ).toBeVisible();
  });

  test('Session persists after refresh', async ({ page }) => {
    await login(page, 'TestUser962', 'wLDj6m4Hm]$!');

    await page.reload();

    await expect(
      page.getByRole('button', { name: 'Add Employee' })
    ).toBeVisible();
  });

  test('Empty username only', async ({ page }) => {
    await login(page, '', 'wLDj6m4Hm]$!');

    await expectLoginError(page);
  });

  test('Empty password only', async ({ page }) => {
    await login(page, 'TestUser962', '');

    await expectLoginError(page);
  });

  test('Special characters in credentials', async ({ page }) => {
    await login(page, '<script>', '"><img/>');

    await expectLoginError(page);
  });

});