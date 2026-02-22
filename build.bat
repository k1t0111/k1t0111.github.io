@echo off
echo [1/3] Starting Build...
call npm run build

echo [2/3] Adding changes to Git...
git add .

echo [3/3] Committing and Pushing...
:: 检查是否有变动再 commit，防止报错
git diff-index --quiet HEAD -- || git commit -m "build: update about.html"
git push origin main

echo Build and Push success!
pause