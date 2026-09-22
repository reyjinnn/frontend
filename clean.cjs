const fs = require('fs');
const path = require('path');
const stripComments = require('strip-comments');

const srcDir = path.join(__dirname, 'src');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      if (filePath.match(/\.(ts|tsx|js|jsx)$/)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

const allFiles = getFiles(srcDir);
let changedCount = 0;

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  try {
    content = stripComments(content);
    content = content.replace(emojiRegex, '');
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      changedCount++;
      console.log('Cleaned:', filePath);
    }
  } catch (e) {
    console.error('Error processing:', filePath, e);
  }
}

console.log(`Done. Cleaned ${changedCount} files.`);
