import jwt from "jsonwebtoken";

const createToken = (data) => {
  return jwt.sign(data, "NODE38", { expiresIn: "1y" });
};

const checkToken = (token) => {
  return jwt.verify(token, "NODE38", (err, decoded) => {
    if (err) {
      return {
        statusCode: 401,
        message: "Invalid Token!",
      };
    }
    return {
      statusCode: 200,
      data: decoded,
    };
  });
};

const lockApi = (req, res, next) => {
  let { token } = req.headers;
  if (token) {
    let verifyToken = checkToken(token);
    if (verifyToken.statusCode == 401) {
      res.status(401).send("Invalid Token!");
      return;
    }
    req.userIdFromToken = verifyToken.data.nguoi_dung_id;
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

const verifyUserToken = (req, res, next) => {
  try {
    let { token } = req.headers;
    let { userId } = req.params;

    console.log("Token received:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verifyToken = checkToken(token);

    console.log("Token verification result:", verifyToken);

    if (verifyToken.statusCode === 401) {
      return res.status(401).json({ message: "Invalid Token!" });
    }

    // Set user ID from token to req.user
    req.user = { id: verifyToken.data.nguoi_dung_id };

    console.log("User ID from token:", req.user.id);

    // Ensure that the user making the request is the same as the user being updated
    if (Number(req.userIdFromToken) !== Number(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error("Error in verifyUserToken:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export { createToken, checkToken, lockApi, verifyUserToken };
