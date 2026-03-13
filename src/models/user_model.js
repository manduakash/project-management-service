import pool from "../config/db.js";

class UserModel {

  static async create_user(username, roleId, hashedPassword, email, phone, profileImage, fullName, gitUsername, gitPublicKey) {
    const connection = await pool.getConnection();
    try {
      roleId = roleId === undefined || roleId === null ? 0 : roleId;
      hashedPassword = hashedPassword || "";
      email = email || "";
      phone = phone || "";
      profileImage = profileImage || "";
      fullName = fullName || "";
      gitUsername = gitUsername || "";
      gitPublicKey = gitPublicKey || "";

      const params = [
        username,
        roleId,
        hashedPassword,
        email,
        phone,
        profileImage,
        fullName,
        gitUsername,
        gitPublicKey
      ];

      const [rows] = await connection.query(
        "CALL sp_registerUser(?, ?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode)",
        params
      );

      const [[{ ErrorCode }]] = await connection.query(
        "SELECT @ErrorCode AS ErrorCode"
      );

      return ErrorCode;
    } finally {
      connection.release();
    }
  }

  static async get_user_by_username(username) {
    const [rows] = await pool.query(
      "CALL sp_getUserDetailsByUsername(?)",
      [username]
    );

    // MySQL SP returns nested array

    return rows[0][0];
  }

  static async update_user_profile(userId, email, contactNumber, fullName, profilePicture, gitUsername, gitPublicKey, designations) {
    const connection = await pool.getConnection();
    try {
      userId = userId || 0;
      email = email || "";
      contactNumber = contactNumber || "";
      fullName = fullName || "";
      profilePicture = profilePicture || "";
      gitUsername = gitUsername || "";
      gitPublicKey = gitPublicKey || "";
      // Ensure designations is a stringified JSON if it's an object/array
      const designationsJson = typeof designations === 'string' ? designations : JSON.stringify(designations || []);

      const params = [userId, email, contactNumber, fullName, profilePicture, gitUsername, gitPublicKey, designationsJson];

      await connection.query(
        "CALL sp_updateUserProfile(?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode)",
        params
      );

      const [[{ ErrorCode }]] = await connection.query(
        "SELECT @ErrorCode AS ErrorCode"
      );

      return ErrorCode;
    } finally {
      connection.release();
    }
  }

  static async get_all_user_profile_details(userId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "CALL sp_getAllUserProfileDetails(?)",
        [userId || 0]
      );
      return rows[0] || [];
    } finally {
      connection.release();
    }
  }

  static async remove_user_details(userId, removalReason, entryUserId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        "CALL sp_removeUserDetails(?, ?, ?, @ErrorCode)",
        [userId || 0, removalReason || "", entryUserId || 0]
      );
      const [[{ ErrorCode }]] = await connection.query("SELECT @ErrorCode AS ErrorCode");
      return ErrorCode;
    } finally {
      connection.release();
    }
  }
}

export default UserModel;
