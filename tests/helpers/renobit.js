async function setLoginCredentials(page, { username, password }) {
  await page.waitForSelector('#idInput', { state: 'visible' });
  await page.waitForSelector('#pwInput', { state: 'visible' });

  await page.evaluate(
    ({ id, pw }) => {
      const idInput = document.getElementById('idInput');
      const pwInput = document.getElementById('pwInput');

      if (!idInput || !pwInput) {
        throw new Error('Login inputs are not available');
      }

      idInput.focus();
      idInput.value = '';
      idInput.dispatchEvent(new Event('input', { bubbles: true }));
      idInput.value = id;
      idInput.dispatchEvent(new Event('input', { bubbles: true }));
      idInput.dispatchEvent(new Event('change', { bubbles: true }));

      pwInput.focus();
      pwInput.value = '';
      pwInput.dispatchEvent(new Event('input', { bubbles: true }));
      pwInput.value = pw;
      pwInput.dispatchEvent(new Event('input', { bubbles: true }));
      pwInput.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { id: username, pw: password }
  );

  await page.waitForFunction(
    ({ id, pw }) =>
      document.getElementById('idInput')?.value === id &&
      document.getElementById('pwInput')?.value === pw,
    { id: username, pw: password }
  );
}

async function setEditorMode(page, enabled) {
  const editorCheckbox = page.locator('#Editor');
  await editorCheckbox.waitFor({ state: 'attached' });

  const isChecked = await editorCheckbox.isChecked().catch(() => false);
  if (enabled && !isChecked) {
    await editorCheckbox.check();
    return;
  }

  if (!enabled && isChecked) {
    await editorCheckbox.uncheck();
  }
}

async function submitLogin(
  page,
  {
    username = 'admin',
    password = 'didi0205!!',
    editor = true,
    successPattern,
  } = {}
) {
  await setLoginCredentials(page, { username, password });
  await setEditorMode(page, editor);
  await page.locator('button.new_btn').click();

  const expectedPattern = successPattern || (editor ? /\/renobit\/visual\.do#\// : /\/renobit\/visualViewer\.do#\//);
  await page.waitForURL(expectedPattern, { timeout: 20_000 });

  if (editor) {
    // new_btn은 새 페이지를 생성하므로 threeLayer + isLoaded까지 대기한다.
    await page.waitForFunction(
      () =>
        !!window.wemb?.mainPageComponent?.threeLayer &&
        window.wemb?.mainPageComponent?.isLoaded === true,
      { timeout: 60_000 }
    );
  }
}

async function loginAsEditor(page) {
  await page.goto('/renobit/login.do', { waitUntil: 'domcontentloaded' });
  await submitLogin(page, { editor: true });
}

async function submitEditorLogin(page) {
  await submitLogin(page, { editor: true });
}

async function loginAsViewer(page) {
  await page.goto('/renobit/login.do', { waitUntil: 'domcontentloaded' });
  await submitLogin(page, { editor: false });
}

async function waitForEditorReady(page) {
  // source 기준 READY_COMPLETED + page tree 초기화까지 확인해야
  // createPageModal / pageTreeDataManager 사용 시점이 안전하다.
  await page.waitForFunction(
    () => {
      const editorProxy = window.wemb?.editorProxy;
      const pageTreeDataManager = window.wemb?.pageTreeDataManager;

      return !!(
        window.wemb?.editorFacade &&
        window.wemb?.mainPageComponent &&
        window.wemb?.$createPageModal &&
        editorProxy &&
        editorProxy._readyCompleted === true &&
        pageTreeDataManager?._rootId &&
        pageTreeDataManager?.focusTargetId &&
        Array.isArray(pageTreeDataManager?.treeData)
      );
    },
    { timeout: 60_000 }
  );
}

async function ensureEditorSession(page) {
  await page.goto('/renobit/visual.do', { waitUntil: 'domcontentloaded' });

  const loginInput = page.locator('#idInput');
  if (
    page.url().includes('/renobit/login.do') ||
    (await loginInput.isVisible().catch(() => false))
  ) {
    await submitEditorLogin(page);
    return;
  }

  await waitForEditorReady(page);

  // 에디터가 초기 페이지를 자동 로딩 중일 수 있으므로 완전히 끝날 때까지 넉넉히 60초 대기합니다.
  // (에셋이 거대한 프로젝트의 경우 15초 이상 걸릴 수 있습니다.)
  await page.waitForFunction(
    () => window.wemb?.mainPageComponent?.isLoaded === true || window.wemb?.pageTreeDataManager?.treeData?.length === 0,
    { timeout: 60_000 }
  );

  const hasActivePage = await page.evaluate(
    () => !!window.wemb?.pageManager?.currentPageInfo?.id
  );

  if (!hasActivePage) {
    const firstPageId = await page.evaluate(() => {
      const treeData = window.wemb?.pageTreeDataManager?.treeData || [];
      const firstPage = treeData.find((item) => item.type === 'page');
      return firstPage?.id || null;
    });
    if (firstPageId) {
      await page.evaluate((id) => {
        window.wemb.editorFacade.sendNotification('command/openPage', id);
      }, firstPageId);
      await waitForActiveEditorPage(page, firstPageId);
    }
  }
}

/**
 * storageState로 세션을 복원한 후 에디터 URL로 이동하고 완전히 준비될 때까지 대기.
 * loginAsEditor 대신 사용 (로그인 폼 제출 없이 세션 재사용).
 */
async function goToEditor(page) {
  await ensureEditorSession(page);
}

async function waitForActiveEditorPage(page, pageId) {
  await page.waitForFunction(
    (id) => {
      const currentId = window.wemb?.pageManager?.currentPageInfo?.id;
      const isLoaded = window.wemb?.mainPageComponent?.isLoaded === true;
      const isLoading = window.wemb?.mainPageComponent?.isLoading === true;
      const pageType = window.wemb?.pageManager?.currentPageInfo?.type;

      if (currentId !== id) return false;
      // 로딩 중이면 대기
      if (!isLoaded && isLoading) return false;
      // isLoading=false로 멈춘 경우(OpenPageCommand 에러 경로): 진행 허용
      if (!isLoaded) return true;
      if (pageType === 'master') return true;

      let configObj = window.wemb?.pageManager?.currentPageInfo?.config;
      if (typeof configObj === 'string') {
         try { configObj = JSON.parse(configObj); } catch(e) {}
      }
      const is3D = configObj?.three === true || configObj?.three === "true";
      if (!is3D) return true;

      return !!window.wemb?.mainPageComponent?.threeLayer;
    },
    pageId,
    { timeout: 120_000 }
  );
}

async function waitForComponents(page, names, timeout = 10_000) {
  const targetNames = Array.isArray(names) ? names : [names];

  await page.waitForFunction(
    (instanceNames) => {
      const mainPageComponent = window.wemb?.mainPageComponent;
      const threeLayer = mainPageComponent?.threeLayer;
      const selectedInstances =
        window.wemb?.editorProxy?._selectProxy?.currentPropertyManager?.getInstanceList?.() || [];

      return instanceNames.every((instanceName) => {
        return !!(
          mainPageComponent?.getComInstanceByName?.(instanceName) ||
          mainPageComponent?.comInstanceList?.find?.((comp) => comp.name === instanceName) ||
          selectedInstances.find((comp) => comp.name === instanceName) ||
          threeLayer?._tempGroupComponents?.find?.((comp) => comp.name === instanceName)
        );
      });
    },
    targetNames,
    { timeout }
  );
}

async function ensureActivePage(page) {
  await page.waitForFunction(() => !!window.wemb?.pageManager?.currentPageInfo?.id);
}

async function findPageIdByName(page, pageName) {
  return page.evaluate((name) => {
    const treeData = window.wemb?.pageTreeDataManager?.treeData || [];
    // type 무관하게 이름으로 탐색 (page/master/group 모두 대응)
    const found = treeData.find((item) => item.text === name);
    return found?.id || null;
  }, pageName);
}

async function closeCreatePageModalIfVisible(page) {
  const modal = page.getByRole('dialog').first();
  if (!(await modal.isVisible().catch(() => false))) {
    return;
  }

  const closeButton = modal.locator('.close-modal-btn').first();
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
    await modal.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }
}

/**
 * jstree의 특정 항목을 우클릭하여 컨텍스트 메뉴를 호출합니다.
 */
async function rightClickTreeItem(page, itemName) {
  // jstree가 DOM에 마운트될 때까지 대기
  await page.waitForSelector('.jstree', { state: 'attached', timeout: 10000 }).catch(() => {});

  // collapse된 부모 노드 아래 anchor가 hidden 상태일 수 있으므로 모든 jstree 노드 펼치기
  await page.evaluate(() => {
    document.querySelectorAll('.jstree').forEach(tree => {
      if (window.$ && $.fn.jstree) $(tree).jstree('open_all');
    });
  }).catch(() => {});

  // open_all 애니메이션/렌더링 완료 대기
  await page.waitForTimeout(500);

  const anchor = page.locator('a.jstree-anchor').filter({ hasText: itemName }).first();
  // dispatchEvent는 visibility 불필요 — attached만 확인
  await anchor.waitFor({ state: 'attached', timeout: 10000 });
  await anchor.scrollIntoViewIfNeeded().catch(() => {});

  // click({ button: 'right' }) 대신 dispatchEvent 사용하여 jstree 이벤트 확실히 트리거
  await anchor.dispatchEvent('contextmenu');

  // 메뉴가 뜰 때까지 대기
  await page.waitForSelector('.vakata-context', { state: 'visible', timeout: 5000 });
}

/**
 * 노출된 컨텍스트 메뉴에서 특정 텍스트를 가진 항목을 클릭합니다.
 * page.evaluate 내 element.click()은 합성 이벤트라 pointer/mouse 이벤트가 발생하지 않아
 * jstree 서브메뉴 hover 활성화가 안 됩니다. Playwright locator의 네이티브 클릭을 사용합니다.
 */
async function selectContextMenu(page, labelRegex) {
  const item = page.locator('.vakata-context li > a')
    .filter({ hasText: labelRegex })
    .first();
  await item.waitFor({ state: 'visible', timeout: 5000 });
  // hover로 서브메뉴 펼침 (서브메뉴가 없는 항목에도 무해함)
  await item.hover();
  await item.click();
}

/**
 * 신규 페이지 생성 모달을 엽니다.
 * $createPageModal.showNewPage(type)이 실제 API입니다.
 * (소스: ShowNewPageModalCommand.ts → $createPageModal.showNewPage(createType))
 */
async function openNewPageModal(page) {
  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      window.wemb.$createPageModal?.showNewPage?.('page');
    });
    const attached = await page.locator('#pageName, #pageName2').first()
      .waitFor({ state: 'attached', timeout: 3000 })
      .then(() => true).catch(() => false);
    if (attached) return;
  }
  await page.locator('#pageName, #pageName2').first().waitFor({ state: 'attached', timeout: 5000 });
}

