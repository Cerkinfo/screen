#!/usr/bin/env bash

FIRST_RUN=true;
cd "../website" || exit;
if [ -d "node_modules" ]; then
	if [ -d ".next" ]; then
		FIRST_RUN=false;
	fi
fi
if [ $FIRST_RUN ]; then
	sudo pnpx i pm2 -g;
	pnpm i;
	pnpm run build;
	pm2 start --name screenCI pnpm -- start;
	pm2 save
fi
# check pm2 state and reup
