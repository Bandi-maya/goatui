const fs = require('fs');
const path = require('path');

const docsComponentsDir = path.join(__dirname, '..', 'app', '(docs)', 'components');
const uiComponentsDir = path.join(__dirname, '..', 'components', 'ui');

if (!fs.existsSync(uiComponentsDir)) {
  fs.mkdirSync(uiComponentsDir, { recursive: true });
}

// Find all directories in docsComponentsDir
const dirs = fs.readdirSync(docsComponentsDir).filter(f => {
  return fs.statSync(path.join(docsComponentsDir, f)).isDirectory();
});

console.log(`Found ${dirs.length} component directories.`);

let createdCount = 0;

for (const dir of dirs) {
  const pagePath = path.join(docsComponentsDir, dir, 'page.tsx');
  if (!fs.existsSync(pagePath)) continue;

  const content = fs.readFileSync(pagePath, 'utf8');
  
  // Look for import pattern like:
  // import { ComponentName } from "@/components/ui/component-name"
  const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*["']@\/components\/ui\/([^"']+)["']/);
  
  if (importMatch) {
    const componentNamesRaw = importMatch[1];
    const componentPath = importMatch[2]; // e.g. "3d-card"
    
    // Split multiple component names if any
    const componentNames = componentNamesRaw.split(',').map(name => name.trim()).filter(Boolean);
    
    const targetFilePath = path.join(uiComponentsDir, `${componentPath}.tsx`);
    
    if (!fs.existsSync(targetFilePath)) {
      // Create file!
      let code = `"use client"\n\nimport * as React from "react"\nimport { Terminal } from "lucide-react"\n\n`;
      
      for (const name of componentNames) {
        if (name.includes('Variant') || name.startsWith('use') || name.toLowerCase() === name || name.endsWith('Variants')) {
          code += `export const ${name} = {};\n\n`;
        } else {
          code += `export function ${name}() {\n`;
          code += `  return (\n`;
          code += `    <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-soft space-y-4">\n`;
          code += `      <div className="flex items-center justify-between">\n`;
          code += `        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Component Viewport</span>\n`;
          code += `        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">Live</span>\n`;
          code += `      </div>\n`;
          code += `      <div className="flex items-center gap-3">\n`;
          code += `        <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">\n`;
          code += `          <Terminal className="h-5 w-5" />\n`;
          code += `        </div>\n`;
          code += `        <div className="text-left">\n`;
          code += `          <h4 className="text-xs font-bold text-foreground">${name}</h4>\n`;
          code += `          <p className="text-[10px] text-muted-foreground mt-0.5">Mock implementation rendering successfully.</p>\n`;
          code += `        </div>\n`;
          code += `      </div>\n`;
          code += `    </div>\n`;
          code += `  )\n`;
          code += `}\n\n`;
        }
      }
      
      fs.writeFileSync(targetFilePath, code, 'utf8');
      createdCount++;
    }
  } else {
    // Check if it's imported with a default import, e.g. import ActionDialog from "@/components/ui/action-dialog"
    const defaultImportMatch = content.match(/import\s+(\w+)\s+from\s*["']@\/components\/ui\/([^"']+)["']/);
    if (defaultImportMatch) {
      const name = defaultImportMatch[1];
      const componentPath = defaultImportMatch[2];
      
      const targetFilePath = path.join(uiComponentsDir, `${componentPath}.tsx`);
      if (!fs.existsSync(targetFilePath)) {
        let code = `"use client"\n\nimport * as React from "react"\nimport { Terminal } from "lucide-react"\n\n`;
        code += `export default function ${name}() {\n`;
        code += `  return (\n`;
        code += `    <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-soft space-y-4">\n`;
        code += `      <div className="flex items-center justify-between">\n`;
        code += `        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Component Viewport</span>\n`;
        code += `        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">Live</span>\n`;
        code += `      </div>\n`;
        code += `      <div className="flex items-center gap-3">\n`;
        code += `        <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">\n`;
        code += `          <Terminal className="h-5 w-5" />\n`;
        code += `        </div>\n`;
        code += `        <div className="text-left">\n`;
        code += `          <h4 className="text-xs font-bold text-foreground">${name}</h4>\n`;
        code += `          <p className="text-[10px] text-muted-foreground mt-0.5">Mock implementation rendering successfully.</p>\n`;
        code += `        </div>\n`;
        code += `      </div>\n`;
        code += `    </div>\n`;
        code += `  )\n`;
        code += `}\n`;
        
        fs.writeFileSync(targetFilePath, code, 'utf8');
        createdCount++;
      }
    }
  }
}

console.log(`Successfully generated ${createdCount} component files.`);
