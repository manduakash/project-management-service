import AuthService from "../services/auth_service.js";
import response from "../utils/response.js";

class AuthController {

  static async register(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return response.error(res, "empty parameters", 400);
      }
      const username = req.body.username;
      const password = req.body.password;
      const roleId = req.body.roleId ?? req.body.RoleID;
      const phoneRaw = req.body.phone ?? req.body.contactNumber ?? req.body.ContactNumber;
      const phone = phoneRaw !== undefined && phoneRaw !== null ? String(phoneRaw).trim() : phoneRaw;

      const missing = [];
      if (!username) missing.push("username");
      if (roleId === undefined || roleId === null) missing.push("roleId");
      if (!password) missing.push("password");
      if (!phone) missing.push("contactNumber");

      if (missing.length === 0) {
        // validate length: contact number must be exactly 10 digits
        const digitsOnly = /^[0-9]{10}$/;
        if (!digitsOnly.test(phone)) {
          return response.error(res, "invalid contact number: must be 10 digits", 400);
        }
      }

      if (missing.length > 0) {
        return response.error(res, `missing parameters: ${missing.join(", ")}`, 400);
      }

      const normalized = {
        ...req.body,
        roleId: roleId,
        phone: phone
      };

      const result = await AuthService.register(normalized);
      return response.success(res, result, result.message || "User registered", 201);
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  static async login(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return response.error(res, "empty parameters", 400);
      }

      const { username, password } = req.body;
      if (!username) {
        return response.error(res, "missing parameters: username", 400);
      }
      const result = await AuthService.login(username, password);
      return response.success(res, result, "logged in", 200);
    } catch (error) {
      return response.error(res, error.message, 401);
    }
  }

  static async bulkRegister(req, res) {
    try {
      const users = req.body;
      if (!Array.isArray(users)) {
        return response.error(res, "Body must be an array of users", 400);
      }

      const results = [];
      const errors = [];

      for (const userData of users) {
        try {
          const roleId = userData.roleId ?? userData.RoleID;
          const phoneRaw = userData.phone ?? userData.contactNumber ?? userData.ContactNumber;
          const phone = phoneRaw !== undefined && phoneRaw !== null ? String(phoneRaw).trim() : phoneRaw;

          if (!userData.username || roleId === undefined || !userData.password || !phone) {
            errors.push({ username: userData.username, error: "missing parameters" });
            continue;
          }

          const normalized = {
            ...userData,
            roleId: roleId,
            phone: phone
          };

          const result = await AuthService.register(normalized);
          results.push({ username: userData.username, status: "success" });
        } catch (err) {
          errors.push({ username: userData.username, error: err.message });
        }
      }

      return response.success(res, { results, errors }, "Bulk registration completed", 207);
    } catch (error) {
      return response.error(res, error.message, 500);
    }
  }
}

export default AuthController;
