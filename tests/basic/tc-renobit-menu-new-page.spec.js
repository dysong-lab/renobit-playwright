const { test, expect } = require('@playwright/test');
const { goToEditor, waitForEditorReady } = require('../helpers/renobit');

test.setTimeout(60_000);

/**
 * treeData에서 특정 이름·타입의 항목 존재 여부 확인
 * type: 'page' | 'group' | 'master'
 */
async function assertTreeItemExists(page, name, type) {
  const exists = await page.evaluate(
    ({ n, t }) =>
      (window.wemb?.pageTreeDataManager?.treeData || []).some(
        (item) => item.text === n && item.type === t
      ),
    { n: name, t: type }
  );
  expect(exists, `treeData에 ${type} "${name}" 항목이 없음`).toBeTruthy();
}

test.describe('Basic - RENOBIT 메뉴 > NEW PAGE', () => {
  const runId = Date.now().toString(36);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
  });

  test('신규 페이지 생성', async ({ page }) => {
    const pageName = `basic_page_${runId}`;

    await page.evaluate(() => {
      window.wemb.$createPageModal.showNewPage('page');
    });
    await page.waitForSelector('#createPageModal', { state: 'visible' });
    await page.fill('#pageName', pageName);
    await page.click('#createPageModal .el-button--primary');

    await page.waitForFunction(
      (name) =>
        (window.wemb?.pageTreeDataManager?.treeData || []).some(
          (item) => item.text === name && item.type === 'page'
        ),
      pageName,
      { timeout: 15_000 }
    );

    await assertTreeItemExists(page, pageName, 'page');
    console.log(`[PASS] 신규 페이지 생성 확인: ${pageName}`);
  });

  test('신규 그룹(폴더) 생성', async ({ page }) => {
    const groupName = `basic_group_${runId}`;

    await page.evaluate(() => {
      window.wemb.$createPageModal.showNewPage('group');
    });
    await page.waitForSelector('#createPageModal', { state: 'visible' });
    await page.fill('#pageName2', groupName);
    await page.click('#createPageModal .el-button--primary');

    await page.waitForFunction(
      (name) =>
        (window.wemb?.pageTreeDataManager?.treeData || []).some(
          (item) => item.text === name && item.type === 'group'
        ),
      groupName,
      { timeout: 15_000 }
    );

    await assertTreeItemExists(page, groupName, 'group');
    console.log(`[PASS] 신규 그룹 생성 확인: ${groupName}`);
  });

  test('신규 마스터 페이지 생성', async ({ page }) => {
    const masterName = `basic_master_${runId}`;

    await page.evaluate(() => {
      window.wemb.$createPageModal.showNewPage('master');
    });
    await page.waitForSelector('#createPageModal', { state: 'visible' });
    await page.fill('#pageName', masterName);
    await page.click('#createPageModal .el-button--primary');

    await page.waitForFunction(
      (name) =>
        (window.wemb?.pageTreeDataManager?.treeData || []).some(
          (item) => item.text === name && item.type === 'master'
        ),
      masterName,
      { timeout: 15_000 }
    );

    await assertTreeItemExists(page, masterName, 'master');
    console.log(`[PASS] 신규 마스터 페이지 생성 확인: ${masterName}`);
  });
});
