import UserService from "../services/user_service.js";
import response from "../utils/response.js";

class UserController {
    static async updateProfile(req, res) {
        try {
            const {
                email,
                contactNumber,
                fullName,
                profilePicture,
                gitUsername,
                gitPublicKey,
                designations,
                biography
            } = req.body;

            const userId = req.user?.UserID || req.user?.UserId || req.user?.ua_id;

            if (!userId) {
                return response.error(res, "User ID not found in token", 401);
            }

            // Ensure designations is a valid array, otherwise default to []
            const designationsArray = Array.isArray(designations) ? designations : [];

            // Basic validation
            if (!email || !fullName) {
                return response.error(res, "Email and Full Name are required", 400);
            }

            const result = await UserService.updateProfile({
                userId,
                email,
                contactNumber,
                fullName,
                profilePicture,
                gitUsername,
                gitPublicKey,
                designations: designationsArray,
                biography: biography || ""
            });

            return response.success(res, result.message, 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async adminUpdateProfile(req, res) {
        try {
            const {
                userId,
                email,
                contactNumber,
                fullName,
                profilePicture,
                gitUsername,
                gitPublicKey,
                designations,
                biography
            } = req.body;

            if (!userId) {
                return response.error(res, "User ID (userId) is required in the request body", 400);
            }

            const designationsArray = Array.isArray(designations) ? designations : [];

            if (!email || !fullName) {
                return response.error(res, "Email and Full Name are required", 400);
            }

            const result = await UserService.updateProfile({
                userId,
                email,
                contactNumber,
                fullName,
                profilePicture,
                gitUsername,
                gitPublicKey,
                designations: designationsArray,
                biography: biography || ""
            });

            return response.success(res, result.message, 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async getAllUserProfileDetails(req, res) {
        try {
            const userId = req.user?.UserID || req.user?.UserId || req.user?.ua_id;

            if (!userId) {
                return response.error(res, "User ID not found in token", 401);
            }

            const data = await UserService.getAllUserProfileDetails(userId);
            return response.success(res, data, "User profile details fetched successfully", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async removeUserDetails(req, res) {
        try {
            const { userId, removalReason } = req.body;
            const entryUserId = req.user?.UserID || req.user?.UserId || req.user?.ua_id;

            if (!userId || !removalReason) {
                return response.error(res, "userId and removalReason are required", 400);
            }

            if (!entryUserId) {
                return response.error(res, "User ID not found in token", 401);
            }

            const errorCode = await UserService.removeUserDetails(userId, removalReason, entryUserId);

            if (errorCode === 0) {
                return response.success(res, null, "User removed successfully", 200);
            }

            if (errorCode === 1) {
                return response.error(res, "User not found or already removed", 404);
            }

            return response.error(res, `Removal failed with error code: ${errorCode}`, 500);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }
}

export default UserController;
