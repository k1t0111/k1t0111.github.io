import os, json, re

article_dir = "article"
posts = []

for f in os.listdir(article_dir):
    if not f.endswith(".md"):
        continue
    with open(os.path.join(article_dir, f), "r", encoding="utf-8") as fh:
        content = fh.read()

    meta = {}
    if content.startswith("---"):
        end = content.find("---", 3)
        if end != -1:
            for line in content[3:end].strip().split("\n"):
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip().strip('"').strip("'")

    date_match = re.match(r"(\d{4}[-/]\d{1,2}[-/]\d{1,2})", f)
    date = meta.get("date", date_match.group(1) if date_match else "")
    title = meta.get("title", f.replace(".md", ""))
    description = meta.get("description", "")
    category = meta.get("category", "")

    posts.append({
        "file": f,
        "title": title,
        "date": date,
        "description": description[:200] if description else "",
        "category": category,
    })

posts.sort(key=lambda x: x["date"], reverse=True)

with open("index.json", "w", encoding="utf-8") as out:
    json.dump(posts, out, ensure_ascii=False, indent=2)

print(f"Generated index.json with {len(posts)} posts")
