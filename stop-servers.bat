@echo off
pushd %~dp0
echo Stopping all JSON Server processes and closing terminals...

:: Kill all json-server (node.exe) processes
taskkill /F /IM node.exe /T >nul 2>&1

:: Kill the extra cmd windows that were started with "start cmd /k"
taskkill /F /FI "WINDOWTITLE eq ELEVATEFIT_JSON_SERVER" /T >nul 2>&1

echo JSON Server stopped successfully !!
pause