async function createPageByType(page, { type = 'page', name, mobile = false }) {
  // 1. showNewPage(type)으로 모달 오픈 — input이 DOM에 붙을 때까지 최대 3회 재시도
  // (소스: ShowNewPageModalCommand.ts → $createPageModal.showNewPage(createType))
  for (let i = 0; i < 3; i++) {
    await page.evaluate(async (createType) => {
      const modal = window.wemb.$createPageModal;
      try {
        modal.showNewPage(createType);
      } catch (e) {
        // showNewPage가 threeLayer 미초기화(master 페이지 상태 등)로 실패할 경우 직접 세팅
        if (typeof createType !== 'string') createType = 'page';
        modal.createType = createType;
        modal.saveAs = false;
        modal.isMobile = false;
        modal.pageMasterList = window.wemb?.pageTreeDataManager?.treeData || [];
        if (modal.pageInfoProperties) {
          modal.pageInfoProperties.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
          });
          modal.pageInfoProperties.name = '';
        }
        modal.active = true;
        modal.$modal.show('createPageModal');
      }
      await new Promise(r => modal.$nextTick(r));
    }, type);
    const attached = await page.locator('#pageName, #pageName2').first()
      .waitFor({ state: 'attached', timeout: 5000 })
      .then(() => true).catch(() => false);
    if (attached) break;
    await page.waitForTimeout(300);
  }

  // 2. input 기준으로 모달 준비 확인 (vue-js-modal transition 중 opacity:0이어도 attached는 true)
  // page/master: #pageName, group: #pageName2 (CreatePageModal.vue v-if/v-else 분기)
  const nameInput = page.locator('#pageName, #pageName2').first();
  await nameInput.waitFor({ state: 'attached', timeout: 5000 });

  // 3. Mobile Master 체크 (master 타입일 때만)
  if (type === 'master' && mobile) {
    const mobileCheckbox = page.locator('label.el-checkbox').filter({ hasText: /Mobile\s*Master/i }).first();
    const isChecked = await mobileCheckbox.locator('input').isChecked();
    if (!isChecked) {
      await mobileCheckbox.click({ force: true });
    }
    await page.waitForTimeout(200);
  }

  // 4. 이름 입력 — force:true로 CSS visibility 체크 우회
  await nameInput.fill(name, { force: true });

  // 5. 생성 버튼 클릭
  const createBtn = page.locator('button').filter({ hasText: /생성|Create|OK/i }).last();
  await createBtn.click({ force: true });

  // 6. 모달 닫힘 대기 — input이 DOM에서 제거되면 닫힌 것으로 판단
  await nameInput.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});

  // 6. 새 페이지 로딩 완료 대기
  // isLoaded === true는 이전 페이지 상태와 구분이 안 되므로, 새 페이지 ID 기반으로 대기.
  // treeData에 새 페이지가 등록된 후 waitForActiveEditorPage로 로딩 완료를 확인한다.
  await page.waitForFunction(
    (pageName) => (window.wemb?.pageTreeDataManager?.treeData || [])
      .some(item => item.text === pageName),
    name,
    { timeout: 15000 }
  ).catch(() => {});

  // const newPageId = await findPageIdByName(page, name);
  // if (newPageId) {
  //   await waitForActiveEditorPage(page, newPageId).catch(() => {});
  // }

    const newPageId = await findPageIdByName(page, name);
  if (newPageId && type !== 'group') {
    await waitForActiveEditorPage(page, newPageId).catch(() => {});
  }
}

