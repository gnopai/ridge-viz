#@/bin/bash

# Build frontend
cd frontend
npm run build

# Copy build to Flask
rm -rf ../backend/static
cp -r dist ../backend/static

cd ../backend
python app.py
