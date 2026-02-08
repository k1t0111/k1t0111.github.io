const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');
const readline = require('readline');

const config = {
    articleDir: './article',
    categoriesPath: './categories.json'
};

function inferFromTitle(title) {
    if (!title) return '综合归档';
    const separators = ['-', ' ', '：', ':'];
    for (const sep of separators) {
        if (title.includes(sep)) {
            const part = title.split(sep)[0].trim();
            if (part && !/^\d{4}$/.test(part) && part.length < 15) return part;
        }
    }
    const lower = title.toLowerCase();
    if (lower.includes('ctf')) return 'CTF';
    if (lower.includes('sql')) return 'SQL';
    if (lower.includes('java')) return 'JAVA';
    return '综合归档';
}

function loadCategories() {
    try {
        if (fs.existsSync(config.categoriesPath)) {
            const raw = fs.readFileSync(config.categoriesPath, 'utf8');
            return JSON.parse(raw || '{}');
        }
    } catch (e) {
        console.warn('Warning: could not read categories.json:', e.message);
    }
    return {};
}

function saveCategories(map) {
    fs.writeFileSync(config.categoriesPath, JSON.stringify(map, null, 2), 'utf8');
}

async function run() {
    const files = fs.readdirSync(config.articleDir).filter(f => f.endsWith('.md'));
    const categories = loadCategories();

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    let idx = 0;

    const ask = (question) => new Promise(resolve => rl.question(question, resolve));

    for (const file of files) {
        idx++;
        const filePath = path.join(config.articleDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        let { attributes } = frontMatter(content);

        const key = file.replace('.md', '');
        const mapped = categories[key];
        const attrCat = attributes.category || attributes.folder;
        const inferred = inferFromTitle(attributes.title || key);

        const current = mapped || attrCat || inferred;

        console.log(`\n[${idx}/${files.length}] ${file}`);
        console.log(`  Current: ${current}${mapped ? ' (manual)' : attrCat ? ' (front-matter)' : ' (inferred)'}`);

        const ans = (await ask('  New category (enter to keep, `d` delete mapping, `q` quit): ')).trim();

        if (ans.toLowerCase() === 'q') {
            break;
        } else if (ans.toLowerCase() === 'd') {
            delete categories[key];
            console.log('  Deleted manual mapping.');
        } else if (ans === '') {
            // keep
        } else {
            categories[key] = ans;
            console.log('  Set to:', ans);
        }
    }

    rl.close();
    saveCategories(categories);
    console.log('\nCategories saved to', config.categoriesPath);
}

run().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
