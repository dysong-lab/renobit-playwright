const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const sourcePath = process.argv[2] || '/Users/dayoung/Downloads/RENOBIT_QA_통합/공통·로그인.html';
const destPath = process.argv[3] || path.join(__dirname, '../tests/fixtures/tc-common-login.json');

function parseTcs() {
  const html = fs.readFileSync(sourcePath, 'utf-8');
  const $ = cheerio.load(html);
  
  const extractedTcs = [];
  
  $('tr').each((i, row) => {
    const tds = $(row).find('td');
    
    // We expect at least 11 columns for a valid data row
    if (tds.length >= 11) {
      const playwrightFlag = $(tds[9]).text().trim();
      
      if (playwrightFlag === 'O' || playwrightFlag === 'X') {
        const tcInfo = {
          epic: $(tds[0]).text().trim(),
          subFeature: $(tds[1]).text().trim(),
          tcId: $(tds[2]).text().trim(),
          title: $(tds[3]).text().trim(),
          precondition: $(tds[4]).text().trim(),
          testSteps: $(tds[5]).text().trim(),
          expectedResult: $(tds[6]).text().trim(),
          status: $(tds[7]).text().trim(),
          isPlaywrightPossible: playwrightFlag === 'O',
          automationNote: $(tds[10]).text().trim()
        };
        extractedTcs.push(tcInfo);
      }
    }
  });
  
  // Ensure directory exists
  const targetDir = path.dirname(destPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(destPath, JSON.stringify(extractedTcs, null, 2), 'utf-8');
  console.log(`Parsed ${extractedTcs.length} TCs. Saved to ${destPath}`);
}

parseTcs();
