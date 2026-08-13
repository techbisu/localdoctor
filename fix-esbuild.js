const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

async function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const result = await esbuild.transform(content, {
      loader: filePath.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'esm',
      target: 'es2022',
      jsx: 'automatic',
    });
    fs.writeFileSync(filePath, result.code);
    console.log('Fixed:', filePath);
  } catch (e) {
    console.error('Failed:', filePath, e.message);
  }
}

async function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      await walkDir(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      await fixFile(fullPath);
    }
  }
}

walkDir('./src').then(() => console.log('Done.'));
