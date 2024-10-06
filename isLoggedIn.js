const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      req.user = decoded; // Attach the decoded user information to the request
      next(); // Pass control to the next middleware or route handler
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = isLoggedIn;
