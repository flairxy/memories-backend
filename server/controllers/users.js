import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json("User doesn't exist");
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );
    return res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("User already exist");
    if (password !== confirmPassword)
      return res.status(400).json("Passwords don't match");

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });
    return res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
