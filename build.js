const fs = require('fs');
const path = require('path');

const articleDir = 'article';
const posts = [];

function classify(title, file) {
  const t = (title + ' ' + file).toLowerCase();
  if (/ctf|比赛|wp|writeup|buuctf|网鼎杯|长城杯|奇安信|sictf|suctf|新星赛|软件安全|ciscn|鹏城杯|腾龙杯|nssctf|刷题/.test(t)) return 'CTF';
  if (/sql|sqli|注入|xss|csrf|ssrf|文件上传|解析漏洞|webshell|安全狗|rce|hash扩展|短文件名|webdav|jsonp|同源策略|cors|浏览器解码|log4shell|phpmyadmin|redis|子域名|oneforall|mac.泛洪/.test(t)) return 'Web安全';
  if (/权限提升|提权|横向移动|域|ad域|内网|smb|dns欺骗|mac泛洪|渗透|红日|外联木马|ew-/.test(t)) return '内网渗透';
  if (/tryhackme|thm-|htb-|hackmyvm|vulnhub|靶场|蓝队/.test(t)) return '靶场实践';
  if (/java|pickle|python|c\+\+|sql-|算法|类\.md|反射|反序列化|动态代理|urldns/.test(t)) return '编程语言';
  if (/操作系统|计算机组成|计算机网络|ospf|tcp|docker|android|app|activity|service|ui设计|hexo|picgo|agent|snort|数学基础|实习面经/.test(t)) return '技术笔记';
  return '其他';
}

for (const f of fs.readdirSync(articleDir)) {
  if (!f.endsWith('.md')) continue;
  const content = fs.readFileSync(path.join(articleDir, f), 'utf-8');

  const meta = {};
  let bodyStart = 0;
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3);
    if (end !== -1) {
      content.slice(3, end).trim().split('\n').forEach(line => {
        const idx = line.indexOf(':');
        if (idx !== -1) {
          const k = line.slice(0, idx).trim();
          const v = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
          meta[k] = v;
        }
      });
      bodyStart = end + 3;
    }
  }

  const body = content.slice(bodyStart);
  var cover = '';
  var imgRe = /!\[.*?\]\(([^)]+)\)/g;
  var m;
  while ((m = imgRe.exec(body)) !== null) {
    var url = m[1].trim();
    if (!url || url === '/' || url.startsWith('data:')) continue;
    if (url.startsWith('http')) { cover = url; break; }
    cover = 'article/' + url.replace(/^\//, '');
    break;
  }

  const dateMatch = f.match(/^(\d{4}[-/]\d{1,2}[-/]\d{1,2})/);
  const date = meta.date || (dateMatch ? dateMatch[1] : '');
  const title = meta.title || f.replace('.md', '');
  const description = (meta.description || '').slice(0, 200);
  const category = meta.category || classify(title, f);

  posts.push({ file: f, title, date, description, category, cover });
}

posts.sort((a, b) => b.date.localeCompare(a.date));

fs.writeFileSync('index.json', JSON.stringify(posts, null, 2), 'utf-8');
console.log(`Generated index.json with ${posts.length} posts`);
const cats = {};
posts.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
console.log('Categories:', cats);
console.log('With cover:', posts.filter(p => p.cover).length);
