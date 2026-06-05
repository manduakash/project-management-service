import axios from "axios";
import FormData from "form-data";
import jwt from "jsonwebtoken";
import FaceAuthModel from "../models/face_auth_model.js";

const PYTHON_URL       = process.env.FACE_SERVICE_URL || "http://127.0.0.1:8000";
const SIMILARITY_THRESHOLD = parseFloat(process.env.FACE_SIMILARITY_THRESHOLD || "0.6");

class FaceAuthService {

    /**
     * Cosine similarity between two float arrays
     */
    static #cosineSimilarity(a, b) {
        let dot = 0, normA = 0, normB = 0;
        for (let i = 0; i < a.length; i++) {
            dot   += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Send image buffer to Python InsightFace service → get embedding
     */
    static async #getEmbedding(fileBuffer, originalName) {
        const form = new FormData();
        form.append("file", fileBuffer, originalName || "face.jpg");

        const { data } = await axios.post(
            `${PYTHON_URL}/embedding`,
            form,
            { headers: form.getHeaders(), timeout: 15000 }
        );

        if (data.error) throw new Error(data.error);
        if (!data.embedding) throw new Error("No embedding returned from face service.");

        return data.embedding;
    }

    /**
     * Register face for a user
     * - Requires ua_id in body + image file
     */
    static async registerFace(ua_id, fileBuffer, originalName) {
        if (!ua_id) throw new Error("ua_id is required for face registration.");
        if (!fileBuffer) throw new Error("Image file is required.");

        const embedding = await this.#getEmbedding(fileBuffer, originalName);
        const saved     = await FaceAuthModel.saveEmbedding(ua_id, embedding);

        if (!saved) throw new Error("User not found or inactive.");

        return { message: "Face registered successfully." };
    }

    /**
     * Verify face → return same response structure as login API
     */
    static async verifyFace(fileBuffer, originalName) {
        if (!fileBuffer) throw new Error("Image file is required.");

        // Step 1: Get embedding of incoming face from Python service
        const incomingEmbedding = await this.#getEmbedding(fileBuffer, originalName);

        // Step 2: Fetch all stored embeddings from DB
        const users = await FaceAuthModel.getAllEmbeddings();

        if (users.length === 0)
            throw new Error("No registered faces found in database.");

        // Step 3: Cosine similarity — find best match
        let bestUser  = null;
        let bestScore = -1;

        for (const user of users) {
            let storedEmbedding = user.ua_face_embedding;

            // Parse if stored as string
            if (typeof storedEmbedding === "string") {
                storedEmbedding = JSON.parse(storedEmbedding);
            }

            if (!Array.isArray(storedEmbedding)) continue;

            const score = this.#cosineSimilarity(incomingEmbedding, storedEmbedding);
            if (score > bestScore) {
                bestScore = score;
                bestUser  = user;
            }
        }

        // Step 4: Threshold check
        if (!bestUser || bestScore < SIMILARITY_THRESHOLD) {
            throw new Error("Face not recognized. Please try again or use password login.");
        }

        // Step 5: Fetch full user details (role name etc.)
        const fullUser = await FaceAuthModel.getUserById(bestUser.ua_id);
        if (!fullUser) throw new Error("User account not found.");

        // Step 6: Build JWT payload — identical to login API
        const payload = {
            UserID:   fullUser.ua_id,
            Username: fullUser.ua_username,
            FullName: fullUser.ua_full_name,
            RoleID:   fullUser.ua_role_id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Step 7: Return same shape as login API
        return {
            token,
            match_score: parseFloat(bestScore.toFixed(4)),
            user: {
                email:          fullUser.ua_email,
                contact_no:     fullUser.ua_contact_no,
                profile_image:  fullUser.ua_profile_picture,
                git_username:   fullUser.ua_git_username,
                git_public_key: fullUser.ua_git_public_key,
                name:           fullUser.ua_full_name,
                role_id:        fullUser.ua_role_id,
                role:           fullUser.role_name,
            }
        };
    }

}

export default FaceAuthService;