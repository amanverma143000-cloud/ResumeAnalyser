@echo off
echo Resume Analyzer - System Diagnostic
echo =====================================
echo.

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js v16 or higher.
    goto :end
)
echo.

echo Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    goto :end
)
echo.

echo Checking MongoDB service...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB service found
    sc query MongoDB | findstr "STATE"
) else (
    echo WARNING: MongoDB service not found. Make sure MongoDB is installed and running.
)
echo.

echo Checking port availability...
netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 5000 is in use
    netstat -ano | findstr :5000
) else (
    echo Port 5000 is available
)

netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 3000 is in use
    netstat -ano | findstr :3000
) else (
    echo Port 3000 is available
)
echo.

echo Checking backend dependencies...
cd backend
if exist node_modules (
    echo Backend dependencies installed
) else (
    echo WARNING: Backend dependencies not installed. Run 'npm install' in backend folder.
)

echo Checking frontend dependencies...
cd ..\frontend
if exist node_modules (
    echo Frontend dependencies installed
) else (
    echo WARNING: Frontend dependencies not installed. Run 'npm install' in frontend folder.
)

:end
echo.
echo Diagnostic complete.
pause