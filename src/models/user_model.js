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
}

export default UserModel;
