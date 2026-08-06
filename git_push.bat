@echo off
cd /d "c:\Users\Unnati\OneDrive\Desktop\final internship"
git add -A
git commit -m "Add Vercel and Render deployment configs; fix API URL for production"
git push origin main
echo Done!
