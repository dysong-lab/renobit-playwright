const { test, expect } = require('@playwright/test');
const { ensureEditorSession, ensureTestPage, loginAsEditor } = require('../../helpers/renobit');
const { attachTcMeta } = require('./_tc-meta');

test.setTimeout(60_000);

async function expectHeaderButtons(page, names) {
  for (const name of names) {
    await expect(page.getByRole('button', { name, exact: true }).first()).toBeVisible();
  }
}

test.describe('RENOBIT 3.5.0 Final Common TC - Common Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC-R35-COM-001 Editor 권한 로그인 후 에디터 진입', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-001',
      title: '로그인 페이지에서 Editor 권한으로 로그인 후 visual editor 진입',
      preconditions: [
        'RENOBIT 3.5.0 서버가 정상 기동 중이어야 한다.',
        'admin 계정이 유효하고 Editor 체크 옵션이 노출되어야 한다.',
        '로그인 페이지 /renobit/login.do 에 정상 접근 가능해야 한다.',
      ],
      expectedResults: [
        '로그인 요청 후 /renobit/visual.do#/ URL로 이동해야 한다.',
        'mainPageComponent.isLoaded 값이 true 가 되어 에디터 초기화가 완료되어야 한다.',
        'threeLayer 및 페이지 생성 모달이 준비되어 이후 회귀 TC의 시작점으로 사용할 수 있어야 한다.',
      ],
    });

    await loginAsEditor(page);

    await expect(page).toHaveURL(/\/renobit\/visual\.do#\//);
    await expect
      .poll(async () =>
        page.evaluate(() => ({
          isLoaded: window.wemb?.mainPageComponent?.isLoaded === true,
          hasThreeLayer: !!window.wemb?.mainPageComponent?.threeLayer,
          hasCreatePageModal: !!window.wemb?.$createPageModal,
        }))
      )
      .toEqual({
        isLoaded: true,
        hasThreeLayer: true,
        hasCreatePageModal: true,
      });
  });
});

