export const recruiterOnly = (req, res, next) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ success: false, message: "Recruiter access only!" });
  }
  next();
};

export const seekerOnly = (req, res, next) => {
  if (req.user.role !== "seeker") {
    return res.status(403).json({ success: false, message: "Seeker access only!" });
  }
  next();
};


export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
