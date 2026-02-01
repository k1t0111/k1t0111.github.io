const fs = require('fs');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');
const prettier = require('prettier');

// Configuration
const config = {
    articleDir: './article',
    postsDir: './posts',
    outputDir: '.',
    templatePath: './template.html',
};

// Utils
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// Parser Map for Prettier
const parserMap = {
    'js': 'babel',
    'javascript': 'babel',
    'json': 'json',
    'css': 'css',
    'html': 'html',
    'java': 'java',
    'php': 'php',
    'c': 'bg' // No C parser in default prettier? c is not standard. Clang-format is better.
    // We skip C/C++ via prettier for now, logic below handles basics.
};

async function formatCode(code, lang) {
    if (!lang) return code;
    lang = lang.toLowerCase();

    // 1. RECOVERY HEURISTIC: Fix Broken One-Liners
    // If code is long (>100 chars) and has few lines (<3), it's likely broken.
    const cleanCode = code.trim();
    if (cleanCode.length > 100 && cleanCode.split('\n').length < 5) {
        
        // Strategy A: Split on 4+ spaces (Common artifact)
        let recovered = cleanCode.replace(/[ ]{4,}/g, '\n');

        // Strategy B: Keyword based recovery (Python/Java)
        recovered = recovered
            // Python Keywords
            .replace(/(?<!\n)(def |class |if |else:|elif |return |print\(|try:|except:|finally:|import |from )/g, '\n$1')
            // Java/C Keywords
            .replace(/(?<!\n)(public |private |protected |class |interface |package |import |void |int |String |boolean )/g, '\n$1')
            // Annotations
            .replace(/(@\w+)/g, '\n$1')
            // Braces/Semi-colons (Java/C)
            .replace(/;(\S)/g, ';\n$1')
            .replace(/\{(\S)/g, '{\n$1')
            .replace(/\}(\S)/g, '}\n$1');

        if (recovered !== cleanCode) {
            code = recovered; // Apply recovery
        }
    }

    // 2. PRETTIER FORMATTING
    let parser = parserMap[lang];
    
    // Map 'java' to plugin
    // Note: prettier-plugin-java needs to be loaded. 'java' parser is provded by it.
    
    // Basic mapping check
    if (lang === 'java' || lang === 'php') {
        // parser is correct ('java', 'php')
    } else if (!parser) {
        return code; // Skip unsupported
    }
    
    try {
        const formatted = await prettier.format(code, {
            parser: parser,
            plugins: [
                require.resolve('@prettier/plugin-php'),
                require.resolve('prettier-plugin-java')
            ],
            tabWidth: 4,
            useTabs: false,
            printWidth: 100, // Wrap at 100
        });
        return formatted.trim(); // Remove extra newline at end Prettier adds
    } catch (e) {
        // console.log(`Format warning (${lang}):`, e.message.split('\n')[0]);
        return code;
    }
}

// Async Replace Helper
async function replaceAsync(str, regex, asyncFn) {
    const promises = [];
    str.replace(regex, (match, ...args) => {
        promises.push(asyncFn(match, ...args));
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}

// Ensure posts directory exists
if (!fs.existsSync(config.postsDir)) {
    fs.mkdirSync(config.postsDir);
}

// Global Variables
let allArticles = [];
let categoryTree = {};

// Main Build Function
async function build() {
    console.log('启动 OA 系统构建流程...');

    // 1. Scan and parse all files first
    const files = fs.readdirSync(config.articleDir).filter(file => file.endsWith('.md'));

    // USE FOR ... OF LINK FOR ASYNC
    for (const file of files) {
        try {
            const filePath = path.join(config.articleDir, file);
            let fileContent = fs.readFileSync(filePath, 'utf8');

            // CLEANUP
            fileContent = fileContent.replace(/(#+)\s+\[\]\(#.*?\s+".*?"\)/g, '$1 ');

            let { attributes, body } = frontMatter(fileContent);

            // AUTO FORMAT CODE BLOCKS
            // Find ```lang ... ``` blocks and format them
            body = await replaceAsync(body, /```(\w+)?\n([\s\S]*?)```/g, async (match, lang, code) => {
                 // Format code content
                 const formatted = await formatCode(code, lang);
                 return `\`\`\`${lang || ''}\n${formatted}\n\`\`\``;
            });

            const isPage = attributes.type === 'page';
            const slug = file.replace('.md', '.html');
            const link = isPage ? `/${slug}` : `/posts/${slug}`;
            
            // Determine Category
            let category = attributes.category || attributes.folder;

            if (!category) {
                // Infer from title (e.g. "Java-Basic" -> "Java", "CTF 101" -> "CTF")
                const title = attributes.title || file.replace('.md', '');
                
                // Common delimiters in existing filenames: '-', ' ', ':'
                const separators = ['-', ' ', '：', ':'];
                for (const sep of separators) {
                    if (title.includes(sep)) {
                        const part = title.split(sep)[0].trim();
                        // Filter out "2024", "2025" if title starts with date (common in these filenames if title wasn't parsed right)
                        if (part && !/^\d{4}$/.test(part) && part.length < 15) {
                            category = part;
                            break;
                        }
                    }
                }

                // Keyword fallback
                if (!category) {
                    const lowerTitle = title.toLowerCase();
                    if (lowerTitle.includes('ctf')) category = 'CTF';
                    else if (lowerTitle.includes('sql')) category = 'SQL';
                    else if (lowerTitle.includes('java')) category = 'JAVA';
                    else if (lowerTitle.includes('android')) category = 'Android';
                    else if (lowerTitle.includes('docker')) category = 'Docker';
                    else if (lowerTitle.includes('内网')) category = '内网安全';
                    else if (lowerTitle.includes('操作系统')) category = '操作系统';
                    else if (lowerTitle.includes('漏洞')) category = '漏洞复现';
                    else category = '综合归档';
                }
            }

            // Normalization
            category = category.toUpperCase(); // Merge "sql" and "SQL"

            const articleData = {
                title: attributes.title || file.replace('.md', ''),
                date: attributes.date,
                category: category,
                description: attributes.description || '',
                link: link,
                body: body, // Store body for search index generation (optional, text only)
                isPage: isPage,
                slug: slug,
                htmlContent: marked.parse(body) // Pre-render markdown
            };

            allArticles.push(articleData);

            // Add to Tree (skip pages for sidebar usually, or keep separate)
            if (!isPage && !attributes.hidden) {
                if (!categoryTree[category]) {
                    categoryTree[category] = [];
                }
                categoryTree[category].push(articleData);
            }

        } catch (error) {
            console.error(`Parsing error ${file}:`, error.message);
        }
    } // End Loop (was forEach)

    // Sort articles by date (newest first)
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Sort categories (just keys)
    const sortedCategories = Object.keys(categoryTree).sort().reverse(); 

    // 2. Generate Search Index (search.json)
    const searchIndex = allArticles.map(a => ({
        title: a.title,
        link: a.link,
        category: a.category,
        date: formatDate(a.date),
        content: a.description // Keeping index small for now. switch to a.body for full text
    }));
    fs.writeFileSync('search.json', JSON.stringify(searchIndex));
    console.log('Search Index Generated.');

    // 3. Generate Sidebar HTML
    let sidebarHtml = `<div class="nav-group">
        <div class="nav-header">知识库</div>`;
    
    // Sort categories, "其他" last
    sortedCategories.forEach(cat => {
        // Clean display name
        const displayName = cat.replace('年', '-').replace('月', '');

        // Just output header, no Emoji for folder
        sidebarHtml += `
            <details class="folder-group">
                <summary>${cat}</summary>
                <div class="folder-content">
        `;
        categoryTree[cat].forEach(post => {
            sidebarHtml += `
                <a href="${post.link}" class="nav-item">${post.title}</a>
            `;
        });
        sidebarHtml += `</div></details>`;
    });
    sidebarHtml += `</div>`;

    // 4. Generate Pages
    const template = fs.readFileSync(config.templatePath, 'utf8');

    allArticles.forEach(article => {
        // Output Path
        let outputPath;
        if (article.isPage) {
            outputPath = path.join(config.outputDir, article.slug);
        } else {
            outputPath = path.join(config.postsDir, article.slug);
        }

        // Clean link for matching
        const cleanLink = article.link.replace(/^\//, ''); // Remove leading slash for easier checking

        const fullPage = template
            .replace(/{{title}}/g, article.title)
            .replace(/{{sidebar}}/g, sidebarHtml)
            .replace(/{{content}}/g, article.htmlContent)
            .replace(/{{category}}/g, article.category)
            .replace(/{{date}}/g, formatDate(article.date))
            .replace(/{{page_class}}/g, 'article-mode') // Set class for articles
            // Simple logic to open the right folder in sidebar
            // We can do this better with client side JS, but string replacement helps for static
            // We will just leave it standard for now, client JS will handle "active" state
            .replace(/{{active_link}}/g, article.link); 

        fs.writeFileSync(outputPath, fullPage);
    });

    // 5. Generate Dashboard (Index.html)
    // "Hacker/Terminal" Dashboard Layout
    
    // Quick Links
    const quickLinks = sortedCategories.slice(0, 4).map(cat => ({
        title: cat,
        count: categoryTree[cat].length
    }));

    const lastUpdate = formatDate(new Date());

    const dashboardStats = `
    <div class="dashboard-container" style="color: #ccc;">
        <!-- Terminal Header -->
        <div style="margin-bottom: 2rem; border-bottom: 1px dashed #333; padding-bottom: 1rem;">
            <h1 style="font-family: monospace; color: #00ff41; margin: 0;">> WHOAMI</h1>
            <p style="color: #ccc; margin: 0.5rem 0 0 0;">ROOT USER: 安全员小周</p>
            <p style="color: #666; margin: 0;">SYSTEM UPTIME: ${lastUpdate}</p>
        </div>

        <!-- System Stats Grid -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:2rem;">
            <div style="border: 1px solid #333; padding: 1rem; background: #1a1a1a;">
                <div style="color: #666; font-size: 0.8rem;">TOTAL_FILES</div>
                <div style="color: #fff; font-size: 1.5rem; font-weight: bold;">${allArticles.filter(x=>!x.isPage).length}</div>
            </div>
            <div style="border: 1px solid #333; padding: 1rem; background: #1a1a1a;">
                 <div style="color: #666; font-size: 0.8rem;">DIRECTORIES</div>
                <div style="color: #00ff41; font-size: 1.5rem; font-weight: bold;">${Object.keys(categoryTree).length}</div>
            </div>
            <div style="border: 1px solid #333; padding: 1rem; background: #1a1a1a;">
                 <div style="color: #666; font-size: 0.8rem;">STATUS</div>
                <div style="color: #00ff41; font-size: 1.5rem; font-weight: bold;">CONNECTED</div>
            </div>
        </div>

        <!-- Latest Dumps -->
        <h3 style="color: #fff; border-bottom: 1px solid #333; padding-bottom: 0.5rem;">> LATEST_LOGS</h3>
        <div style="font-family: monospace; margin-top: 1rem;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="text-align: left; color: #666;">
                        <th style="padding: 0.5rem; border-bottom: 1px solid #333;">PERMISSION</th>
                        <th style="padding: 0.5rem; border-bottom: 1px solid #333;">FILENAME</th>
                        <th style="padding: 0.5rem; border-bottom: 1px solid #333;">DATE</th>
                    </tr>
                </thead>
                <tbody>
                    ${allArticles.slice(0, 10).map(a => `
                    <tr style="border-bottom: 1px solid #111;">
                        <td style="padding: 0.5rem; color: #666;">-rw-r--r--</td>
                        <td style="padding: 0.5rem;">
                            <a href="${a.link}" style="color: #e0e0e0; text-decoration: none; padding: 2px 5px;">
                                ${a.title}
                            </a>
                        </td>
                        <td style="padding: 0.5rem; color: #00ff41;">${formatDate(a.date)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
    `;

    const indexPage = template
        .replace(/{{title}}/g, '控制台')
        .replace(/{{sidebar}}/g, sidebarHtml)
        .replace(/{{content}}/g, dashboardStats)
        .replace(/{{category}}/g, '控制台')
        .replace(/{{date}}/g, formatDate(new Date()))
        .replace(/{{page_class}}/g, 'dashboard-mode'); // Set class for dashboard

    fs.writeFileSync(path.join(config.outputDir, 'index.html'), indexPage);
    console.log('Index generated.');
    console.log('Build complete.');
}

build().catch(err => console.error(err));
