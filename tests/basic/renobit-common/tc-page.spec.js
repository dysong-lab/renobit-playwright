const { test, expect } = require('@playwright/test');
const path = require('path');

const {
  closeCreatePageModalIfVisible,
  createPageByType,
  ensureEditorSession,
  ensureTestPage,
} = require('../../helpers/renobit');
const { attachTcMeta } = require('./_tc-meta');

test.setTimeout(90_000);

const FIXTURES = path.join(__dirname, '../../fixtures');

async function assertTreeItemExists(page, name, type) {
  await expect
    .poll(
      async () =>
        page.evaluate(
          ({ itemName, itemType }) =>
            (window.wemb?.pageTreeDataManager?.treeData || []).some(
              (item) => item.text === itemName && item.type === itemType
            ),
          { itemName: name, itemType: type }
        ),
      { timeout: 30_000 }
    )
    .toBeTruthy();
}

async function assertCurrentPageInfo(page, name, type) {
  await expect
    .poll(
      async () =>
        page.evaluate(() => ({
          id: window.wemb?.pageManager?.currentPageInfo?.id || null,
          name: window.wemb?.pageManager?.currentPageInfo?.name || null,
          type: window.wemb?.pageManager?.currentPageInfo?.type || null,
        })),
      { timeout: 30_000 }
    )
    .toMatchObject({
      id: expect.any(String),
      name,
      type,
    });
}

