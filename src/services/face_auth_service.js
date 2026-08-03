import axios from "axios";
import FormData from "form-data";
import jwt from "jsonwebtoken";
import FaceAuthModel from "../models/face_auth_model.js";

const PYTHON_URL = process.env.FACE_SERVICE_URL || "http://127.0.0.1:8000";
const SIMILARITY_THRESHOLD = parseFloat(process.env.FACE_SIMILARITY_THRESHOLD || "0.6");

class FaceAuthService {

    static embeddingCache = [];
    static cacheLoadedAt = 0;
    static CACHE_TTL = 5 * 60 * 1000; // 5 Minutes

    /**
     * Cosine similarity between two float arrays
     */
    static #cosineSimilarity(a, b) {
        let dot = 0, normA = 0, normB = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
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
        const saved = await FaceAuthModel.saveEmbedding(ua_id, embedding);

        if (!saved) throw new Error("User not found or inactive.");

        return { message: "Face registered successfully." };
    }

    static async getCachedEmbeddings() {
        const now = Date.now();

        if (
            this.embeddingCache.length === 0 ||
            (now - this.cacheLoadedAt) > this.CACHE_TTL
        ) {
            const users = await FaceAuthModel.getAllEmbeddings();
            console.log("users", users)

            this.embeddingCache = users
                .map(user => {
                    let embedding = user.ua_face_embedding;

                    try {
                        if (typeof embedding === "string") {
                            embedding = JSON.parse(embedding);
                        }
                    } catch {
                        embedding = null;
                    }

                    return {
                        ...user,
                        embedding
                    };
                })
                .filter(user => Array.isArray(user.embedding));

            this.cacheLoadedAt = now;
        }

        return this.embeddingCache;
    }

    static clearEmbeddingCache() {
        this.embeddingCache = [];
        this.cacheLoadedAt = 0;
    }

    /**
     * Verify face → return same response structure as login API
     */
    static async verifyFace(fileBuffer, originalName, meta = {}) {
        const {
            latitude,
            longitude,
            ip_address,
            device_info
        } = meta;

        if (!fileBuffer) {
            throw new Error("Image file is required.");
        }

        // Generate embedding
        const incomingEmbedding = await this.#getEmbedding(
            fileBuffer,
            originalName
        );

        // Cached embeddings
        const users = await this.getCachedEmbeddings();

        if (!users.length) {
            throw new Error("No registered faces found.");
        }

        let bestUser = null;
        let bestScore = -1;

        // Faster loop
        for (let i = 0; i < users.length; i++) {
            const score = this.#cosineSimilarity(
                incomingEmbedding,
                users[i].embedding
            );

            if (score > bestScore) {
                bestScore = score;
                bestUser = users[i];
            }
        }

        const score = Number(bestScore.toFixed(4));

        // Face not recognized
        if (!bestUser || score < SIMILARITY_THRESHOLD) {

            // Fire and forget
            FaceAuthModel.logLogin({
                ua_id: bestUser?.ua_id ?? null,
                latitude,
                longitude,
                match_score: score,
                ip_address,
                device_info,
                status: "failed",
                failed_reason: "Face not recognized — score below threshold."
            }).catch(console.error);

            throw new Error(
                "Face not recognized. Please try again or use password login."
            );
        }

        // Run both DB operations together
        const [fullUser, logResult] = await Promise.all([
            FaceAuthModel.getUserById(bestUser.ua_id),

            FaceAuthModel.upsertLoginLog({
                ua_id: bestUser.ua_id,
                latitude,
                longitude,
                match_score: score,
                ip_address,
                device_info,
                status: "success",
                failed_reason: null
            })
        ]);

        if (!fullUser) {
            throw new Error("User account not found.");
        }

        const payload = {
            UserID: fullUser.ua_id,
            Username: fullUser.ua_username,
            FullName: fullUser.ua_full_name,
            RoleID: fullUser.ua_role_id
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return {
            token,
            action: logResult.action,
            match_score: score,
            user: {
                email: fullUser.ua_email,
                contact_no: fullUser.ua_contact_no,
                profile_image: fullUser.ua_profile_picture,
                git_username: fullUser.ua_git_username,
                git_public_key: fullUser.ua_git_public_key,
                name: fullUser.ua_full_name,
                role_id: fullUser.ua_role_id,
                role: fullUser.role_name
            }
        };
    }



}

export default FaceAuthService;