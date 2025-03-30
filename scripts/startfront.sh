#!/usr/bin/env bash

FIRST_RUN=true;
cd "../client_ecran_CI" || exit;
if [ -d "node_modules" ]; then
	if [ -d ".next" ]; then
		FIRST_RUN=false;
	fi
fi
if [ $FIRST_RUN ]; then
	sudo npx i pm2 -g;
	npm i;
	npm run build;
	pm2 start --name screenCI npm -- start;
	pm2 save
fi
# check pm2 state and reup
