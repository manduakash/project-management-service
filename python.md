python -m venv venv
source venv/Scripts/activate
# pip install fastapi uvicorn insightface opencv-python python-multipart onnxruntime numpy
pip install -r ./python/requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port 8000


for production:

pm2 start /var/www/html/python/venv/bin/python \
  --name insightface \
  --cwd /var/www/html/python \
  -- -m uvicorn app:app --host 0.0.0.0 --port 8000