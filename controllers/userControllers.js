import User from "../models/userModel.js";

const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, phone } = req.body;
    if (!name || !email || !password || !city || !phone || !address) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All The Fields",
      });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(500).send({
        success: false,
        message: "Email Already Exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      address,
      city,
      phone,
    });
    res.status(201).send({
      success: true,
      message: "Successfully Registered",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Registering The User",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "All Fields Are Required",
      });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    //check password
    const isMatch = await userExist.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    //token
    const token = userExist.generateToken();

    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "User Login Successfully",
        userExist,
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Login",
    });
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Profile Has Been Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Profile API",
      error,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Logout Successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Logout API",
      error,
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, address, city, phone } = req.body;

    // validation & update
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (phone) user.phone = phone;

    // save user
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Profile Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating Profile Api",
      error,
    });
  }
};

const updatePasswordController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;

    // validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Old And New Password",
      });
    }

    const isMatch = await user.comparePassword(oldPassword);

    // validation
    if (!isMatch) {
      res.status(500).send({
        success: false,
        message: "Invalid Old Password",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Updating Password Api",
      error,
    });
  }
};

export {
  registerController,
  loginController,
  getUserProfileController,
  logoutController,
  updateProfileController,
  updatePasswordController,
};
