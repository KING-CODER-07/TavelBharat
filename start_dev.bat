@echo off
echo ==============================================
echo      TravelBharat "Best" Dev Environment
echo ==============================================

echo Starting MongoDB Replica Set on port 27018...
start "TravelBharat MongoDB Server" cmd /k "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --port 27018 --bind_ip 127.0.0.1 --dbpath C:\temp\mongodb --replSet rs0

echo Waiting 5 seconds for MongoDB to initialize...
timeout /t 5 /nobreak > nul

echo Starting Next.js Dev Server...
start "TravelBharat Next.js App" cmd /k npm run dev

echo ==============================================
echo Everything is running! 
echo Keep both terminal windows open.
echo Access the app at: http://localhost:3000
echo ==============================================
pause
