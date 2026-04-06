async function loginAsEditor(page) {
  await page.goto('/renobit/login.do', { waitUntil: 'domcontentloaded' });

  await page.locator('#idInput').fill('admin');
  await page.locator('#pwInput').fill('didi0205');
  await page.locator('#Editor').check();
  await page.locator('button.new_btn').click();

  await page.waitForURL(/\/renobit\/visual\.do#\//, { timeout: 20_000 });

  // isLoaded가 true가 되면 OpenPageCommand의 _completedLoadAllResource까지 완료된 것
  await page.waitForFunction(
    () =>
      !!window.wemb?.mainPageComponent?.threeLayer &&
      window.wemb?.mainPageComponent?.isLoaded === true,
    { timeout: 60_000 }
  );
}

async function waitForEditorReady(page) {
  await page.waitForFunction(
    () =>
      !!window.wemb?.mainPageComponent?.threeLayer &&
      !!window.wemb?.$createPageModal &&
      window.wemb?.mainPageComponent?.isLoaded === true
  );
}

/**
 * storageState로 세션을 복원한 후 에디터 URL로 이동하고 완전히 준비될 때까지 대기.
 * loginAsEditor 대신 사용 (로그인 폼 제출 없이 세션 재사용).
 */
async function goToEditor(page) {
  await page.goto('/renobit/visual.do', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/\/renobit\/visual\.do#\//, { timeout: 20_000 });
  await waitForEditorReady(page);
}

async function waitForActiveEditorPage(page, pageId) {
  await page.waitForFunction(
    (id) => {
      return (
        window.wemb?.pageManager?.currentPageInfo?.id === id &&
        window.wemb?.editorProxy?._isOpenPage === true &&
        !!window.wemb?.mainPageComponent?.threeLayer &&
        window.wemb?.mainPageComponent?.isLoaded === true &&
        window.wemb?.mainPageComponent?.isLoading === false
      );
    },
    pageId,
    { timeout: 30_000 }
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
    // treeData 항목의 페이지명 필드는 'text' (name이 아님)
    const found = treeData.find((item) => item.text === name && item.type === 'page');
    return found?.id || null;
  }, pageName);
}

/**
 * tc-page-3d 페이지를 열거나 생성하고, 완전히 로드될 때까지 대기한다.
 * isLoaded === true가 OpenPageCommand._completedLoadAllResource 완료 신호.
 */
async function ensureTestPage(page, pageName = 'tc-page-3d') {
  let pageId = await findPageIdByName(page, pageName);
  if (!pageId) {
    await page.evaluate(() => {
      window.wemb.$createPageModal.showNewPage('page');
    });
    await page.waitForSelector('#createPageModal', { state: 'visible' });
    await page.fill('#pageName', pageName);
    await page.click('#createPageModal .el-button--primary');
// 모달에서 생성 버튼 클릭 후
  await page.waitForFunction(
    (name) => window.wemb?.pageManager?.currentPageInfo?.name === name,
    pageName
  );
  pageId = await page.evaluate(() => window.wemb?.pageManager?.currentPageInfo?.id);

    // await page.waitForFunction(
    //   () =>
    //     Array.isArray(window.wemb?.pageTreeDataManager?.treeData) &&
    //     window.wemb.pageTreeDataManager.treeData.length > 0
    // );

    // await page.waitForFunction(
    //   (name) =>
    //     (window.wemb?.pageTreeDataManager?.treeData || []).some(
    //       (item) => item.name === name && item.type === 'page'
    //     ),
    //   pageName
    // );

    // pageId = await findPageIdByName(page, pageName);
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
    () => window.wemb?.mainPageComponent?.activeLayer?.name === '_twoLayer'
  );
}

async function switchToThreeLayer(page) {
  await page.evaluate(() => {
    window.wemb.editorFacade.sendNotification('command/changeActvieLayer', 'threeLayer');
  });

  await page.waitForFunction(
    () => window.wemb?.mainPageComponent?.activeLayer?.name === '_threeLayer'
  );
}

async function savePage(page) {
  await page.evaluate(() => {
    window.wemb.editorFacade.sendNotification('command/savePage');
  });
  await page.waitForTimeout(2_000);
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
  ensureActivePage,
  ensureTestPage,
  getComponentState,
  getSelectedComponentStates,
  getThreeLayerState,
  goToEditor,
  loginAsEditor,
  moveSelectedByKeyboard,
  savePage,
  selectThreeComponents,
  setThreeTransformMode,
  switchToThreeLayer,
  switchToTwoLayer,
  waitForActiveEditorPage,
  waitForComponents,
  waitForEditorReady,
};
