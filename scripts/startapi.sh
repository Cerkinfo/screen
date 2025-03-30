#!/usr/bin/env bash
FIRST_RUN=true;
cd "../api" || exit;
mkdir -p ./static/current_displayed_img;
mkdir -p ./static/uploaded_files;
if [ -d "./venv" ]; then
	if [ -d "./venv/bin" ]; then
		FIRST_RUN=false;
	fi
fi
if [ $FIRST_RUN ]; then
	mkdir -p "./venv";
	python3 -m venv venv;
fi
source venv/bin/activate
python3 -u main.py
