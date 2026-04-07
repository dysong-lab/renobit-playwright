const { test, expect } = require('@playwright/test');
const { ensureEditorSession } = require('../../helpers/renobit');
const { attachTcMeta } = require('./_tc-meta');

test.setTimeout(90_000);

async function goToDatasetManager(page) {
  await page.goto('/renobit/visual.do#/datasetMananger', { waitUntil: 'domcontentloaded' });
  await page.locator('#dataset-manager').waitFor({ state: 'visible', timeout: 15_000 });
}

test.describe('RENOBIT 3.5.0 Final Common TC - Dataset', () => {
  test.beforeEach(async ({ page }) => {
    await ensureEditorSession(page);
  });

  test('TC-R35-DS-001 Dataset Manager 기본 레이아웃', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-DS-001',
      title: 'Dataset Manager 진입 시 기본 레이아웃 및 탭 표시',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'dataset manager 라우트에 접근 가능해야 한다.',
      ],
      expectedResults: [
        'dataset manager 컨테이너, 목록, 메인 탭이 노출되어야 한다.',
        '데이터셋 생성 탭과 환경설정 탭이 보여야 한다.',
        '초기 상태에서는 데이터셋 수정 탭이 노출되지 않아야 한다.',
      ],
    });

    await goToDatasetManager(page);
    await expect(page.locator('#dataset-manager')).toBeVisible();
    await expect(page.locator('#dataset-manager .dataset-list')).toBeVisible();
    await expect(page.locator('#dataset-manager .dataset-main-tabs')).toBeVisible();
    await expect(page.getByRole('tab', { name: '데이터셋 생성' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '환경설정' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '데이터셋 수정' })).toHaveCount(0);
  });

  test('TC-R35-DS-002 Create Dataset 기본 폼 필드', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-DS-002',
      title: 'Create Dataset 폼 기본 필드 표시',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'Dataset Manager 진입이 완료되어야 한다.',
      ],
      expectedResults: [
        '데이터셋명, 설명 입력 필드와 중복확인/미리보기/완료 버튼이 표시되어야 한다.',
      ],
    });

    await goToDatasetManager(page);
    await expect(page.locator('#input01')).toBeVisible();
    await expect(page.locator('#input02')).toBeVisible();
    await expect(page.locator('.double-check-btn')).toBeVisible();
    await expect(page.locator('.preview-btn')).toBeVisible();
    await expect(page.locator('.complete-btn')).toBeVisible();
  });

  test('TC-R35-DS-003 Dataset Import Popup 표시', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-DS-003',
      title: 'Dataset import popup 호출 시 fixture 데이터 표시',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'DatasetListMediator view 가 초기화되어 있어야 한다.',
      ],
      expectedResults: [
        'Dataset import popup 이 열려야 한다.',
        'fixture_dataset 이 목록에 표시되어야 한다.',
        '추가하기 또는 primary action 버튼이 보여야 한다.',
      ],
    });

    await goToDatasetManager(page);
    await page.evaluate(() => {
      const datasetList = window.wemb?.viewComponentMap?.get?.('DatasetListMediator');
      if (!datasetList?.showImportPopup) {
        throw new Error('DatasetListMediator view is not ready');
      }

      datasetList.showImportPopup({
        data: [{ dataset_id: 'fixture-ds-01', name: 'fixture_dataset' }],
        datasource: [],
      });
    });

    const dialog = page.locator('.import-dialog .el-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('fixture_dataset', { exact: true })).toBeVisible();
    await expect(dialog.locator('.el-button--primary')).toBeVisible();
  });

  // ── selector/fixture 미확정 TC: test.skip 선언부 적용 (beforeEach 미실행) ──

  test.skip('TC-R35-DS-004 Dataset 파일 가져오기 TC', async ({}, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-DS-004',
      title: 'Dataset 파일 가져오기',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'Dataset Manager 진입이 완료되어야 한다.',
        '.json 형식의 dataset fixture 파일이 준비되어 있어야 한다.',
      ],
      expectedResults: [
        '파일 가져오기 다이얼로그가 열려야 한다.',
        'fixture dataset 목록이 표시되어야 한다.',
        '추가하기 실행 후 가져오기 완료 메시지가 표시되어야 한다.',
      ],
    });
    // TODO: Dataset import 파일 fixture 및 selector 안정화 후 활성화
  });

  test.skip('TC-R35-DS-005 Dataset 파일 내보내기 TC', async ({}, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-DS-005',
      title: 'Dataset 파일 내보내기',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'Dataset Manager 진입이 완료되어야 한다.',
        '내보낼 수 있는 dataset 이 존재해야 한다.',
      ],
      expectedResults: [
        '파일 내보내기 다이얼로그가 열려야 한다.',
        '대상 dataset 선택 후 내보내기 실행이 가능해야 한다.',
        '완료 메시지 또는 다운로드 시작이 확인되어야 한다.',
      ],
    });
    // TODO: Dataset export selector 및 fixture 안정화 후 활성화
  });

  test.skip('TC-R35-DS-006 REST API 타입 데이터셋 생성/수정 TC', async ({}, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-DS-006',
      title: 'REST API 타입 데이터셋 생성 또는 수정',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'Dataset Manager 진입이 완료되어야 한다.',
        'REST API request settings 입력 필드 selector 가 확정되어야 한다.',
      ],
      expectedResults: [
        '데이터셋명, 설명, 주기, method, url, headers, body 입력이 저장 가능해야 한다.',
        '실행 결과 미리보기가 정상 노출되어야 한다.',
        '저장 후 정상적으로 수정되었습니다 팝업이 표시되어야 한다.',
      ],
    });
    // TODO: REST API dataset editor selector 안정화 후 활성화
  });

  test.skip('TC-R35-DS-007 DB Query 타입 데이터셋 생성/수정 TC', async ({}, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-DS-007',
      title: 'DB Query 타입 데이터셋 생성 또는 수정',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'Dataset Manager 진입이 완료되어야 한다.',
        'DB Query 편집기와 파라미터 입력 selector 가 확정되어야 한다.',
      ],
      expectedResults: [
        '쿼리, 파라미터명, 기본값 입력이 저장 가능해야 한다.',
        '실행 결과 미리보기가 정상 노출되어야 한다.',
        '저장 후 정상적으로 수정되었습니다 팝업이 표시되어야 한다.',
      ],
    });
    // TODO: DB Query dataset editor selector 안정화 후 활성화
  });

  test.skip('TC-R35-DS-008 TIM 타입 데이터셋 설정 TC', async ({}, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-DS-008',
      title: 'TIM 타입 데이터셋 설정',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'Dataset Manager 진입이 완료되어야 한다.',
        'TIM URL 선택 및 검증 흐름 selector 가 확정되어야 한다.',
      ],
      expectedResults: [
        'TIM 타입 선택과 TIM URL 지정이 가능해야 한다.',
        'TIM 연동 설정을 저장 가능한 상태로 유지해야 한다.',
      ],
    });
    // TODO: TIM dataset flow selector 안정화 후 활성화
  });
});
