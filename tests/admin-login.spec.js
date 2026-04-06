const { test, expect } = require('@playwright/test');

test.skip('admin license gate loads', async ({ page }) => {
  await page.goto('/admin/login.do', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle('LICENSE ERROR');
  await expect(page.getByText('제품 라이선스 등록이 필요합니다.')).toBeVisible();
  await expect(page.getByText('관리자에게 문의해 주세요.')).toBeVisible();
});
