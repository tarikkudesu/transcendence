#!bin/sh

# ? developement
mkdir -p /debug

echo "backend script init" >> /debug/debug.log

cd /app
npm install
