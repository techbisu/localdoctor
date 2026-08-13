const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Split into lines
  let lines = content.split('\n');
  let newLines = [];

  for (let line of lines) {
    // Skip if line is just whitespace or starts with import/export at beginning
    let trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('import ') || trimmed.startsWith('export ') || trimmed.startsWith('//')) {
      newLines.push(line);
      continue;
    }

    // For lines that are very long (likely still minified), try to split at statement boundaries
    // Add newline before: const, let, var, return, if, switch, try, catch, finally, throw, async function, function, interface, type, class, export default
    let pattern = /\s+(?=(const |let |var |return |if \(|if \(!|switch |try |catch |finally |throw |async function |function |interface |type |class |export default ))/g;
    let parts = line.split(pattern);
    
    // Better approach: use regex replace to add newlines
    let fixed = line;
    
    // Add newline before statement keywords (but not inside strings or JSX)
    // We need to be careful - let's use a simpler approach:
    // Replace "  const " with "\nconst " when it's not at start of line and not inside quotes
    
    const keywords = ['const ', 'let ', 'var ', 'return ', 'if (', 'if (!', 'switch ', 'try ', 'catch ', 'finally ', 'throw ', 'async function ', 'function ', 'interface ', 'type ', 'class ', 'export default '];
    
    for (const kw of keywords) {
      // Find occurrences not at start of line
      let idx = fixed.indexOf('  ' + kw);
      while (idx > 0) {
        // Check if we're inside a string by counting quotes before this position
        let before = fixed.substring(0, idx);
        let singleQuotes = (before.match(/'/g) || []).length;
        let doubleQuotes = (before.match(/"/g) || []).length;
        let backticks = (before.match(/`/g) || []).length;
        
        // Simple heuristic: if odd number of quotes, we might be inside a string
        // But this is not perfect. Let's use a different approach.
        
        // Check if the character before "  kw" is a quote or part of a string
        let charBefore = fixed[idx - 1];
        if (charBefore !== "'" && charBefore !== '"' && charBefore !== '`' && charBefore !== '\\') {
          fixed = fixed.substring(0, idx) + '\n' + kw + fixed.substring(idx + 2 + kw.length - kw.length);
          // Actually let's just replace "  kw" with "\nkw" 
          fixed = fixed.substring(0, idx) + '\n' + fixed.substring(idx + 2);
        }
        idx = fixed.indexOf('  ' + kw, idx + 1);
      }
    }
    
    newLines.push(fixed);
  }

  content = newLines.join('\n');
  fs.writeFileSync(filePath, content);
}

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      walkDir(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      fixFile(fullPath);
    }
  }
}

walkDir('./src');
console.log('Done.');
