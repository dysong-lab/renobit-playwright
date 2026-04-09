const { chromium } = require('@playwright/test');
const { setLoginCredentials } = require('./tests/helpers/renobit');

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://10.23.128.203:9000';

module.exports = async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });

  await page.goto('/renobit/login.do', { waitUntil: 'domcontentloaded' });
  await setLoginCredentials(page, {
    username: 'admin',
    password: 'wemb@#@#',
  });
  await page.locator('#Editor').check();
  await page.locator('button.new_btn').click();

  await page.waitForURL(/\/renobit\/visual\.do#\//, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  // 에디터 완전 초기화까지 대기 (isLoaded = true: OpenPageCommand._completedLoadAllResource 완료)
  await page.waitForFunction(
    () =>
      !!window.wemb?.mainPageComponent?.threeLayer &&
      window.wemb?.mainPageComponent?.isLoaded === true,
    { timeout: 60_000 }
  );

  // 인증 세션(쿠키 + localStorage) 저장
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
};
