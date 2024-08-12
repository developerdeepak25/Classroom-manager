const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: "Unauthenticated" });
    }

    const userRole = req.user.role;
    console.log("role", req.user.role);
    
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      res
        .status(403)
        .send({ error: "You do not have permission to perform this action" });
    }
  };
};

module.exports = roleCheck;
