const { test, expect } = require('@playwright/test');
const path = require('path');

const { ensureEditorSession } = require('../../helpers/renobit');
const { attachTcMeta } = require('./_tc-meta');

test.setTimeout(90_000);

const FIXTURES = path.join(__dirname, '../../fixtures');

const RESOURCE_TABS = [
  { id: 'TC-R35-RES-001', label: 'Images', note: 'image 업로드 대상 탭' },
  { id: 'TC-R35-RES-002', label: 'Background', note: 'background 업로드 대상 탭' },
  { id: 'TC-R35-RES-003', label: 'Icons', note: 'icons 업로드 대상 탭' },
  { id: 'TC-R35-RES-004', label: 'Button Images', note: 'button images 업로드 대상 탭' },
  { id: 'TC-R35-RES-005', label: 'Sprite Clip', note: 'sprite clip 업로드 대상 탭' },
  { id: 'TC-R35-RES-006', label: 'State Clip', note: 'state clip 업로드 대상 탭' },
  { id: 'TC-R35-RES-007', label: 'GLTF', note: 'gltf 업로드 대상 탭' },
  { id: 'TC-R35-RES-008', label: 'Lottie', note: 'lottie 업로드 대상 탭' },
  { id: 'TC-R35-RES-009', label: 'HDR', note: 'hdr 업로드 대상 탭' },
];

test.describe('RENOBIT 3.5.0 Final Common TC - Resource', () => {
  test.beforeEach(async ({ page }) => {
    await ensureEditorSession(page);
    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/showResourceManager');
    });
    await page.locator('#resource-manager').waitFor({ state: 'visible', timeout: 15_000 });
  });

  for (const resourceTab of RESOURCE_TABS) {
    test(`${resourceTab.id} ${resourceTab.label} 탭 노출`, async ({ page }, testInfo) => {
      await attachTcMeta(testInfo, {
        id: resourceTab.id,
        title: `Resource Manager > ${resourceTab.label} 탭 노출 확인`,
        preconditions: [
          '에디터 로그인 완료 상태여야 한다.',
          'Resource Manager 모달이 열린 상태여야 한다.',
        ],
        expectedResults: [
          `${resourceTab.label} 탭이 Resource Manager 내에 표시되어야 한다.`,
          `${resourceTab.note} 이 가능한 카테고리로 식별할 수 있어야 한다.`,
        ],
      });

      const tab = page.locator('#resource-manager').getByRole('tab', {
        name: resourceTab.label,
        exact: true,
      });
      await expect(tab).toBeVisible();
    });
  }

  test('TC-R35-RES-010 기본 활성 탭은 Images', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-RES-010',
      title: 'Resource Manager 진입 시 기본 활성 탭 확인',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'Resource Manager 모달이 열린 상태여야 한다.',
      ],
      expectedResults: [
        '진입 직후 Images 탭이 active 상태여야 한다.',
      ],
    });

    await expect(
      page.locator('#resource-manager').getByRole('tab', { name: 'Images', exact: true })
    ).toHaveClass(/is-active/);
  });

  test('TC-R35-RES-011 Import Resources 파일 선택 TC', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-RES-011',
      title: 'RENOBIT > import resources 실행 후 zip 파일 선택',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'fixtures/resources.zip 파일이 준비되어 있어야 한다.',
      ],
      expectedResults: [
        '리소스 가져오기 명령 실행 후 zip 파일 선택 입력이 오류 없이 처리되어야 한다.',
        '실운영 환경에서는 리소스 추가 성공 메시지가 노출되어야 한다.',
      ],
    });

    await Promise.all([
      page.evaluate(() => {
        window.wemb.editorFacade.sendNotification('command/importResources');
      }),
      page.setInputFiles('#importFile', path.join(FIXTURES, 'resources.zip')),
    ]);
  });

  test('TC-R35-RES-012 Export Resources 모달 표시', async ({ page }, testInfo) => {
    await attachTcMeta(testInfo, {
      id: 'TC-R35-RES-012',
      title: 'RENOBIT > export resources 실행 시 Export Resources 모달 표시',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
      ],
      expectedResults: [
        'Export Resources 모달이 표시되어야 한다.',
        '내보낼 리소스를 선택할 수 있는 화면이 보여야 한다.',
      ],
    });

    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/showExportResourcesManager');
    });

    const modal = page.locator('#export-resource-manager');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Export Resources')).toBeVisible();
  });
});
