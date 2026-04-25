@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
cd /d "%~dp0"

echo [product-list] Sprawdzam narzedzie globalne dotnet-ef...
dotnet tool list -g | findstr /I "dotnet-ef" >nul
if errorlevel 1 (
    echo [product-list] Brak dotnet-ef - instaluje globalnie...
    dotnet tool install --global dotnet-ef --version 8.0.10
    if errorlevel 1 (
        echo [product-list] BLAD: nie udalo sie zainstalowac dotnet-ef.
        pause
        exit /b 1
    )
) else (
    echo [product-list] dotnet-ef juz zainstalowany.
)

if not exist "frontend\node_modules\@angular\core" (
    echo [product-list] Brak zaleznosci Angulara - uruchamiam "npm install"...
    pushd frontend
    call npm install
    if errorlevel 1 (
        echo [product-list] BLAD: "npm install" nie powiodl sie.
        popd
        pause
        exit /b 1
    )
    popd
) else (
    echo [product-list] Zaleznosci Angulara juz zainstalowane.
)

echo [product-list] Uruchamiam backend .NET 8 (ProductList.Api)...
start "ProductList.Api" cmd /k "chcp 65001>nul && cd /d %~dp0backend\ProductList.Api && dotnet run"

echo [product-list] Uruchamiam frontend Angular 18 (ng serve)...
start "ProductList.Ui" cmd /k "chcp 65001>nul && cd /d %~dp0frontend && npm start"

echo [product-list] Gotowe. Backend i frontend startuja w osobnych oknach.
pause
endlocal
