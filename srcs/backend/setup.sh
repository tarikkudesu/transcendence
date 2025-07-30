#!/bin/sh

if [[ $ENVIREMENT == "production" ]]; then
	echo "Production"
	cd /app
	npm ci --omit-dev
	node ./dist/server.js
elif [[ $ENVIREMENT == "developement" ]]; then
	echo "Developement"
	cd /app
	npm install
	npm run dev
fi
