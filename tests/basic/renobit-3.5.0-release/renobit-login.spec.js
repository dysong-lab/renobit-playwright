const { test, expect } = require('@playwright/test');

// 로그인 페이지 자체를 검증하므로 storageState(자동 로그인) 없이 실행
test.use({ storageState: { cookies: [], origins: [] } });

test('renobit login page loads', async ({ page }) => {
  await page.goto('/renobit/login.do', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle('RENOBIT LOGIN');
  await expect(page.locator('#idInput')).toBeVisible();
  await expect(page.locator('#pwInput')).toBeVisible();
  await expect(page.getByRole('button', { name: 'LOGIN' })).toBeVisible();
});