test.describe('RENOBIT 3.5.0 Final Common TC - Page', () => {
  const runId = Date.now().toString(36);

  test.beforeEach(async ({ page }) => {
    await ensureEditorSession(page);
  });

  test('TC-R35-PAGE-001 신규 페이지 생성', async ({ page }, testInfo) => {
    const pageName = `tc_r35_page_${runId}`;
    await attachTcMeta(testInfo, {
      id: 'TC-R35-PAGE-001',
      title: 'RENOBIT > NEW PAGE 에서 일반 페이지 생성',
      preconditions: [
        '에디터 로그인 완료 후 create page modal 을 호출할 수 있어야 한다.',
        '페이지 트리 데이터가 로드되어 생성 결과를 확인할 수 있어야 한다.',
      ],
      expectedResults: [
        '신규 생성 팝업이 표시되어야 한다.',
        `입력한 이름 ${pageName} 으로 type=page 항목이 페이지 트리에 생성되어야 한다.`,
        '생성 후 추가 페이지 작업을 이어서 수행할 수 있어야 한다.',
      ],
    });

    await createPageByType(page, { type: 'page', name: pageName });
    await assertTreeItemExists(page, pageName, 'page');
    await assertCurrentPageInfo(page, pageName, 'page');
    await closeCreatePageModalIfVisible(page);
  });

  test('TC-R35-PAGE-002 신규 그룹 생성', async ({ page }, testInfo) => {
    const groupName = `tc_r35_group_${runId}`;
    await attachTcMeta(testInfo, {
      id: 'TC-R35-PAGE-002',
      title: 'RENOBIT > NEW PAGE 에서 그룹 폴더 생성',
      preconditions: [
        '에디터 로그인 완료 후 create page modal 을 호출할 수 있어야 한다.',
        '페이지 트리 데이터가 로드되어 생성 결과를 확인할 수 있어야 한다.',
      ],
      expectedResults: [
        '신규 생성 팝업에서 group 생성 흐름이 정상 동작해야 한다.',
        `입력한 이름 ${groupName} 으로 type=group 항목이 페이지 트리에 생성되어야 한다.`,
        '그룹 생성 후 다른 페이지/폴더 생성 흐름이 깨지지 않아야 한다.',
      ],
    });

    await createPageByType(page, { type: 'group', name: groupName });
    await assertTreeItemExists(page, groupName, 'group');
    await closeCreatePageModalIfVisible(page);
  });

  test('TC-R35-PAGE-003 신규 마스터 페이지 생성', async ({ page }, testInfo) => {
    const masterName = `tc_r35_master_${runId}`;
    await attachTcMeta(testInfo, {
      id: 'TC-R35-PAGE-003',
      title: 'RENOBIT > NEW PAGE 에서 마스터 페이지 생성',
      preconditions: [
        '에디터 로그인 완료 후 create page modal 을 호출할 수 있어야 한다.',
        '마스터 페이지 생성 권한 및 UI가 정상 동작해야 한다.',
      ],
      expectedResults: [
        '신규 생성 팝업에서 master 생성 흐름이 정상 동작해야 한다.',
        `입력한 이름 ${masterName} 으로 type=master 항목이 페이지 트리에 생성되어야 한다.`,
        '페이지 트리와 내부 current page 상태가 불일치하지 않아야 한다.',
      ],
    });

    await createPageByType(page, { type: 'master', name: masterName });
    await assertTreeItemExists(page, masterName, 'master');
    await assertCurrentPageInfo(page, masterName, 'master');
    await closeCreatePageModalIfVisible(page);
  });

  test('TC-R35-PAGE-004 Import Page 모달 표시', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-PAGE-004',
      title: 'RENOBIT > import page 실행 후 import modal 표시',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'fixtures/page.json 파일이 준비되어 있어야 한다.',
      ],
      expectedResults: [
        'page.json 선택 후 importPagesModal 이 표시되어야 한다.',
        '사용자가 import 실행 여부를 판단할 수 있는 primary 버튼이 보여야 한다.',
      ],
    });

    await Promise.all([
      page.evaluate(() => {
        window.wemb.editorFacade.sendNotification('command/importPages');
      }),
      page.setInputFiles('#importFile', path.join(FIXTURES, 'page.json')),
    ]);

    await expect(page.locator('#importPagesModal')).toBeVisible();
    await expect(page.locator('#importPagesModal .el-button--primary')).toBeVisible();
  });

  test('TC-R35-PAGE-005 Export Current Page 다운로드 시작', async ({ page }, testInfo) => {
    const pageName = `tc_r35_export_current_${runId}`;
    await attachTcMeta(testInfo, {
      id: 'TC-R35-PAGE-005',
      title: 'RENOBIT > export current page 실행 시 현재 페이지 다운로드',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        '현재 활성 페이지가 존재해야 한다.',
      ],
      expectedResults: [
        '다운로드 이벤트가 발생해야 한다.',
        '다운로드 파일명은 pages.json 이어야 한다.',
      ],
    });

    await ensureTestPage(page, pageName);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.evaluate(() => {
        window.wemb.editorFacade.sendNotification('command/exportPage');
      }),
    ]);

    await expect(download.suggestedFilename()).toBe('pages.json');
  });

  test('TC-R35-PAGE-006 Export Pages 모달에서 선택 페이지 다운로드', async ({ page }, testInfo) => {
    const pageName = `tc_r35_export_pages_${runId}`;
    await attachTcMeta(testInfo, {
      id: 'TC-R35-PAGE-006',
      title: 'RENOBIT > export pages 에서 페이지 선택 후 다운로드',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        `페이지 목록에 ${pageName} 이 존재해야 한다.`,
      ],
      expectedResults: [
        'Export Pages 모달이 표시되어야 한다.',
        '페이지 검색과 체크가 정상 동작해야 한다.',
        '내보내기 실행 시 pages.json 다운로드가 시작되어야 한다.',
      ],
    });

    await ensureTestPage(page, pageName);
    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/showExportPagesModal');
    });

    const modal = page.locator('#exportPagesModal');
    await expect(modal).toBeVisible();
    await modal.getByPlaceholder('페이지명을 입력하세요.').fill(pageName);

    const searchList = modal.locator('.page-search-list');
    const checkbox = searchList.locator(`input.el-checkbox__original[value="${pageName}"]`).first();
    const label = searchList.getByText(pageName, { exact: true }).first();

    await expect(label).toBeVisible();
    await label.click();
    await expect(checkbox).toBeChecked();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      modal.locator('.el-button--primary').click(),
    ]);

    await expect(download.suggestedFilename()).toBe('pages.json');
  });

  test('TC-R35-PAGE-007 Import Total Data 파일 선택 TC', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-PAGE-007',
      title: 'RENOBIT > import total data 실행 후 zip 파일 선택',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'fixtures/total_data.zip 파일이 준비되어 있어야 한다.',
      ],
      expectedResults: [
        '통합 가져오기 명령 실행 후 파일 선택 입력이 오류 없이 처리되어야 한다.',
        '실운영 환경에서는 통합 가져오기 완료 팝업이 표시되어야 한다.',
      ],
    });

    await Promise.all([
      page.evaluate(() => {
        window.wemb.editorFacade.sendNotification('command/importTotalDATA');
      }),
      page.setInputFiles('#importFile', path.join(FIXTURES, 'total_data.zip')),
    ]);
  });

  test('TC-R35-PAGE-008 Export Total Data 모달 표시', async ({ page }, testInfo) => {
    const pageName = `tc_r35_export_total_${runId}`;
    await attachTcMeta(testInfo, {
      id: 'TC-R35-PAGE-008',
      title: 'RENOBIT > export total data 실행 시 통합 내보내기 모달 표시',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        '내보내기 가능한 페이지가 존재해야 한다.',
      ],
      expectedResults: [
        '통합 내보내기 모달이 표시되어야 한다.',
        '전체 선택 체크박스와 내보내기 버튼이 노출되어야 한다.',
      ],
    });

    await ensureTestPage(page, pageName);
    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/showExportTotalDataModal');
    });

    const modal = page.locator('#exportTotalDataModal');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.all-checkbox')).toBeVisible();
    await expect(modal.locator('.el-button--primary')).toBeVisible();
  });
});
