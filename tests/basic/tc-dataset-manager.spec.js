const { test, expect } = require('@playwright/test');
const path = require('path');
const { goToEditor } = require('../helpers/renobit');

test.setTimeout(90_000);

const FIXTURES = path.join(__dirname, '../fixtures');
const DATASET_URL = '/renobit/datasetManager';

/** 데이터셋 매니저 페이지 오픈 헬퍼 */
async function goToDatasetManager(page) {
  await page.evaluate(() => {
    // TODO: 메뉴바 클릭으로 열리는 경우 아래 URL 이동 대신 UI 경로 사용
    window.open('/renobit/datasetManager', '_blank');
  });
  // 새 탭에서 열리는 경우 context.waitForEvent('page') 사용
  // 같은 탭에서 navigate하는 경우 waitForURL 사용
  // TODO: 실제 오픈 방식 확인 필요
  await page.goto(DATASET_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.dataset-manager', { state: 'visible', timeout: 15_000 });
  // TODO: dataset-manager 컨테이너 selector 확인 필요
}

test.describe('Basic - Dataset Manager', () => {
  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
  });

  test('파일 가져오기 — dataset.json import 후 성공 확인', async ({ page }) => {
    await goToDatasetManager(page);

    // 파일 가져오기 버튼 클릭
    // TODO: 버튼 selector 확인 필요
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('.dataset-import-btn').click(),
    ]);
    await fileChooser.setFiles(path.join(FIXTURES, 'dataset.json'));

    // import 팝업 확인 → 체크박스 체크 → 추가하기 클릭
    // TODO: 팝업 selector 확인 필요
    await page.waitForSelector('.dataset-import-modal', { state: 'visible', timeout: 10_000 });
    await page.locator('.dataset-import-modal input[type="checkbox"]').first().check();
    await page.locator('.dataset-import-modal .el-button--primary').click();

    await expect(page.locator('.el-message--success')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.el-message--success')).toContainText('파일 가져오기가 성공');
    console.log('[PASS] Dataset import 성공 팝업 확인');
  });

  test('파일 내보내기 — dataset export 후 성공 확인', async ({ page }) => {
    await goToDatasetManager(page);

    // 파일 내보내기 버튼 클릭
    // TODO: 버튼 selector 확인 필요
    await page.locator('.dataset-export-btn').click();

    // export 팝업 확인 → 체크박스 체크 → 파일 내보내기 클릭
    await page.waitForSelector('.dataset-export-modal', { state: 'visible', timeout: 10_000 });
    await page.locator('.dataset-export-modal input[type="checkbox"]').first().check();
    await page.locator('.dataset-export-modal .el-button--primary').click();

    await expect(page.locator('.el-message--success')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.el-message--success')).toContainText('파일 내보내기가 완료');
    console.log('[PASS] Dataset export 성공 팝업 확인');
  });

  test('REST API 타입 데이터셋 수정', async ({ page }) => {
    await goToDatasetManager(page);

    // 데이터셋 목록에서 첫 번째 항목 선택 (또는 기존 test1 데이터셋)
    // TODO: 데이터셋 목록 selector 확인 필요
    await page.locator('.dataset-list-item').first().click();

    // 데이터셋 정보 입력
    await page.locator('#datasetName').fill('test1');
    await page.locator('#datasetDesc').fill('1');
    // 주기 설정 (10 또는 최초 한번 실행)
    await page.locator('#datasetInterval').fill('10');

    // 타입: REST API 선택
    await page.locator('input[value="REST_API"]').check();

    // Request settings
    await page.locator('#methodSelect').selectOption('GET');
    await page.locator('#urlInput').fill('https://jsonplaceholder.typicode.com/todos');

    // Header 입력
    await page.locator('.header-key-input').fill('Content-Type');
    await page.locator('.header-value-input').fill('application/json;charset=UTF-8');

    // 실행 결과 미리보기
    await page.locator('.preview-btn').click();
    await page.waitForSelector('.preview-result', { state: 'visible', timeout: 15_000 });

    // 데이터셋 수정
    await page.locator('.dataset-save-btn').click();

    await expect(page.locator('.el-message--success')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.el-message--success')).toContainText('정상적으로 수정');
    console.log('[PASS] REST API 데이터셋 수정 성공 팝업 확인');
  });

  test('DB Query + Static 타입 데이터셋 수정', async ({ page }) => {
    await goToDatasetManager(page);

    // 데이터셋 목록에서 DB Query 타입 항목 선택
    // TODO: 데이터셋 목록에서 특정 항목 selector 확인 필요
    await page.locator('.dataset-list-item').filter({ hasText: 'DB' }).first().click();

    // 데이터셋 정보 입력
    await page.locator('#datasetName').fill('test_db');
    await page.locator('#datasetDesc').fill('1');
    await page.locator('#datasetInterval').fill('10');

    // 타입: DB Query 선택
    await page.locator('input[value="DB_QUERY"]').check();
    // Static 체크
    await page.locator('input[value="STATIC"]').check();

    // 쿼리 입력
    // TODO: 쿼리 에디터 selector 확인 필요
    await page.locator('.query-editor textarea').fill('SELECT 1 FROM DUAL');

    // 파라미터 입력
    await page.locator('.param-name-input').fill('param1');
    await page.locator('.param-default-input').fill('default_value');

    // 실행 결과 미리보기
    await page.locator('.preview-btn').click();
    await page.waitForSelector('.preview-result', { state: 'visible', timeout: 15_000 });

    // 데이터셋 수정
    await page.locator('.dataset-save-btn').click();

    await expect(page.locator('.el-message--success')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.el-message--success')).toContainText('정상적으로 수정');
    console.log('[PASS] DB Query 데이터셋 수정 성공 팝업 확인');
  });
});
