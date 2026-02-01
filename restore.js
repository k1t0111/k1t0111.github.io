const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

// Custom rule for Hexo/Highlight.js code blocks
turndownService.addRule('hexoCodeBlock', {
    filter: function (node) {
        return node.nodeName === 'FIGURE' && node.classList.contains('highlight');
    },
    replacement: function (content, node) {
        const lang = node.className.replace('highlight', '').trim();
        const codeLines = [];
        
        // Extract code from the .code part
        const codeElement = node.querySelector('.code');
        if (codeElement) {
             const pre = codeElement.querySelector('pre');
             if(pre) {
                 // The text content often needs newline handling
                 // Hexo sometimes puts each line in a span, or just text with br
                 // We will try to get textContent but might need to join lines manually
                 // Simple approach:
                 return '\n```' + lang + '\n' + pre.textContent + '\n```\n';
             }
        }
        return content;
    }
});

const legacyDir = './backup_legacy';
const outputDir = './article';

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file === 'index.html') {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

console.log('Scanning for legacy files...');
const files = getAllFiles(legacyDir);
console.log(`Found ${files.length} HTML files.`);

let count = 0;

files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);
    
    // Check if it's a post
    const articleContent = $('#articleContent').html();
    
    if (articleContent) {
        const title = $('.post-title').text().trim();
        // Try to find date
        let date = '';
        const dateText = $('.post-date').first().text(); 
        // format usually "发布日期: 2024-01-26"
        const dateMatch = dateText.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
            date = dateMatch[1];
        }

        if (!title) return; // Skip if no title

        console.log(`Restoring: ${title}`);

        // Extract description (maybe first paragraph)
        let description = '';
        const firstP = $('#articleContent p').first().text();
        if(firstP) description = firstP.substring(0, 150).replace(/"/g, '\\"');

        try {
            const markdown = turndownService.turndown(articleContent);

            const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description}"
---

${markdown}
`;
            // Safe filename
            const safeTitle = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-');
            const fileName = `${date}-${safeTitle}.md`;
            
            fs.writeFileSync(path.join(outputDir, fileName), fileContent);
            count++;
        } catch (e) {
            console.error(`Failed to convert ${filePath}:`, e);
        }
    }
});

console.log(`Restored ${count} articles.`);
