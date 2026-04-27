const { test, expect } = require('@playwright/test');
const { loginAsEditor, ensureTestPage, waitForEditorReady } = require('../../helpers/renobit'); // Adjust helper paths as needed

test.describe('LOGIN Module Tests', () => {
  // 로그인 검증을 위해 전역 storageState(세션)를 무효화합니다.
  test.use({ storageState: { cookies: [], origins: [] } });
  // TODO: Add beforeEach if needed (e.g., test.beforeEach(async ({ page }) => { ... }))

  test('[QATC-2950] 로그인 - 페이지 - 페이지 구성 { @QA @로그인 @QATC-2950 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: 레노빗 로그인 페이지 확인
     * [Expected Result]: 이미지, ID/PW 입력 필드, 로그인 버튼 정상 표출
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    await page.goto('/renobit/login.do');
    
    // 이미지 로고 및 폼 필드 확인
    await expect(page.locator('#tbLogin, .renobit-logo-container').first()).toBeVisible();
    await expect(page.locator('#idInput')).toBeVisible();
    await expect(page.locator('#pwInput')).toBeVisible();
    await expect(page.locator('button.new_btn')).toBeVisible();
  });

  test('[QATC-2951] 로그인 - 뷰어 로그인 - 뷰어 로그인 — 불가 계정 { @QA @로그인 @QATC-2951 }', async ({ page }) => {
    /**
     * [Precondition]: 로그인 불가능 계정
     * [Test Steps]: 사용 불가능한 ID/PW 입력
     * [Expected Result]: 로그인 불가 에러팝업 표출
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    await page.goto('/renobit/login.do');
    const { setLoginCredentials } = require('../../helpers/renobit');
    
    let dialogAppeared = false;
    page.once('dialog', async dialog => {
      dialogAppeared = true;
      expect(dialog.message().length).toBeGreaterThan(0);
      await dialog.dismiss();
    });

    await setLoginCredentials(page, { username: 'invalid_user_!!', password: 'wrongpassword' });
    await page.locator('button.new_btn').click();
    
    await page.waitForTimeout(1000);
    expect(dialogAppeared).toBe(true);
    expect(page.url()).toContain('login.do');
  });

  test('[QATC-2952] 로그인 - 뷰어 로그인 - 뷰어 로그인 — 가능 계정 { @QA @로그인 @QATC-2952 }', async ({ page }) => {
    /**
     * [Precondition]: 로그인 가능 계정
     * [Test Steps]: 사용 가능한 ID/PW 입력, Editor 미선택
     * [Expected Result]: Viewer 화면으로 이동
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    const { submitLogin } = require('../../helpers/renobit');
    await page.goto('/renobit/login.do');
    
    // ID/PW는 로컬/QA용 임시 계정으로 대체 필요
    await submitLogin(page, { username: 'admin', password: 'wemb@#@#', editor: false });
    expect(page.url()).toContain('/renobit/visualViewer.do');
  });

  test('[QATC-2953] 로그인 - 에디터 로그인 - 에디터 로그인 — Edit 권한 있음 { @QA @로그인 @QATC-2953 }', async ({ page }) => {
    /**
     * [Precondition]: Edit 권한 있는 사용자
     * [Test Steps]: 사용 가능한 ID/PW 입력, Editor 선택
     * [Expected Result]: Editor 페이지로 이동
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    // loginAsEditor 헬퍼 함수가 이미 해당 동작(login.do 이동 -> 계정/Editor세팅 -> 로그인 시도 -> URL 확인)을 수행합니다.
    await loginAsEditor(page);
    
    // 성공 시 에디터 내부 상태(_readyCompleted 등)까지 확인됨을 헬퍼 내에서 보장.
    expect(page.url()).toContain('/renobit/visual.do');
  });

  test('[QATC-2954] 로그인 - 에디터 로그인 - 에디터 로그인 — Edit 권한 없음 { @QA @로그인 @QATC-2954 }', async ({ page }) => {
    /**
     * [Precondition]: Edit 권한 없는 사용자
     * [Test Steps]: 사용 가능한 ID/PW 입력, Editor 선택
     * [Expected Result]: Editor 페이지에 접근되지 않음
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    await page.goto('/renobit/login.do');
    const { setLoginCredentials, setEditorMode } = require('../../helpers/renobit');
    
    let dialogAppeared = false;
    page.once('dialog', async dialog => {
      dialogAppeared = true;
      await dialog.dismiss();
    });

    // 뷰어 전용 사용자 등 권한 없는 계정 입력 (ID/PW 수정 필요)
    await setLoginCredentials(page, { username: 'viewer_only', password: 'password123' });
    await setEditorMode(page, true);
    await page.locator('button.new_btn').click();

    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain('visual.do');
    expect(dialogAppeared).toBe(true);
  });

});
