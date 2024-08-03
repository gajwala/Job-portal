import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validateEmail } from "../helper/validation.js";

export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      skills,
      githubProfile,
      contactInfo,
      name,
      designation,
      aboutMe,
    } = req.body;

    if (!validateEmail(email)) {
      res.status(400).json({ message: "Invalid credentials" });
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role,
      skills,
      githubProfile,
      contactInfo,
      name,
      aboutMe,
      designation,
    });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    const { password: userPassword, ...userWithoutPassword } = user._doc;
    res.send({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Dynamically build updatedFields based on the fields present in req.body
    const updatedFields = { ...req.body };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
