@echo off
rem 一键更新部署到 Cloudflare Pages
cd /d "%~dp0"
echo Deploying Scratch Pad to Cloudflare Pages...
call npx wrangler pages deploy . --project-name=scratch-pad --branch=main --commit-dirty
echo.
echo Done. Visit: https://scratch-pad.pages.dev
pause
