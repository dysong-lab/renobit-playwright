const { test, expect } = require('@playwright/test');
const {
  goToEditor,
  ensureTestPage,
  openNewPageModal,
  openPropertiesPanel,
  createPageByType,
  savePage,
} = require('../../helpers/renobit');

test.describe('PAGE Module Tests', () => {
  // 에디터 로딩 시간이 걸릴 수 있으므로 120초 타임아웃 부여
  // (페이지 생성마다 isLoaded 대기가 추가되어 복수 페이지 생성 테스트는 60초 초과 가능)
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    // 렌더링 검사/조작을 위해 공통적으로 에디터 세션 복원 및 테스트 페이지 오픈 보장
    await goToEditor(page);
    await ensureTestPage(page, 'qa-page-test-page');
  });

  test('[QATC-3215] Page - New Page - 신규 생성 팝업 { @QA @Page @QATC-3215 }', async ({ page }) => {
    // UI를 통해 신규 생성 팝업 호출
    await openNewPageModal(page);
    const modal = page.getByRole('dialog').first();
    await expect(modal).toBeVisible();
    
    // 팝업 내부 요소 렌더링 확인 (간단히 닫기 버튼으로 검증)
    const closeBtn = modal.locator('.close-modal-btn, .el-dialog__headerbtn').first();
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(modal).toBeHidden({ timeout: 10000 });
  });

  test('[QATC-3217] Page - New Page - 신규 생성 — 신규 페이지 { @QA @Page @QATC-3217 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: New page > 신규 페이지 선택 → 이름 입력 → 생성 클릭
     * [Expected Result]: 신규 페이지 생성됨 (아이디는 고유 값)
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    const { createPageByType } = require('../../helpers/renobit');
    const pageName = `qa_test_page_${Date.now()}`;
    await createPageByType(page, { type: 'page', name: pageName });
    
    // 저장 및 생성 대기
    await page.waitForTimeout(1000);

    // 트리 구조 안에 생성된 이름이 존재하는지 검증
    const pageExists = await page.evaluate((name) => {
      const tree = window.wemb.pageTreeDataManager.treeData;
      return JSON.stringify(tree).includes(name);
    }, pageName);
    expect(pageExists).toBe(true);
  });

  test('[QATC-3219] Page - New Page - 신규 생성 — 신규 그룹 { @QA @Page @QATC-3219 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: New > Group → 이름 입력 → 생성 클릭
     * [Expected Result]: 신규 그룹 생성됨
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    const { createPageByType } = require('../../helpers/renobit');
    const groupName = `qa_test_group_${Date.now()}`;
    await createPageByType(page, { type: 'group', name: groupName });
    
    await page.waitForTimeout(1000);

    const groupExists = await page.evaluate((name) => {
      const tree = window.wemb.pageTreeDataManager.treeData;
      return JSON.stringify(tree).includes(name);
    }, groupName);
    expect(groupExists).toBe(true);
  });

  test('[QATC-3222] Page - New Page - 신규 생성 — 신규 마스터 { @QA @Page @QATC-3222 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: New page > 신규 마스터 선택 → 이름 입력 → 생성 클릭
     * [Expected Result]: 신규 마스터 페이지 생성됨 (아이디는 고유 값)
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    const { createPageByType } = require('../../helpers/renobit');
    const masterName = `qa_test_master_${Date.now()}`;
    await createPageByType(page, { type: 'master', name: masterName });
    
    await page.waitForTimeout(1000);

    const masterExists = await page.evaluate((name) => {
      const tree = window.wemb.pageTreeDataManager.treeData;
      return JSON.stringify(tree).includes(name);
    }, masterName);
    expect(masterExists).toBe(true);
  });

  test('[QATC-3224] Page - New Page - 모바일 마스터 { @QA @Page @QATC-3224 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: New page > 신규 마스터 선택 > Mobile Master 선택 → 이름 입력 → 생성 클릭
     * [Expected Result]: mobile master page 생성 확인, toolbar 모바일 마스터 버튼 활성, 모바일 화면 확인
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    const { createPageByType } = require('../../helpers/renobit');
    const mobileMasterName = `qa_mobile_master_${Date.now()}`;
    
    // UI를 통한 생성 시도 (모바일 옵션 true)
    await createPageByType(page, { type: 'master', name: mobileMasterName, mobile: true });
    
    await page.waitForTimeout(2000);

    const mobileResult = await page.evaluate((name) => {
      const activeObj = window.wemb.pageManager.currentPageInfo;
      const mainActive = window.wemb.mainPageComponent.activePageBaseModel;
      const tree = window.wemb.pageTreeDataManager.treeData || [];
      
      // 진단 결과 확인된 정확한 필드명 사용: master_type === 'mobile'
      const isMobile = activeObj?.master_type === 'mobile' || 
                       mainActive?.config?.master_type === 'mobile';
                       
      return tree.some(i => i.text === name) && !!isMobile;
    }, mobileMasterName);
    
    expect(mobileResult).toBe(true, '모바일 마스터 페이지가 정상 생성되고 모바일 타입으로 설정되어야 합니다.');
  });


  test('[QATC-3199] Page - Master Page - Master Page — 셀렉트박스 { @QA @Page @QATC-3199 }', async ({ page }) => {
    /**
     * [Precondition]: 마스터 페이지 + 일반 페이지 생성, 일반 페이지에 마스터 지정
     * [Test Steps]: 마스터 페이지 오픈 → Properties 탭 확인
     * [Expected Result]: Refer Page 셀렉트박스 노출, 드롭다운에 참조 페이지 표시
     *   (DocumentTemplate.vue: primary.type !== 'page' 이면 Refer Page 섹션 렌더링)
     *
     * [Note]: currentPageInfo.referPage = editorService.getPageInfo 서버 응답에서 로드
     *   서버는 명시적으로 할당된 페이지만 반환하므로,
     *   editorService.updateReferPage API 호출로 관계를 저장한 후 마스터 페이지 재오픈 필요.
     *   (pageApi["a"].updateReferPage = webpack 내부 모듈, window.wemb 미노출 → fetch로 직접 호출)
     */
    const masterName = `master_${Date.now()}`;
    const normalName = `normal_${Date.now()}`;

    await createPageByType(page, { type: 'master', name: masterName });
    await createPageByType(page, { type: 'page', name: normalName });

    // 페이지 ID 수집
    const { masterId, normalId } = await page.evaluate(({ mName, nName }) => {
      const treeData = window.wemb?.pageTreeDataManager?.treeData || [];
      return {
        masterId: treeData.find(i => i.text === mName)?.id,
        normalId: treeData.find(i => i.text === nName)?.id,
      };
    }, { mName: masterName, nName: normalName });

    // editorService.updateReferPage 호출 (pageApi["a"].updateReferPage와 동일)
    await page.evaluate(async ({ masterId, normalId }) => {
      const workUrl = window.wemb.configManager.workUrl;
      await fetch(workUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'AJAX': 'true' },
        credentials: 'include',
        body: JSON.stringify({
          id: 'editorService.updateReferPage',
          params: { type: 'master', master_id: masterId, page_id: [normalId], master_type: 'default' }
        })
      });
    }, { masterId, normalId });

    // masterId/normalId null 체크
    expect(masterId, `masterId not found for "${masterName}"`).toBeTruthy();
    expect(normalId, `normalId not found for "${normalName}"`).toBeTruthy();

    // 마스터 페이지 재오픈 (서버에서 최신 referPage 목록 로드)
    await ensureTestPage(page, masterName);
    await openPropertiesPanel(page);

    // Refer Page 셀렉트박스 노출 확인
    const referPageSelect = page.locator('#component-property-panel input[placeholder="Select a page"]').first();
    await expect(referPageSelect).toBeVisible({ timeout: 10000 });

    // 드롭다운 오픈 → normalName 항목 노출 확인
    // page.evaluate 내 toggleMenu() 호출은 포커스 이탈로 드롭다운이 즉시 닫히므로
    // Playwright 실제 클릭으로 드롭다운을 열어야 함
    await referPageSelect.click();
    const dropdown = page.locator('.el-select-dropdown').filter({ hasText: normalName }).first();
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    const option = page.locator('.el-select-dropdown__item').filter({ hasText: normalName }).first();
    await expect(option).toBeVisible({ timeout: 5000 });
  });

  test('[QATC-3202] Page - Master Page - Master Page — Refer Page 미선택 { @QA @Page @QATC-3202 }', async ({ page }) => {
    /**
     * [Precondition]: 아무 일반 페이지도 참조하지 않는 마스터 페이지 생성
     * [Test Steps]: 마스터 페이지 오픈 → Properties 탭
     * [Expected Result]: Refer Page 셀렉트박스에 'Select a page' placeholder 노출 (미선택 상태)
     *   (el-select placeholder는 input attribute이므로 input[placeholder="Select a page"]로 탐색)
     */
    const masterName = `master_none_${Date.now()}`;
    // createPageByType 완료 시 마스터 페이지로 이동된 상태
    await createPageByType(page, { type: 'master', name: masterName });

    // Properties 패널 열기
    await openPropertiesPanel(page);

    // Refer Page 셀렉트박스 placeholder 확인 (selectedReferPage가 null이면 placeholder 표시)
    const selectBoxPlaceholder = page.locator('#component-property-panel input[placeholder="Select a page"]').first();
    await expect(selectBoxPlaceholder).toBeVisible({ timeout: 10000 });
  });

  test('[QATC-3203] Page - Master Page - Master Page — Refer Page 선택 { @QA @Page @QATC-3203 }', async ({ page }) => {
    /**
     * [Precondition]: 마스터 페이지 + 일반 페이지(2D) 생성, 일반 페이지에 마스터 지정
     * [Test Steps]: 마스터 페이지 오픈 → Properties 탭 → Refer Page 셀렉트박스에서 페이지 선택
     * [Expected Result]: 선택한 페이지 고정 노출, 셀렉트박스 우측 Go to 버튼 노출
     *   (DocumentTemplate.vue: selectedReferPage 설정 시 v-show로 .go-page-icon 표시)
     *
     * [Note]: currentPageInfo.referPage = 서버 명시 할당 목록
     *   editorService.updateReferPage API로 관계 저장 후 마스터 페이지 재오픈 시 드롭다운에 표시됨.
     */
    const masterName = `master_ref_${Date.now()}`;
    const normalName = `normal_ref_${Date.now()}`;
    await createPageByType(page, { type: 'master', name: masterName });
    await createPageByType(page, { type: 'page', name: normalName });

    // 페이지 ID 수집
    const { masterId, normalId } = await page.evaluate(({ mName, nName }) => {
      const treeData = window.wemb?.pageTreeDataManager?.treeData || [];
      return {
        masterId: treeData.find(i => i.text === mName)?.id,
        normalId: treeData.find(i => i.text === nName)?.id,
      };
    }, { mName: masterName, nName: normalName });

    // editorService.updateReferPage 호출 (pageApi["a"].updateReferPage와 동일)
    await page.evaluate(async ({ masterId, normalId }) => {
      const workUrl = window.wemb.configManager.workUrl;
      await fetch(workUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'AJAX': 'true' },
        credentials: 'include',
        body: JSON.stringify({
          id: 'editorService.updateReferPage',
          params: { type: 'master', master_id: masterId, page_id: [normalId], master_type: 'default' }
        })
      });
    }, { masterId, normalId });

    // 마스터 페이지 재오픈 (서버에서 최신 referPage 목록 로드)
    await ensureTestPage(page, masterName);

    await openPropertiesPanel(page);

    // masterId/normalId null 체크: createPageByType 후 treeData에 반영 안 됐으면 실패
    expect(masterId, `masterId not found for "${masterName}"`).toBeTruthy();
    expect(normalId, `normalId not found for "${normalName}"`).toBeTruthy();

    // Refer Page 셀렉트박스에서 normal 페이지 선택
    // el-option의 select() 대신, 부모 el-select에 값을 직접 주입하고 이벤트를 발생시켜 안정성 확보
    const selectInput = page.locator('#component-property-panel input[placeholder="Select a page"]').first();
    await selectInput.waitFor({ state: 'visible', timeout: 10000 });
    await page.evaluate(({ nId }) => {
      const input = document.querySelector('#component-property-panel input[placeholder="Select a page"]');
      const select = input?.closest('.el-select')?.__vue__;
      if (select) {
        select.value = nId;
        select.$emit('input', nId);
        select.$emit('change', nId);
      }
    }, { nId: normalId });

    // 선택 후 Go to Refer page 버튼(.go-page-icon) 노출 확인
    const goToBtn = page.locator('.go-page-icon').first();
    await expect(goToBtn).toBeVisible({ timeout: 5000 });
  });

  test('[QATC-3206] Page - Master Page - 일반 Page — Master Page 지정된 경우 { @QA @Page @QATC-3206 }', async ({ page }) => {
    /**
     * [Precondition]: 마스터 페이지 생성 후 일반 페이지(qa-page-test-page)에 마스터 지정
     * [Test Steps]: 일반 페이지 Properties 탭 오픈 → 마스터 페이지 이름 클릭
     * [Expected Result]: 마스터 페이지 이름 노출, 마스터 페이지 이름 클릭 시 해당 마스터 페이지로 자동 이동
     */
    const masterName = `master_link_${Date.now()}`;
    const normalName = 'qa-page-test-page';
    
    // 마스터 생성
    await createPageByType(page, { type: 'master', name: masterName });

    // 페이지 ID 수집
    const { masterId, normalId } = await page.evaluate(({ mName, nName }) => {
      const treeData = window.wemb?.pageTreeDataManager?.treeData || [];
      return {
        masterId: treeData.find(i => i.text === mName)?.id,
        normalId: treeData.find(i => i.text === nName)?.id,
      };
    }, { mName: masterName, nName: normalName });

    // editorService.updateReferPage 호출로 관계 저장
    await page.evaluate(async ({ masterId, normalId }) => {
      const workUrl = window.wemb.configManager.workUrl;
      await fetch(workUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'AJAX': 'true' },
        credentials: 'include',
        body: JSON.stringify({
          id: 'editorService.updateReferPage',
          params: { type: 'master', master_id: masterId, page_id: [normalId], master_type: 'default' }
        })
      });
    }, { masterId, normalId });

    // 일반 페이지 재오픈하여 갱신된 정보 확인
    await ensureTestPage(page, normalName);
    await openPropertiesPanel(page);

    // 마스터 페이지 이름 노출 확인
    const masterLabel = page.locator('#component-property-panel span, #component-property-panel div')
      .filter({ hasText: /^Master Page$/ }).first();
    await expect(masterLabel).toBeVisible({ timeout: 15000 });
    
    // "Master Page" SPAN의 2단계 위(row 컨테이너)에서 non-checkbox input을 찾음
    const masterInput = page.locator('#component-property-panel')
      .locator('xpath=.//*[normalize-space(text())="Master Page"]/../..//input[not(@type="checkbox")]')
      .first();
    const displayValue = await masterInput.inputValue();
    
    if (displayValue === masterId) {
      await expect(masterInput).toHaveValue(masterId);
    } else {
      await expect(masterInput).toHaveValue(masterName);
    }

    // Go to Master page 버튼(.go-page-icon) 클릭
    const goToBtn = page.locator('#component-property-panel .go-page-icon').first();
    await expect(goToBtn).toBeVisible({ timeout: 5000 });
    await goToBtn.click();

    // 마스터 페이지로 이동되었는지 확인 (현재 페이지 정보 검증)
    await page.waitForFunction(
      (mName) => window.wemb?.pageManager?.currentPageInfo?.name === mName,
      masterName, { timeout: 10000 }
    );
  });

  test('[QATC-3207] Page - Master Page - 일반 Page — 포함저장 체크 해제 { @QA @Page @QATC-3207 }', async ({ page }) => {
    test.setTimeout(180_000);
    /**
     * [Precondition]: 마스터 생성 → 일반 페이지에 마스터 지정 저장
     * [Test Steps]: 일반 페이지 Properties → '마스터 페이지 포함 저장' 체크 해제 → 저장
     * [Expected Result]: 저장 성공 (체크 해제 상태에서 마스터에 반영 안됨)
     *   (DocumentTemplate.vue: #checkbox-area → el-checkbox, !!masterName일 때만 표시)
     */
    const masterName = `master_unchk_${Date.now()}`;
    await createPageByType(page, { type: 'master', name: masterName });
    await ensureTestPage(page, 'qa-page-test-page');

    // 일반 페이지에 마스터 지정 + 저장
    await page.evaluate(({ mName }) => {
      const master = window.wemb.pageTreeDataManager.treeData.find(i => i.text === mName);
      if (master) {
        window.wemb.pageManager.currentPageInfo.master = master.id;
        window.wemb.editorFacade.sendNotification('command/savePage');
      }
    }, { mName: masterName });
    // 저장 완료 신호: 서버 응답 후 success 토스트 출현
    await page.locator('.el-message--success').first().waitFor({ state: 'attached', timeout: 10000 });
    await ensureTestPage(page, 'qa-page-test-page');

    // Properties 패널 열기
    await openPropertiesPanel(page);

    // #checkbox-area는 !!masterName일 때만 v-show → 마스터 지정이 성공하면 보임
    const checkboxArea = page.locator('#checkbox-area');
    await checkboxArea.waitFor({ state: 'visible', timeout: 10000 });

    // 체크되어 있으면 해제
    const checkboxInput = checkboxArea.locator('input[type="checkbox"]');
    if (await checkboxInput.isChecked()) {
      await checkboxArea.locator('.el-checkbox').click();
    }

    await savePage(page);
    await expect(page.locator('.el-message--success').first()).toBeAttached();
  });


  /*----------------- 여기까지 수정-------------------------*/
  test('[QATC-3210] Page - Master Page - 일반 Page — 포함저장 체크 { @QA @Page @QATC-3210 }', async ({ page }) => {
    /**
     * [Precondition]: beforeEach에서 열린 qa-page-test-page(일반 페이지)에 마스터 지정 상태
     * [Test Steps]: Properties 탭 → '마스터 페이지 포함 저장' 체크 확인 → 저장
     * [Expected Result]: 저장 성공 (체크 상태에서 마스터에 반영됨)
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    const { savePage } = require('../../helpers/renobit');
    
    // 포함 저장 체크박스 확인 및 체크
    const innerSaveCheckbox = page.locator('text=마스터 페이지 포함 저장, .el-checkbox').first();
    if (await innerSaveCheckbox.isVisible()) {
      const checkboxInput = innerSaveCheckbox.locator('input[type="checkbox"]');
      if (!(await checkboxInput.isChecked())) {
        await innerSaveCheckbox.click();
      }
    }
    
    await savePage(page);
    await expect(page.locator('.el-message--success').first()).toBeAttached();
  });

  test('[QATC-3211] Page - Master Page - 일반 Page — Master Page 미지정 { @QA @Page @QATC-3211 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: 마스터 미지정 상태의 일반 페이지(qa-page-test-page) → Properties > Master Page
     * [Expected Result]: No Master Page 노출
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    // 신규 생성 페이지는 마스터 미지정이 보장됨 (이전 테스트 오염 방지)
    const freshPageName = `nomaster_${Date.now()}`;
    await createPageByType(page, { type: 'page', name: freshPageName });

    // 마스터 페이지가 지정되지 않은 일반 페이지의 기본 상태 확인
    await openPropertiesPanel(page);
    const masterInput = page.locator('#component-property-panel')
      .locator('xpath=.//*[normalize-space(text())="Master Page"]/../..//input[not(@type="checkbox")]')
      .first();
    await expect(masterInput).toBeVisible({ timeout: 10000 });
    await expect(masterInput).toHaveValue('');
  });

  test('[QATC-3226] Page - Save - Save { @QA @Page @QATC-3226 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: 신규 페이지 생성 → 임의 컴포넌트 드래그&드롭 → 저장 클릭
     * [Expected Result]: 변경된 컴포넌트들이 저장됨
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    const { savePage } = require('../../helpers/renobit');
    
    // 컴포넌트 추가 action (Box 하나 추가)
    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/addComponentInstanceByName', {
        componentName: 'BoxComponent',
        name: 'save_test_box'
      });
    });
    
    await savePage(page);
    
    // 저장 후 성공 토스트 메시지나 상태 확인 (Toast 메시지가 떴다 사라지므로 짧게 대기)
    const toast = page.locator('.el-message--success').first();
    await expect(toast).toBeAttached();
  });

  test('[QATC-3227] Page - Save - Save as { @QA @Page @QATC-3227 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: 신규 페이지 생성 → 임의 컴포넌트 드래그&드롭 → 다른 이름으로 저장 클릭
     * [Expected Result]: 기존 페이지 이름_copy page 생성됨
     * [Automation Note]: UI 조작 + page.evaluate()로 자동화 가능
     */
    const { savePage } = require('../../helpers/renobit');
    const originalName = await page.evaluate(() => window.wemb.pageManager.currentPageInfo.name);
    const copyName = `${originalName}_copy`;

    // 헬퍼를 사용한 '다른 이름으로 저장' 조작
    await savePage(page, copyName);
    
    await page.waitForTimeout(2000);
    const tree = await page.evaluate(() => window.wemb.pageTreeDataManager.treeData);
    expect(tree.some(i => i.text === copyName)).toBe(true);
  });

  test('[QATC-3229] Page - 컨텍스트 메뉴 - New — Group / Page / Master { @QA @Page @QATC-3229 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: 신규 페이지 우클릭 → New > Group / Page / Master 클릭
     * [Expected Result]: Group / Page / Master 생성 팝업창 표출
     */
    const { rightClickTreeItem, selectContextMenu } = require('../../helpers/renobit');
    const currentPageName = await page.evaluate(() => window.wemb.pageManager.currentPageInfo.name);
    
    // 신규 함수를 사용한 우클릭
    await rightClickTreeItem(page, currentPageName);
    
    // 'New' 메뉴 호버 (정규식 대응)
    await selectContextMenu(page, /New|신규/i);
    
    // 서브메뉴에서 'Page' 클릭
    await page.waitForSelector('.vakata-context', { state: 'visible' });
    await selectContextMenu(page, /Page|페이지/i);
    
    const modal = page.getByRole('dialog').first();
    await expect(modal).toBeVisible();
  });

  test('[QATC-3230] Page - 컨텍스트 메뉴 - Rename { @QA @Page @QATC-3230 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: 신규 페이지 우클릭 → Rename 클릭
     * [Expected Result]: 페이지 이름 수정 가능
     */
    const { rightClickTreeItem, selectContextMenu } = require('../../helpers/renobit');
    const currentPageName = await page.evaluate(() => window.wemb.pageManager.currentPageInfo.name);
    
    await rightClickTreeItem(page, currentPageName);
    await selectContextMenu(page, /Rename|이름 수정/i);
    
    // 트리 내 입력창 활성화 확인
    const renameInput = page.locator('input.jstree-edit-input').first();
    await expect(renameInput).toBeVisible();
  });

  test('[QATC-3231] Page - 컨텍스트 메뉴 - Delete { @QA @Page @QATC-3231 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: 신규 페이지 우클릭 → Delete → 삭제 클릭 → DELETE 대문자로 입력해야 삭제됨
     * [Expected Result]: 페이지 삭제됨
     */
    const { createPageByType, rightClickTreeItem, selectContextMenu } = require('../../helpers/renobit');
    const pageName = `to_be_deleted_${Date.now()}`;
    await createPageByType(page, { type: 'page', name: pageName });
    
    await rightClickTreeItem(page, pageName);
    await selectContextMenu(page, /Delete|삭제/i);
    
    // 삭제 확인 다이얼로그 (ElementUI MessageBox)
    const deleteDialog = page.locator('.el-message-box, .v--modal-box').filter({ hasText: /삭제|Delete|Confirm/i }).first();
    await expect(deleteDialog).toBeVisible();
    
    // 'DELETE' 입력
    const confirmInput = deleteDialog.locator('input').first();
    await confirmInput.fill('DELETE');
    
    const confirmBtn = deleteDialog.locator('button').filter({ hasText: /삭제|OK|Confirm|확인/i }).first();
    await confirmBtn.click();
    
    await page.waitForTimeout(2000);
    const isDeleted = await page.evaluate((name) => {
      const tree = window.wemb.pageTreeDataManager.treeData || [];
      return !tree.some(i => i.text === name);
    }, pageName);
    expect(isDeleted).toBe(true);
  });

  test('[QATC-3232] Page - 컨텍스트 메뉴 - Update — Init page { @QA @Page @QATC-3232 }', async ({ page }) => {
    /**
     * [Precondition]: -
     * [Test Steps]: 신규 페이지 우클릭 → Update > Init page 클릭
     * [Expected Result]: 재로그인 시 해당 페이지가 표출됨
     */
    const { rightClickTreeItem, selectContextMenu } = require('../../helpers/renobit');
    const currentPageName = await page.evaluate(() => window.wemb.pageManager.currentPageInfo.name);
    
    await rightClickTreeItem(page, currentPageName);
    
    // 'Update' 메뉴 호버
    await selectContextMenu(page, /Update|수정/i);
    
    // 마우스 호버로 서브메뉴 대기
    await page.waitForSelector('.vakata-context', { state: 'visible' });
    
    // 'Init page' 클릭
    await selectContextMenu(page, /Init page|초기 페이지/i);
    
    await page.waitForTimeout(1000);
    const isInitSet = await page.evaluate((name) => {
      const pageInfo = (window.wemb.pageTreeDataManager.treeData || []).find(i => i.text === name);
      return pageInfo?.isInitPage === true || pageInfo?.isStartPage === true;
    }, currentPageName);
    expect(isInitSet).toBe(true);
  });

});
