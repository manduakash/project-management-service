import jwt from "jsonwebtoken";
import response from "../utils/response.js";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization || req.headers["x-access-token"];

  if (!authHeader) {
    return response.error(res, "missing token", 401);
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach payload to request for downstream handlers
    req.user = payload;
    next();
  } catch (err) {
    return response.error(res, "invalid token", 401);
  }
}