/**
 * tc-page-3d 페이지를 열거나 생성하고, 완전히 로드될 때까지 대기한다.
 * isLoaded === true가 OpenPageCommand._completedLoadAllResource 완료 신호.
 */
async function ensureTestPage(page, pageName = 'tc-page-3d') {
  let pageId = await findPageIdByName(page, pageName);
  if (!pageId) {
    await createPageByType(page, { type: 'page', name: pageName });
    await page.waitForFunction(
      (name) =>
        (window.wemb?.pageTreeDataManager?.treeData || []).some(
          (item) => item.text === name && item.type === 'page'
        ),
      pageName,
      { timeout: 30_000 }
    );
    pageId = await findPageIdByName(page, pageName);

    await page
      .waitForFunction(
        (name) => window.wemb?.pageManager?.currentPageInfo?.name === name,
        pageName,
        { timeout: 30_000 }
      )
      .catch(() => {});

    await closeCreatePageModalIfVisible(page);
  }

  const alreadyOpen =
    pageId &&
    (await page.evaluate((id) => window.wemb?.pageManager?.currentPageInfo?.id === id, pageId));

  if (!alreadyOpen && pageId) {
    await page.evaluate(
      (id) => {
        window.wemb.editorFacade.sendNotification('command/openPage', id);
      },
      pageId
    );
  }

  // OpenPageCommand가 isLoaded = false로 전환할 시간 확보
  await page.waitForTimeout(500);

  await waitForActiveEditorPage(page, pageId);

  return pageId;
}

