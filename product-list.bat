@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

REM === Sprawdź, czy zależności Angulara są zainstalowane ===
if not exist "frontend\node_modules\@angular\core" (
    echo [product-list] Brak zaleznosci Angulara - uruchamiam "npm install"...
    pushd frontend
    call npm install
    if errorlevel 1 (
        echo [product-list] BLAD: "npm install" nie powiodl sie.
        popd
        exit /b 1
    )
    popd
) else (
    echo [product-list] Zaleznosci Angulara juz zainstalowane.
)

REM === Uruchom backend .NET 8 w osobnym oknie ===
echo [product-list] Uruchamiam backend .NET 8 (ProductList.Api)...
start "ProductList.Api" cmd /k "chcp 65001>nul && cd /d %~dp0backend\ProductList.Api && dotnet run"

REM === Uruchom frontend Angular 18 w osobnym oknie ===
echo [product-list] Uruchamiam frontend Angular 18 (ng serve)...
start "ProductList.Ui" cmd /k "chcp 65001>nul && cd /d %~dp0frontend && npm start"

endlocal
