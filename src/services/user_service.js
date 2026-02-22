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
    } = userData;

    const errorCode = await UserModel.update_user_profile(
      userId,
      email,
      contactNumber,
      fullName,
      profilePicture,
      gitUsername,
      gitPublicKey
    );

    if (errorCode !== 0) {
      throw new Error(`Profile update failed with error code: ${errorCode}`);
    }

    return { message: "Profile updated successfully" };
  }
}

export default UserService;
