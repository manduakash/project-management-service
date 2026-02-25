// middleware/authorize.js

const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            // Check if user exists (JWT verified first)
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            // Check if role is allowed
            if (!allowedRoles.includes(req.user.RoleID)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You don't have access to this resource"
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Authorization error"
            });
        }
    };
};

export default authorize;