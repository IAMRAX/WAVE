#!/bin/bash
npm install
mkdir -p public/scram public/epoxy public/baremux
cp -r node_modules/@mercuryworkshop/scramjet/dist/* public/scram/
cp -r node_modules/@mercuryworkshop/epoxy-transport/dist/* public/epoxy/
cp -r node_modules/@mercuryworkshop/bare-mux/dist/* public/baremux/
