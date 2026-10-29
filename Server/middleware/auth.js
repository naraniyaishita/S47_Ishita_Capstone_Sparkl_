import jwt from "jsonwebtoken";

export default function authenticateToken(req, res, next) {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = payload.userId || payload._id;

    if (!userId) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.userId = userId.toString();
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
