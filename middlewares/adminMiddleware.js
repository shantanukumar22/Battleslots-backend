// Middleware to check if user is an admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next(); // Proceed if the user is an admin
  }
  return res.status(403).json({ message: "Access denied: Admins only" });
};
