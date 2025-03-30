#!/usr/bin/env bash
cd "scripts" || exit;
nohup ./startapi.sh > api.log &
./startfront.sh
