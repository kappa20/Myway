@echo off
REM Script to rebuild and push both backend and frontend images to Docker Hub
REM Usage: rebuild-all.bat

setlocal

set DOCKER_USERNAME=kappa20

echo ========================================
echo Rebuilding All Docker Images for Myway
echo ========================================
echo.

REM Backend
echo Building Backend...
echo --------------------
docker build -t myway-backend:latest ./backend
if errorlevel 1 (
    echo Error: Backend build failed
    exit /b 1
)
docker tag myway-backend:latest %DOCKER_USERNAME%/myway-backend:latest
echo Backend built
echo.

REM Frontend
echo Building Frontend...
echo ---------------------
docker build -t myway-frontend:latest ./frontend
if errorlevel 1 (
    echo Error: Frontend build failed
    exit /b 1
)
docker tag myway-frontend:latest %DOCKER_USERNAME%/myway-frontend:latest
echo Frontend built
echo.

REM Push both
echo Pushing to Docker Hub...
echo --------------------------
docker push %DOCKER_USERNAME%/myway-backend:latest
if errorlevel 1 (
    echo Error: Backend push failed
    exit /b 1
)
echo Backend pushed
docker push %DOCKER_USERNAME%/myway-frontend:latest
if errorlevel 1 (
    echo Error: Frontend push failed
    exit /b 1
)
echo Frontend pushed
echo.

REM Cleanup
echo Cleaning up...
docker image prune -f
echo.

echo =========================================
echo Success! All images rebuilt and pushed!
echo =========================================
echo.
echo Images on Docker Hub:
echo   * %DOCKER_USERNAME%/myway-backend:latest
echo   * %DOCKER_USERNAME%/myway-frontend:latest
echo.
echo Next steps:
echo   1. Stop running containers: docker stop myway-frontend myway-backend
echo   2. Remove old containers: docker rm myway-frontend myway-backend
echo   3. Pull new images: docker pull %DOCKER_USERNAME%/myway-backend:latest
echo                       docker pull %DOCKER_USERNAME%/myway-frontend:latest
echo   4. Restart with: docker-compose up -d
echo.

endlocal
