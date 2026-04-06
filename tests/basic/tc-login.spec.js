const { test, expect } = require('@playwright/test');

// 로그인 테스트는 세션 없이 실행
test.use({ storageState: { cookies: [], origins: [] } });

test.setTimeout(60_000);

test.describe('Basic - 로그인', () => {
  test('에디터 로그인 후 에디터 페이지 이동 확인', async ({ page }) => {
    await page.goto('/renobit/login.do', { waitUntil: 'domcontentloaded' });

    await page.locator('#idInput').fill('admin');
    await page.locator('#pwInput').fill('didi0205');
    await page.locator('#Editor').check();
    await page.locator('button.new_btn').click();

    await page.waitForURL(/\/renobit\/visual\.do#\//, { timeout: 20_000 });

    await expect(page).toHaveURL(/\/renobit\/visual\.do#\//);
    console.log('[PASS] 에디터 로그인 성공 → visual.do 이동 확인');
  });
});
