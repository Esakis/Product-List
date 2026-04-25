@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
cd /d "%~dp0"

echo [product-list] Sprawdzam dostepnosc Docker Desktop...
docker info >nul 2>&1
if not errorlevel 1 goto docker_ready

echo [product-list] Docker Desktop nie odpowiada - probuje go uruchomic...
set "DOCKER_DESKTOP_EXE=%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
if not exist "%DOCKER_DESKTOP_EXE%" set "DOCKER_DESKTOP_EXE=%ProgramW6432%\Docker\Docker\Docker Desktop.exe"
if not exist "%DOCKER_DESKTOP_EXE%" set "DOCKER_DESKTOP_EXE=%LocalAppData%\Docker\Docker Desktop.exe"
if not exist "%DOCKER_DESKTOP_EXE%" (
    echo [product-list] BLAD: nie znalazlem pliku "Docker Desktop.exe".
    echo [product-list] Uruchom Docker Desktop recznie i odpal ten skrypt ponownie.
    pause
    exit /b 1
)
start "" "%DOCKER_DESKTOP_EXE%"
echo [product-list] Czekam na start silnika Docker Desktop (do 180 s)...
set "DOCKER_WAIT_RETRIES=90"
set "DOCKER_WAIT_COUNT=0"

:wait_docker_engine
timeout /t 2 /nobreak >nul
docker info >nul 2>&1
if not errorlevel 1 goto docker_ready
set /a DOCKER_WAIT_COUNT+=1
if %DOCKER_WAIT_COUNT% GEQ %DOCKER_WAIT_RETRIES% (
    echo [product-list] BLAD: Docker Desktop nie wystartowal w oczekiwanym czasie.
    pause
    exit /b 1
)
goto wait_docker_engine

:docker_ready
echo [product-list] Docker Desktop gotowy.

echo [product-list] Uruchamiam MSSQL w Dockerze (docker compose up -d)...
docker compose up -d
if errorlevel 1 (
    echo [product-list] BLAD: nie udalo sie uruchomic docker compose.
    pause
    exit /b 1
)

echo [product-list] Czekam na healthcheck kontenera product-list-mssql...
set "MSSQL_HEALTH_RETRIES=60"
set "MSSQL_HEALTH_WAITED=0"
:wait_mssql_health
for /f "delims=" %%S in ('docker inspect --format "{{.State.Health.Status}}" product-list-mssql 2^>nul') do set "MSSQL_HEALTH_STATUS=%%S"
if /I "%MSSQL_HEALTH_STATUS%"=="healthy" (
    echo [product-list] MSSQL healthy.
    goto mssql_ready
)
set /a MSSQL_HEALTH_WAITED+=1
if %MSSQL_HEALTH_WAITED% GEQ %MSSQL_HEALTH_RETRIES% (
    echo [product-list] BLAD: MSSQL nie osiagnal stanu healthy w oczekiwanym czasie (status: %MSSQL_HEALTH_STATUS%).
    pause
    exit /b 1
)
timeout /t 2 /nobreak >nul
goto wait_mssql_health
:mssql_ready

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
