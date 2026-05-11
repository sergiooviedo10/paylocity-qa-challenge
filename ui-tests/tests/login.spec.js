const { test, expect } = require('@playwright/test');

const URL = 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/Login';

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
  // 🔥 STABLE ERROR ASSERTION (NEW FIX)
  // =========================
  const expectLoginError = async (page) => {
    const errorMsg = page.locator(
      'div.alert, .alert, .toast, .toast-message, [role="alert"]'
    ).filter({ hasText: /invalid|error|incorrect/i });

    await expect(errorMsg.first()).toBeVisible({ timeout: 10000 });
  };

  // =========================
  // SCENARIO 1 - VALID LOGIN
  // =========================
  test('Valid login', async ({ page }) => {
    await login(page, 'TestUser962', 'wLDj6m4Hm]$!');

    await expect(
      page.getByRole('button', { name: 'Add Employee' })
    ).toBeVisible({ timeout: 15000 });
  });

  // =========================
  // SCENARIO 2 - INVALID USER
  // =========================
  test('Invalid username + valid password', async ({ page }) => {
    await login(page, 'wrongUser', 'wLDj6m4Hm]$!');

    await expectLoginError(page);
  });

  // =========================
  // SCENARIO 3 - INVALID PASS
  // =========================
  test('Valid username + invalid password', async ({ page }) => {
    await login(page, 'TestUser962', 'wrongPass');

    await expectLoginError(page);
  });

  // =========================
  // SCENARIO 4 - EMPTY INPUTS
  // =========================
  test('Empty username and password', async ({ page }) => {
    await login(page, '', '');

    const loginBtn = page.getByRole('button', { name: 'Log In' });
    await expect(loginBtn).toBeVisible();
  });

  // =========================
  // SCENARIO 5 - LONG INPUT
  // =========================
  test('Long username and password input', async ({ page }) => {
    const longUser = 'a'.repeat(300);
    const longPass = 'b'.repeat(300);

    await login(page, longUser, longPass);

    await expectLoginError(page);
  });

});