async function cleanupComponents(page, prefix) {
  await page.evaluate((namePrefix) => {
    const mainPageComponent = window.wemb?.mainPageComponent;
    if (!mainPageComponent) return;

    const matches = (mainPageComponent._comInstanceList || []).filter((instance) =>
      instance.name?.startsWith(namePrefix)
    );

    for (const instance of matches) {
      window.wemb.editorFacade.sendNotification('command/removeComponentInstance', instance);
    }
  }, prefix);

  await page.waitForFunction(
    (namePrefix) =>
      !((window.wemb?.mainPageComponent?._comInstanceList || []).some((instance) =>
        instance.name?.startsWith(namePrefix)
      )),
    prefix
  );
}

async function switchToTwoLayer(page) {
  await page.evaluate(() => {
    window.wemb.editorFacade.sendNotification('command/changeActvieLayer', 'twoLayer');
  });
  await page.waitForFunction(
    () => window.wemb?.mainPageComponent?.activeLayer?.name === '_twoLayer',
    { timeout: 15_000 }
  );
}

async function switchToThreeLayer(page) {
  await page.evaluate(() => {
    window.wemb.editorFacade.sendNotification('command/changeActvieLayer', 'threeLayer');
  });

  await page.waitForFunction(
    () => window.wemb?.mainPageComponent?.activeLayer?.name === '_threeLayer',
    { timeout: 15_000 }
  );
}

