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
            } = req.body;

            const userId = req.user?.UserID || req.user?.UserId || req.user?.ua_id;

            if (!userId) {
                return response.error(res, "User ID not found in token", 401);
            }

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
            });

            return response.success(res, null, result.message, 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }
}

export default UserController;
