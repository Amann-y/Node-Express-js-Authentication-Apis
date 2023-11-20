import JWT from "jsonwebtoken";
import User from "../models/userModel.js";

const isAuth = async (req, res, next) => {
  const { token } = req.cookies;

  //validation
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized User",
    });
  }

  const decodeData = JWT.verify(token, process.env.JWT_SECRET);
  const userData = await User.findById(decodeData._id);
  req.user = await userData;
  next();
};

export { isAuth };