async function getActiveLayerName(page) {
  return page.evaluate(() => window.wemb?.mainPageComponent?.activeLayer?.name || null);
}

async function getSelectedLanguage(page) {
  const combo = page.locator('.langs select');
  await combo.waitFor({ state: 'attached' });
  return combo.inputValue();
}

/**
 * 우측 패널의 Properties 탭을 클릭하여 활성화하고, 패널 콘텐츠가 렌더링될 때까지 대기한다.
 * - 탭 셀렉터: #right-panel-wrap .el-tabs__item (text = "Properties")
 * - 패널 컨테이너: #component-property-panel (ComponentPropertyPanel.vue)
 */
async function openPropertiesPanel(page) {
  const propTab = page.locator('#right-panel-wrap .el-tabs__item')
    .filter({ hasText: 'Properties' })
    .first();
  if (await propTab.count() > 0) {
    await propTab.click();
  }
  await page.locator('#component-property-panel').waitFor({ state: 'visible', timeout: 10000 });
}

async function savePage(page, saveAsName = null) {
  if (saveAsName) {
    // '다른 이름으로 저장' 호출
    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/showSaveAsPageModal');
    });

    // evaluate 내 DOM click은 합성 이벤트라 Vue submit handler가 트리거되지 않으므로
    // Playwright locator의 fill() + click()으로 교체합니다.
    // SaveAs 모달: command/showSaveAsPageModal → $createPageModal.showSaveAsPage()
    // vue-js-modal 오버레이: data-modal="createPageModal", 박스: .v--modal-box[role="dialog"]
    const input = page.locator('#pageName, #pageName2').first();
    await input.waitFor({ state: 'attached', timeout: 10000 });
    await input.fill(saveAsName, { force: true });

    const saveBtn = page.locator('button')
      .filter({ hasText: /저장|생성|Create|Save|OK|확인/i })
      .last();
    await saveBtn.click({ force: true });
  } else {
    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/savePage');
    });
  }
  await page.waitForTimeout(2000);
}

async function addThreeBox(page, name, position) {
  await page.evaluate(
    ({ componentName, instanceName, setterPosition }) => {
      window.wemb.editorFacade.sendNotification('command/addComponentInstanceByName', {
        componentName,
        name: instanceName,
        initProperties: {
          props: {
            setter: {
              position: setterPosition,
            },
          },
        },
      });
    },
    {
      componentName: 'BoxComponent',
      instanceName: name,
      setterPosition: position,
    }
  );

  await page.waitForFunction(
    (instanceName) =>
      !!window.wemb?.pageManager?.currentPageInfo?.id &&
      !!window.wemb?.mainPageComponent?.getComInstanceByName?.(instanceName),
    name,
    { timeout: 20_000 }
  );
}

async function selectThreeComponents(page, names) {
  await page.evaluate((instanceNames) => {
    const first = window.wemb?.mainPageComponent?.getComInstanceByName?.(instanceNames[0]);
    const second = window.wemb?.mainPageComponent?.getComInstanceByName?.(instanceNames[1]);

    if (!first || !second) {
      throw new Error(`Target components not found: ${instanceNames.join(', ')}`);
    }

    window.wemb.editorFacade.sendNotification('command/newSelectedComponentInstance', first);
    window.wemb.editorFacade.sendNotification('command/addSelected', second);
  }, names);

  await page.waitForFunction((instanceNames) => {
    const selectedNames = (window.wemb?.mainPageComponent?._comInstanceList || [])
      .filter((instance) => instance.selected)
      .map((instance) => instance.name)
      .sort();

    return JSON.stringify(selectedNames) === JSON.stringify([...instanceNames].sort());
  }, names);
  await page.waitForTimeout(2_000);

  const hasTempGroup = await page.evaluate(
    () => !!window.wemb?.mainPageComponent?.threeLayer?._tempGroup
  );
  if (!hasTempGroup) {
    await page.evaluate((instanceNames) => {
      const threeLayer = window.wemb?.mainPageComponent?.threeLayer;
      const selected = (window.wemb?.mainPageComponent?._comInstanceList || []).filter(
        (instance) => instanceNames.includes(instance.name)
      );

      if (!threeLayer || selected.length < 2) {
        throw new Error(`Unable to create temp group for: ${instanceNames.join(', ')}`);
      }

      threeLayer._createTempGroup(selected);
    }, names);
  }
}

