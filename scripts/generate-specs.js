const fs = require('fs');
const path = require('path');

const fixturePath = process.argv[2] || path.join(__dirname, '../tests/fixtures/tc-common-login.json');
const targetModule = process.argv[3] || 'common'; // e.g. "page"
const testDir = path.join(__dirname, `../tests/qa-integrated/${targetModule}`);

function generateSpecs() {
  const tcs = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  // Group by epic dynamically
  const specs = {};

  tcs.forEach(tc => {
    // Some epics might contain spaces. We normalize to lowercase camelCase or just simple lowercase token.
    let category = String(tc.epic).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!specs[category]) {
      specs[category] = [];
    }
    specs[category].push(tc);
  });

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Define how 'O' vs 'X' is handled
  for (const [category, cases] of Object.entries(specs)) {
    let content = `const { test, expect } = require('@playwright/test');\n`;
    content += `const { loginAsEditor, ensureTestPage, waitForEditorReady } = require('../../helpers/renobit'); // Adjust helper paths as needed\n\n`;

    content += `test.describe('${category.toUpperCase()} Module Tests', () => {\n`;
    // Add BeforeEach
    content += `  // TODO: Add beforeEach if needed (e.g., test.beforeEach(async ({ page }) => { ... }))\n\n`;

    cases.forEach(tc => {
      const isSkip = !tc.isPlaywrightPossible;
      const skipStr = isSkip ? '.skip' : '';
      
      const tagStr = ` { @QA @${tc.epic} @${tc.tcId} }`;

      content += `  test${skipStr}('[${tc.tcId}] ${tc.epic} - ${tc.subFeature} - ${tc.title}${tagStr}', async ({ page }) => {\n`;
      content += `    /**\n`;
      content += `     * [Precondition]: ${tc.precondition}\n`;
      content += `     * [Test Steps]: ${tc.testSteps}\n`;
      content += `     * [Expected Result]: ${tc.expectedResult}\n`;
      content += `     * [Automation Note]: ${tc.automationNote}\n`;
      content += `     */\n`;
      
      if (isSkip) {
        content += `    // Test is marked as Playwright impossible. ${tc.automationNote}\n`;
      } else {
        content += `    // TODO: Implement test logic here\n`;
      }
      content += `  });\n\n`;
    });

    content += `});\n`;

    const filePath = path.join(testDir, `${category}.spec.js`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Generated ${filePath}`);
  }
}

generateSpecs();