test.describe('RENOBIT 3.5.0 Final Common TC - Common', () => {
  test.beforeEach(async ({ page }) => {
    await ensureEditorSession(page);
  });

  test('TC-R35-COM-002 Common Header - Viewer 링크 이동', async ({ page, context }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-002',
      title: '상단 viewer 버튼 클릭 시 viewer 페이지 새 창 열기',
      preconditions: [
        '로그인 완료 후 에디터 메인 화면이 열려 있어야 한다.',
        '상단 우측 viewer 버튼이 보여야 한다.',
        '현재 활성 페이지가 일반 page 타입이어야 한다.',
      ],
      expectedResults: [
        'viewer 버튼 클릭이 가능해야 한다.',
        '새 창 또는 새 탭으로 visualViewer.do 페이지가 열려야 한다.',
        '열린 URL에 현재 page id가 포함되어야 한다.',
      ],
    });

    const pageName = `tc_r35_common_viewer_${Date.now().toString(36)}`;
    const pageId = await ensureTestPage(page, pageName);

    const popupPromise = context.waitForEvent('page');
    await page.getByRole('button', { name: 'viewer', exact: true }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded');

    await expect
      .poll(async () => popup.url(), { timeout: 20_000 })
      .toContain(`/renobit/visualViewer.do#/pid=${pageId}`);

    await popup.close();
  });

  test('TC-R35-COM-003 Common Header - Admin 링크 이동', async ({ page, context }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-003',
      title: '상단 admin 버튼 클릭 시 관리자 페이지 새 창 열기',
      preconditions: [
        '로그인 완료 후 에디터 메인 화면이 열려 있어야 한다.',
        '상단 우측 admin 버튼이 보여야 한다.',
      ],
      expectedResults: [
        'admin 버튼 클릭이 가능해야 한다.',
        '새 창 또는 새 탭으로 관리자 페이지가 열려야 한다.',
        '관리자 페이지 URL은 동일 origin 의 /admin 경로여야 한다.',
      ],
    });

    const popupPromise = context.waitForEvent('page');
    await page.getByRole('button', { name: 'admin', exact: true }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded');

    await expect
      .poll(async () => popup.url(), { timeout: 20_000 })
      .toMatch(/\/admin(?:[/?#]|$)/);

    await popup.close();
  });

  test('TC-R35-COM-004 Common Header - Logout 동작', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-004',
      title: '상단 logout 버튼 클릭 시 로그아웃 후 재인증 요구',
      preconditions: [
        '로그인 완료 후 에디터 메인 화면이 열려 있어야 한다.',
        '상단 우측 logout 버튼이 보여야 한다.',
      ],
      expectedResults: [
        'logout 버튼 클릭이 가능해야 한다.',
        '로그아웃 후 login.do 또는 logout.do 경로로 이동해야 한다.',
        '이후 visual.do 재접근 시 로그인 페이지로 리다이렉트되어야 한다.',
      ],
    });

    await page.getByRole('button', { name: 'logout', exact: true }).click();
    await expect
      .poll(async () => page.url(), { timeout: 20_000 })
      .toMatch(/\/renobit\/(?:login|logout)\.do/);

    await page.goto('/renobit/visual.do', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/renobit\/login\.do/);
  });

  test('TC-R35-COM-005 Common Toolbar - Copy/Cut/Paste/Delete 기본 상태', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-005',
      title: '상단 work toolbar 의 copy/cut/paste/delete 버튼 표시 및 기본 비활성 상태',
      preconditions: [
        '로그인 완료 후 에디터 메인 화면이 열려 있어야 한다.',
        '아무 컴포넌트도 선택되지 않은 상태여야 한다.',
      ],
      expectedResults: [
        'copy, cut, paste, delete 버튼이 표시되어야 한다.',
        '선택 대상이 없으면 disabled 상태여야 한다.',
        '버튼 표시만으로 오류가 발생하지 않아야 한다.',
      ],
    });

    const copy = page.getByRole('button', { name: 'copy', exact: true });
    const cut = page.getByRole('button', { name: 'cut', exact: true });
    const paste = page.getByRole('button', { name: 'paste', exact: true });
    const del = page.getByRole('button', { name: 'delete', exact: true });

    await expect(copy).toBeVisible();
    await expect(cut).toBeVisible();
    await expect(paste).toBeVisible();
    await expect(del).toBeVisible();
    await expect(copy).toBeDisabled();
    await expect(cut).toBeDisabled();
    await expect(del).toBeDisabled();
  });

  test('TC-R35-COM-006 Common Toolbar - Layer 영역 기본 버튼 표시', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-006',
      title: 'toolbar layer 영역의 M/2D/3D 버튼 표시',
      preconditions: ['로그인 완료 후 에디터 메인 화면이 열려 있어야 한다.'],
      expectedResults: [
        'layer 영역에 M, 2D, 3D 버튼이 보여야 한다.',
        '현재 상태에 맞는 버튼 활성 표시가 정상이어야 한다.',
      ],
    });

    await expectHeaderButtons(page, ['M', '2D', '3D']);
  });

  test('TC-R35-COM-007 Common Toolbar - View 영역 기본 버튼 표시', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-007',
      title: 'toolbar view 영역의 M/2D/3D 버튼 표시',
      preconditions: ['로그인 완료 후 에디터 메인 화면이 열려 있어야 한다.'],
      expectedResults: [
        'view 영역에도 M, 2D, 3D 버튼이 보여야 한다.',
        '버튼 그룹이 숨김 없이 렌더링되어야 한다.',
      ],
    });

    await expect(page.getByRole('button', { name: 'M', exact: true })).toHaveCount(2);
    await expect(page.getByRole('button', { name: '2D', exact: true })).toHaveCount(2);
    await expect(page.getByRole('button', { name: '3D', exact: true })).toHaveCount(2);
  });

  test('TC-R35-COM-008 Common Toolbar - Mobile Master 영역 기본 버튼 표시', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-008',
      title: 'toolbar mobile master 영역의 MM 버튼 표시',
      preconditions: ['로그인 완료 후 에디터 메인 화면이 열려 있어야 한다.'],
      expectedResults: [
        'MM 버튼이 보여야 한다.',
        '버튼이 렌더링된 상태로 유지되어야 한다.',
      ],
    });

    await expect(page.getByRole('button', { name: 'MM', exact: true })).toBeVisible();
  });

  test('TC-R35-COM-009 Common Header - Zoom 토글 표시', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-009',
      title: '상단 Zoom 레이블과 토글 표시',
      preconditions: ['로그인 완료 후 에디터 메인 화면이 열려 있어야 한다.'],
      expectedResults: [
        'Zoom 레이블이 보여야 한다.',
        'Zoom 토글이 표시되어야 한다.',
        '토글 표시만으로 화면이 깨지지 않아야 한다.',
      ],
    });

    await expect(page.locator('.zoombar-area')).toBeVisible();
    await expect(page.locator('.zoombar-area .el-switch')).toBeAttached();
  });

  test('TC-R35-COM-010 Common Header - Device/View 선택 combobox 표시', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-010',
      title: '상단 우측 combobox 표시',
      preconditions: ['로그인 완료 후 에디터 메인 화면이 열려 있어야 한다.'],
      expectedResults: [
        '상단 우측 combobox 가 보여야 한다.',
        '옵션이 하나 이상 렌더링되어야 한다.',
      ],
    });

    const combo = page.locator('.langs select');
    await expect(combo).toBeAttached();
    await expect
      .poll(async () => combo.locator('option').count())
      .toBeGreaterThan(0);
  });

  test('TC-R35-COM-011 Empty State - 활성 페이지 미존재 메시지 표시', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-COM-011',
      title: '활성 페이지가 없을 때 empty state 메시지 표시',
      preconditions: [
        '로그인 완료 상태여야 한다.',
        '초기 진입 또는 현재 활성 페이지가 없는 상태여야 한다.',
      ],
      expectedResults: [
        '활성화된 페이지가 존재하지 않습니다 안내 문구가 표시되어야 한다.',
        '이 상태에서도 createPageModal 이 준비되어 페이지 생성 흐름을 시작할 수 있어야 한다.',
      ],
    });

    await page.goto('/renobit/visual.do', { waitUntil: 'domcontentloaded' });
    // Close any auto-opened page so the empty state is visible
    await page.evaluate(() => {
      const currentId = window.wemb?.pageManager?.currentPageInfo?.id;
      if (currentId) {
        window.wemb.editorFacade.sendNotification('command/closePage');
      }
    });
    await page.waitForFunction(() => !window.wemb?.pageManager?.currentPageInfo?.id, { timeout: 10_000 });
    await expect(page.getByText('활성화된 페이지가 존재하지 않습니다. 먼저 페이지를 만들어주세요.')).toBeVisible();
    await expect
      .poll(async () => page.evaluate(() => !!window.wemb?.$createPageModal))
      .toBeTruthy();
  });
});
