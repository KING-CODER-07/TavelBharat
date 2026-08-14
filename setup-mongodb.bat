@echo off
echo ========================================================
echo Converting MongoDB to a Replica Set (Requires Admin)
echo ========================================================

net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrator privileges confirmed.
) else (
    echo Failure: Please right-click this file and select "Run as Administrator".
    pause
    exit /b 1
)

echo.
echo Stopping MongoDB service...
net stop MongoDB

echo.
echo Updating MongoDB configuration...
set CFG_FILE="C:\Program Files\MongoDB\Server\8.0\bin\mongod.cfg"

findstr /C:"replSetName: rs0" %CFG_FILE% >nul 2>&1
if %errorLevel% == 0 (
    echo Replica set already configured in mongod.cfg.
) else (
    echo.>> %CFG_FILE%
    echo replication:>> %CFG_FILE%
    echo   replSetName: rs0>> %CFG_FILE%
    echo Configuration updated.
)

echo.
echo Starting MongoDB service...
net start MongoDB

echo.
echo Initializing the replica set...
timeout /t 5 /nobreak >nul
mongosh --eval "rs.initiate()"

echo.
echo Done! Your MongoDB is now a replica set.
echo You can close this window.
pause
