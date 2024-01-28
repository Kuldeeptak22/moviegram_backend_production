import multer from "multer";
import bcrypt from "bcrypt";
import fs from "fs";
import Jwt from "jsonwebtoken";
import validator from "validator";
import UserModel from "../models/user.model";
import { storage } from "../utils/multerFile";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import OtpModel from "../models/otp.model";

const upload = multer({
  storage: storage,
});

// Add User data
export const addUser = (req, res) => {
  try {
    const uploadUserData = upload.single("avatar");
    uploadUserData(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }

      const { firstName, lastName, email, password, gender, contact } =
        req.body; // Receive from Front End

      let avatar = null;
      if (req.file !== undefined) {
        avatar = req.file.filename;
      }
      const securePassword = bcrypt.hashSync(password, 10);
      // Schema Validation as per requirements
      const createUserRecord = new UserModel({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: securePassword,
        gender: gender,
        avatar: avatar,
        contact: contact,
      });
      createUserRecord.save(); // Save inputData
      if (createUserRecord) {
        return res.status(201).json({
          data: createUserRecord,
          message: "Item has been added Successfully.",
          filepath: `${process.env.BASE_URL}/uploads`,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Fetch All users Data
export const getUsers = async (req, res) => {
  try {
    const getUsersData = await UserModel.find({ status: 1 });
    if (getUsersData) {
      return res.status(200).json({
        data: getUsersData,
        message: "SuccessFully Fetched",
        total: getUsersData.length,
        filepath: `${process.env.BASE_URL}/uploads`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Fetch Single user Data
export const getUser = async (req, res) => {
  try {
    const userID = req.params.user_id; // from front End
    const getUserData = await UserModel.findOne({ _id: userID, status: 1 });
    if (getUserData) {
      return res.status(200).json({
        data: getUserData,
        message: "Successfully fetched single user data.",
        filepath: `${process.env.BASE_URL}/uploads`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Update Single User Data
export const updateUser = async (req, res) => {
  try {
    const updateUserData = upload.single("avatar");
    updateUserData(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      const userID = req.params.user_id;
      const { firstName, lastName, email, password, gender, contact } =
        req.body;

      const existUser = await UserModel.findOne({
        _id: userID,
      });

      let newAvatar = existUser.avatar;

      if (req.file) {
        newAvatar = req.file.filename;
        if (fs.existsSync("./uploads/users/" + existUser.avatar)) {
          fs.unlinkSync("./uploads/users/" + existUser.avatar);
        }
      }

      if (password) {
        const strongPassword = validator.isStrongPassword(password);
        const hashedPassword = bcrypt.hashSync(password, 10);

        if (email) {
          const validEmail = validator.isEmail(email);
          if (!validEmail) {
            return res.status(400).json({
              message: "Email is not valid..!",
            });
          }
        }

        if (!strongPassword) {
          return res.status(400).json({
            message:
              "minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
          });
        }
      }
      const updatedUser = await UserModel.updateOne(
        { _id: userID },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            gender: gender,
            contact: contact,
            avatar: newAvatar,
          },
        }
      );
      if (updatedUser.acknowledged) {
        return res.status(200).json({
          message: "Item has Been Updated..!",
        });
      } else {
        return res.status(500).json({
          message: "Failed to update user.",
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
// Soft Delete User Data
export const deleteUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const deleted = await UserModel.updateOne(
      { _id: userID },
      { $set: { status: 0 } }
    );
    if (deleted.acknowledged) {
      return res.status(200).json({
        message: "Item has been Deleted",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Hard delete User Data
export const removeUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const existUser = await UserModel.findOne({
      _id: userID,
    });

    if (fs.existsSync("./uploads/users/" + existUser.avatar)) {
      fs.unlinkSync("./uploads/users/" + existUser.avatar);
    }

    const deleted = await UserModel.deleteOne({ _id: userID });
    if (deleted.acknowledged) {
      return res.status(200).json({
        message: "Deleted from Data Base",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// SignUp API :-
export const signUpUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, contact, gender } = req.body;
    // (auto-gen a salt and hash):
    // Store hash in your password DB.
    const strongPassword = validator.isStrongPassword(password);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const validEmail = validator.isEmail(email);
    if (!validEmail) {
      return res.status(400).json({
        message: "Email is not valid..!",
      });
    } else if (!strongPassword) {
      return res.status(400).json({
        message:
          "minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
      });
    }

    const existUser = await UserModel.findOne({ email: email });
    if (existUser) {
      return res.status(200).json({
        message: "User already exist..!",
      });
    }

    const saveUser = new UserModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      contact: contact,
      gender: gender,
    });
    saveUser.save();
    if (saveUser) {
      return res.status(200).json({
        message: "Successfully Signup..!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Sign In API :-
export const signInUser = async (req, res) => {
  try {
    const { email, password, contact } = req.body;

    let filter = { status: 1 };
    filter = {
      ...filter,
      $or: [{ email: email }, { contact: contact }],
    };
    const existUser = await UserModel.findOne(filter);
    if (!existUser) {
      return res.status(400).json({
        message: "User doesn't exist,please Create new Account.",
      });
    }

    const checkPassword = bcrypt.compareSync(password, existUser.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid credential,Check your password again..!",
      });
    }

    const token = Jwt.sign(
      {
        id: existUser._id,
        email: existUser.email,
      },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("userdata", existUser);

    return res.status(200).json({
      data: existUser,
      token: token,
      message: "Login Successfully...!!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Common Function to Check user
const updateOrCreateOtpThroughOtpModel = async (email, otp) => {
  const alreadyExistEmail = await OtpModel.findOne({ email });

  if (alreadyExistEmail) {
    const updateExistEmail = await OtpModel.updateOne(
      { email },
      {
        $set: {
          otp,
          createdAt: new Date(),
        },
      }
    );
    return updateExistEmail;
  } else {
    const saveOtp = new OtpModel({
      email,
      otp,
    });
    return saveOtp.save();
  }
};
// Send OTP API
export const createAndSendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let filter = { status: 1 };
    filter = {
      ...filter,
      $or: [{ email: email }],
    };

    const existUser = await UserModel.findOne(filter);
    if (!existUser) {
      return res.status(400).json({
        message: "User doesn't exist,please Create new Account.",
      });
    } else {
      //OTP GENERATE
      let otpGenerated = otpGenerator.generate(6, {
        upperCaseAlphabets: true,
        specialChars: false,
      });

      // send OTP throgh this email:-
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "kuldeeptak2211@gmail.com",
          pass: "qmti dvkj mfce hdup",
        },
      });

      const otpUpdateResult = await updateOrCreateOtpThroughOtpModel(
        email,
        otpGenerated
      );
      if (otpUpdateResult.acknowledged) {
        const info = await transporter.sendMail({
          from: "kuldeeptak2211@gmail.com", // Sender's Email address
          to: email, // list of receivers
          subject: "MovieGram OTP✔", // Subject line
          text: `This is Your OTP For Login in Moviegram Website: ${otpGenerated}`,
        });

        return res.status(201).json({
          message: "OTP Sent Successfully..!!",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Sign in With API
export const signInWithOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;
    console.log("req.body", req.body);

    const existUser = await OtpModel.findOne({ otp: otp, email: email });

    if (!existUser) {
      return res.status(400).json({
        message: "Email or OTP is not valid, please Enter valid data..!",
      });
    } else {
      // OTP expiration...
      const CurrentTime = new Date();
      const expirationTime = 2;

      const CheckTimeLimitation =
        CurrentTime - existUser.createdAt < expirationTime * 60 * 1000;

      if (CheckTimeLimitation) {
        const existUserEmail = await UserModel.findOne({
          email: existUser.email,
        });
        if (existUserEmail) {
          const token = Jwt.sign(
            {
              id: existUser._id,
              email: existUser.email,
            },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "1h" }
          );
          res.cookie("userdata", existUserEmail); // cookies
          return res.status(200).json({
            data: existUserEmail,
            token: token,
            message: "Login Successfully...!!",
          });
        }
      } else {
        const toDeleteOtpData = await OtpModel.deleteOne({ _id: existUser.id });
        return res.status(200).json({
          message: "Session has been expired..!!",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const checkOTPinUserModel = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const existUser = await OtpModel.findOne({
      otp: otp,
      email: email,
    });

    if (existUser && existUser.id !== undefined) {
      // OTP expiration duration is valid or not
      const CurrentTime = new Date();
      const expirationTime = 2;

      const CheckTimeLimitation =
        CurrentTime - existUser.createdAt < expirationTime * 60 * 1000;

      if (CheckTimeLimitation === true) {
        // =========
        const existUser1 = await UserModel.findOne({
          email: email,
        });
        if (existUser1 && existUser1.id !== undefined) {
          return res.status(200).json({
            data: existUser1,
            message: "OTP Verified Successfully...!!",
          });
        } else {
          return res.status(200).json({
            message: "User Not Found...!!",
          });
        }
      } else {
        const toDeleteOtpData = await OtpModel.deleteOne({
          _id: existUser.id,
        });
        if (toDeleteOtpData.acknowledged === true) {
          return res.status(200).json({
            message: "Session has been expired..!!",
          });
        }
      }
    } else {
      return res.status(400).json({
        message: "Email or OTP is not valid, please Enter valid data..!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
