from fastapi import FastAPI, UploadFile, File
import insightface
import cv2
import numpy as np

app = FastAPI()

model = insightface.app.FaceAnalysis()
model.prepare(ctx_id=-1)

@app.post("/embedding")
async def embedding(file: UploadFile = File(...)):
    data = await file.read()

    image = cv2.imdecode(
        np.frombuffer(data, np.uint8),
        cv2.IMREAD_COLOR
    )

    faces = model.get(image)

    if len(faces) == 0:
        return {"error": "No face detected"}

    return {
        "embedding": faces[0].embedding.tolist()
    }
