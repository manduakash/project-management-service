import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user_model.js";

class AuthService {

  static async register(userData) {
    const {
      username,
      password,
      email = "",
      phone = "",
      roleId,
      RoleID,
      profileImage = "",
      fullName = "",
      gitUsername = "",
      gitPublicKey = ""
    } = userData;

    const resolvedRoleId = roleId ?? RoleID;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const errorCode = await UserModel.create_user(
      username,
      resolvedRoleId,
      hashedPassword,
      email || "",
      phone || "",
      profileImage || "",
      fullName || "",
      gitUsername || "",
      gitPublicKey || ""
    );

    if (errorCode !== 0) {
      let message = "User creation failed";
      if (errorCode === 2) {
        message = "duplicate username";
      } else if (errorCode === 3) {
        message = "duplicate contact number";
      }
      throw new Error(message);
    }

    return { message: "User registered successfully" };
  }

  static async login(username, password) {

  const user = await UserModel.get_user_by_username(username);

  if (!user) {
    throw new Error("User not found");
  }
   
  const isMatch = await bcrypt.compare(password, user.PasswordHash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const payload = {
    UserID: user.UserID ?? user.UserId ?? user.ua_id ?? null,
    Username: user.Username ?? user.username ?? null,
    FullName: user.FullName ?? user.ua_full_name ?? null,
    RoleID: user.RoleID ?? user.ua_role_id ?? null
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  return { token };
}

}

export default AuthService;
