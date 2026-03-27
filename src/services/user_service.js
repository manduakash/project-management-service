import UserModel from "../models/user_model.js";

class UserService {
  static async updateProfile(userData) {
    const {
      userId,
      email,
      contactNumber,
      fullName,
      profilePicture,
      gitUsername,
      gitPublicKey,
      designations,
      biography,
    } = userData;

    const errorCode = await UserModel.update_user_profile(
      userId,
      email,
      contactNumber,
      fullName,
      profilePicture,
      gitUsername,
      gitPublicKey,
      designations,
      biography
    );

    if (errorCode !== 0) {
      throw new Error(`Profile update failed with error code: ${errorCode}`);
    }

    return { message: "Profile updated successfully" };
  }

  static async getAllUserProfileDetails(userId) {
    const rows = await UserModel.get_all_user_profile_details(userId);
    return rows;
  }

  static async removeUserDetails(userId, removalReason, entryUserId) {
    const errorCode = await UserModel.remove_user_details(userId, removalReason, entryUserId);
    return errorCode;
  }
}

export default UserService;
