#!/bin/bash
set -e
echo "Building GRAMAAI Landing Page..."
cd LandingPage1
echo "Installing dependencies..."
npm install --legacy-peer-deps
echo "Running build..."
npm run build
echo "Build completed successfully!"