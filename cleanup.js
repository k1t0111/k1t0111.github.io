const fs = require('fs');
const path = require('path');

const articleDir = './article';
const rootDir = '.';

// Get all markdown files that were likely generated into HTML
const mdFiles = fs.readdirSync(articleDir).filter(file => file.endsWith('.md'));

console.log(`Cleaning up old HTML files from root...`);
let count = 0;

mdFiles.forEach(file => {
    // Check if it's a page or post. If it's a page (like about.md), we usually keep it in root.
    // But to be safe in cleanup, we can check content or just simplistic logic:
    // This script is to remove files that are NOW going to be in posts/
    // So we should remove corresponding html from root IF it's not a page type.
    // However, reading every file again is slow. checking if it exists in root and deleting it is easier.
    
    // Exception: about.md -> about.html (keep in root)
    if (file === 'about.md') return; 

    const htmlFile = file.replace('.md', '.html');
    const htmlPath = path.join(rootDir, htmlFile);

    if (fs.existsSync(htmlPath)) {
        fs.unlinkSync(htmlPath);
        console.log(`Deleted: ${htmlFile}`);
        count++;
    }
});

console.log(`Cleanup complete. Deleted ${count} files.`);
