import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    try {
        
        // 1. Get the token from the HTTP-Only Cookie
        // Note: 'access_token' must match the name we used in the login controller
        const token = req.cookies.access_token;

        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token not valid" });
    }
}