async function setThreeTransformMode(page, mode) {
  const buttonNameByMode = {
    translate: 'T',
    rotate: 'R',
    scale: 'S',
  };

  const buttonName = buttonNameByMode[mode];
  if (!buttonName) {
    throw new Error(`Unsupported transform mode: ${mode}`);
  }

  const button = page.getByRole('button', { name: buttonName, exact: true });
  await button.click();
  await page.waitForFunction(
    (expectedMode) =>
      window.wemb?.mainPageComponent?.threeLayer?._transformControls?.getMode?.() === expectedMode,
    mode
  );
}

async function moveSelectedByKeyboard(page, sequence, names = null) {
  await page.evaluate((steps) => {
    const getMoveInfo = ({ key, shiftKey }) => {
      if (key === 'ArrowRight') return { propertyName: 'x', step: shiftKey ? 5 : 1 };
      if (key === 'ArrowLeft') return { propertyName: 'x', step: shiftKey ? -5 : -1 };
      if (key === 'ArrowUp') return { propertyName: 'y', step: shiftKey ? 5 : 1 };
      if (key === 'ArrowDown') return { propertyName: 'y', step: shiftKey ? -5 : -1 };

      throw new Error(`Unsupported key movement: ${key}`);
    };

    for (const step of steps) {
      window.wemb.editorFacade.sendNotification(
        'command/moveSelectedComponentInstance',
        getMoveInfo(step)
      );
    }
  }, sequence);

  await page.waitForTimeout(500);
}

async function applyTempGroupTransform(page, type, value, names = null) {
  await page.evaluate(
    ({ transformType, transformValue }) => {
      const threeLayer = window.wemb?.mainPageComponent?.threeLayer;
      const tempGroup = threeLayer?._tempGroup;

      if (!threeLayer || !tempGroup) {
        throw new Error(`Temporary group is not ready for ${transformType}`);
      }

      if (transformType === 'rotate') {
        tempGroup.rotation.z += transformValue;
      }

      if (transformType === 'scale') {
        tempGroup.scale.set(transformValue.x, transformValue.y, transformValue.z);
      }

      tempGroup.updateMatrixWorld(true);
      threeLayer._onMouseUpTransformControl();
    },
    { transformType: type, transformValue: value }
  );

  await page.waitForFunction(() => !!window.wemb?.mainPageComponent?.threeLayer?._tempGroup);
}

async function getSelectedComponentStates(page, names = null, timeout = 2_000) {
  const targetNames = Array.isArray(names) ? names : names ? [names] : null;

  if (targetNames) {
    await page.waitForFunction(
      (instanceNames) => {
        const mainPageComponent = window.wemb?.mainPageComponent;
        const threeLayer = mainPageComponent?.threeLayer;
        const selectedInstances =
          window.wemb?.editorProxy?._selectProxy?.currentPropertyManager?.getInstanceList?.() || [];

        const findInstance = (instanceName) =>
          mainPageComponent?.getComInstanceByName?.(instanceName) ||
          mainPageComponent?.comInstanceList?.find?.((comp) => comp.name === instanceName) ||
          selectedInstances.find((comp) => comp.name === instanceName) ||
          threeLayer?._tempGroupComponents?.find?.((comp) => comp.name === instanceName);

        return instanceNames.every((instanceName) => {
          const instance = findInstance(instanceName);
          return !!(instance && instance.position && instance.rotation && instance.size);
        });
      },
      targetNames,
      { timeout }
    );
  }

  return page.evaluate((instanceNames) => {
    const readComponentStateSnapshot = (instance) => ({
      position: instance.position ? { ...instance.position } : null,
      rotation: instance.rotation ? { ...instance.rotation } : null,
      size: instance.size ? { ...instance.size } : null,
    });

    const mainPageComponent = window.wemb?.mainPageComponent;
    const threeLayer = mainPageComponent?.threeLayer;
    const selectedInstances =
      window.wemb?.editorProxy?._selectProxy?.currentPropertyManager?.getInstanceList?.() || [];
    const findInstance = (instanceName) =>
      mainPageComponent?.getComInstanceByName?.(instanceName) ||
      mainPageComponent?.comInstanceList?.find?.((comp) => comp.name === instanceName) ||
      selectedInstances.find((comp) => comp.name === instanceName) ||
      threeLayer?._tempGroupComponents?.find?.((comp) => comp.name === instanceName);

    if (instanceNames?.length) {
      return instanceNames.reduce((acc, instanceName) => {
        const instance = findInstance(instanceName);

        if (instance?.name) {
          acc[instance.name] = readComponentStateSnapshot(instance);
        }

        return acc;
      }, {});
    }

    const tempGroupInstances = threeLayer?._tempGroupComponents || [];
    const instancesByName = new Map();

    [...selectedInstances, ...tempGroupInstances].forEach((instance) => {
      if (instance?.name && !instancesByName.has(instance.name)) {
        instancesByName.set(instance.name, instance);
      }
    });

    return [...instancesByName.values()].reduce((acc, instance) => {
      acc[instance.name] = readComponentStateSnapshot(instance);
      return acc;
    }, {});
  }, targetNames);
}

