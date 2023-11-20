import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Required"],
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: [true, "Email Is Already Taken"],
    },
    password: {
      type: String,
      required: [true, "Password Is Required"],
      minLength: [6, "Password Should Be Greater Than 6 Characters"],
    },
    address: {
      type: String,
      required: [true, "Address Is Required"],
    },
    city: {
      type: String,
      required: [true, "City Is Required"],
    },
    phone: {
      type: String,
      required: [true, "Phone Is Required"],
    },
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

// hash function
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

//compare function
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcryptjs.compare(plainPassword, this.password);
};

//jwt token
userSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const User = mongoose.model("user", userSchema);

export default User;
