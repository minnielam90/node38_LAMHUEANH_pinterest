import jwt from "jsonwebtoken";

const createToken = (data) => {
  return jwt.sign(data, "NODE38", { expiresIn: "1y" });
};

export { createToken };