/**
 * 이동 후 live instance 기준으로 상태를 읽는다.
 * getComInstanceByName을 항상 우선 사용해 stale ref 문제를 방지한다.
 */
async function getComponentState(page, name) {
  return page.evaluate((instanceName) => {
    const mainPageComponent = window.wemb?.mainPageComponent;
    const threeLayer = mainPageComponent?.threeLayer;
    const selectedInstances =
      window.wemb?.editorProxy?._selectProxy?.currentPropertyManager?.getInstanceList?.() || [];
    const inst =
      mainPageComponent?.getComInstanceByName?.(instanceName) ||
      mainPageComponent?.comInstanceList?.find?.((comp) => comp.name === instanceName) ||
      selectedInstances.find((comp) => comp.name === instanceName) ||
      threeLayer?._tempGroupComponents?.find?.((comp) => comp.name === instanceName);

    if (!inst) {
      throw new Error(`Component not found: ${instanceName}`);
    }

    return {
      position: inst.position ? { ...inst.position } : null,
      rotation: inst.rotation ? { ...inst.rotation } : null,
      size: inst.size ? { ...inst.size } : null,
    };
  }, name);
}

async function getThreeLayerState(page) {
  return page.evaluate(() => {
    const threeLayer = window.wemb?.mainPageComponent?.threeLayer;
    const transformControls = threeLayer?._transformControls;
    const tempGroup = threeLayer?._tempGroup;

    return {
      mode: transformControls?.getMode ? transformControls.getMode() : transformControls?.mode,
      tempGroupExists: !!tempGroup,
      tempGroupPosition: tempGroup
        ? { x: tempGroup.position.x, y: tempGroup.position.y, z: tempGroup.position.z }
        : null,
      tempGroupRotation: tempGroup
        ? { x: tempGroup.rotation.x, y: tempGroup.rotation.y, z: tempGroup.rotation.z }
        : null,
      tempGroupScale: tempGroup
        ? { x: tempGroup.scale.x, y: tempGroup.scale.y, z: tempGroup.scale.z }
        : null,
      tempGroupComponents: (threeLayer?._tempGroupComponents || []).map(
        (instance) => instance.name
      ),
    };
  });
}

module.exports = {
  addThreeBox,
  applyTempGroupTransform,
  cleanupComponents,
  closeCreatePageModalIfVisible,
  createPageByType,
  ensureEditorSession,
  ensureActivePage,
  ensureTestPage,
  getActiveLayerName,
  getComponentState,
  getSelectedLanguage,
  getSelectedComponentStates,
  getThreeLayerState,
  goToEditor,
  loginAsEditor,
  loginAsViewer,
  moveSelectedByKeyboard,
  openNewPageModal,
  openPropertiesPanel,
  rightClickTreeItem,
  selectContextMenu,
  savePage,
  selectThreeComponents,
  setEditorMode,
  setLoginCredentials,
  setThreeTransformMode,
  submitLogin,
  switchToThreeLayer,
  switchToTwoLayer,
  waitForActiveEditorPage,
  waitForComponents,
  waitForEditorReady,
};
