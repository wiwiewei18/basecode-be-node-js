const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { Roles, RolesEnum } = require("../constants/Role");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },

    role: {
      type: String,
      enum: Roles,
      default: RolesEnum.USER,
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [8, "Minimum password length is 8 characters"],
      select: false,
    },

    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and ConfirmPassword do not match",
      },
    },

    passwordChangedAt: Date,

    deleted: {
      type: Boolean,
      default: false,
      select: false,
    },

    deletedAt: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, async function (next) {
  this.find({ deleted: false }).select("-__v");
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isPasswordChanged = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAtTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000
    );

    return passwordChangedAtTimestamp > jwtTimestamp;
  }

  return false;
};

userSchema.index({ name: "text", role: "text", email: "text" });

const User = mongoose.model("User", userSchema);

module.exports = User;
