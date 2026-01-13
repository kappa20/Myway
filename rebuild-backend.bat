@echo off
REM Script to rebuild and push backend image to Docker Hub
REM Usage: rebuild-backend.bat

setlocal

set DOCKER_USERNAME=kappa20
set IMAGE_NAME=myway-backend
set TAG=latest

echo ================================
echo Rebuilding Backend Docker Image
echo ================================
echo.

echo Step 1/4: Building Docker image...
docker build -t %IMAGE_NAME%:%TAG% ./backend
if errorlevel 1 (
    echo Error: Docker build failed
    exit /b 1
)

echo.
echo Step 2/4: Tagging image for Docker Hub...
docker tag %IMAGE_NAME%:%TAG% %DOCKER_USERNAME%/%IMAGE_NAME%:%TAG%
if errorlevel 1 (
    echo Error: Docker tag failed
    exit /b 1
)

echo.
echo Step 3/4: Pushing to Docker Hub...
docker push %DOCKER_USERNAME%/%IMAGE_NAME%:%TAG%
if errorlevel 1 (
    echo Error: Docker push failed
    exit /b 1
)

echo.
echo Step 4/4: Cleaning up old images...
docker image prune -f

echo.
echo Success! Backend image pushed to Docker Hub
echo    Image: %DOCKER_USERNAME%/%IMAGE_NAME%:%TAG%
echo.
echo To run the updated image:
echo   docker pull %DOCKER_USERNAME%/%IMAGE_NAME%:%TAG%
echo.

endlocal
