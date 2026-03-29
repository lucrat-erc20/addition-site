@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Update local with any new blogs, or changes
git pull origin main

REM Stage everything first
git add .

REM Get the most recently staged file
set "LATEST_FILE="
for /f "delims=" %%f in ('git diff --cached --name-only --diff-filter=ACMR ^| head -n 1') do (
    set "LATEST_FILE=%%f"
)

REM Fallback if nothing staged
if "!LATEST_FILE!"=="" (
    set "LATEST_FILE=changes"
)

echo ##########################
echo # Committing update for: !LATEST_FILE!
echo # The current time is: !TIME!
echo ##########################

git commit -m "updated !LATEST_FILE!"
git push

npm run build

echo The current time is: !TIME!
echo Committed update for: !LATEST_FILE!

endlocal