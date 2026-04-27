const { test, expect } = require('@playwright/test');
const { goToEditor } = require('../../helpers/renobit');

test('Diagnostic: Dump All Sidebar Elements', async ({ page }) => {
  await goToEditor(page);
  // 에디터 로딩 충분히 대기
  await page.waitForTimeout(5000);
  
  // 가능한 모든 사이드바 셀렉터 시도
  const sidebarSelectors = ['.left-sidebar', '.left-panel', '.side-bar', '.panel-container'];
  let foundSelector = null;
  for (const sel of sidebarSelectors) {
    if (await page.locator(sel).count() > 0) {
      foundSelector = sel;
      break;
    }
  }
  
  console.log(`Found Sidebar Selector: ${foundSelector}`);

  const elements = await page.evaluate((sel) => {
    const sidebar = sel ? document.querySelector(sel) : document.body;
    const allBtns = Array.from(sidebar.querySelectorAll('button, a, i, span, div'))
      .filter(el => {
        const text = el.innerText.trim();
        const className = el.className || '';
        return /page|new|add|plus|신규|추가/i.test(text) || /page|new|add|plus|btn|icon/i.test(className);
      });
      
    return allBtns.slice(0, 50).map(el => ({
      tag: el.tagName,
      class: el.className,
      text: el.innerText.trim(),
      id: el.id,
      title: el.getAttribute('title') || '',
      rect: el.getBoundingClientRect()
    }));
  }, foundSelector);
  
  console.log('--- Candidate Interaction Elements ---');
  console.log(JSON.stringify(elements, null, 2));
  
  // 스크린샷 캡쳐 (디버깅용)
  await page.screenshot({ path: 'sidebar-diag.png' });
});
