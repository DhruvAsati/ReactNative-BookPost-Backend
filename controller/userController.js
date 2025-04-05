const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Validate the user input
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // Validate password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    //get random avatar

    const profilePicture = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;


    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user with hashed password

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture,
    });
    if (!newUser) {
      return res.status(400).json({ message: "Invalid user data" });
    }
    // Generate JWT token
    const token = jwt.sign({
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,

    },process.env.JWT_SECRET_KEY, {expiresIn: '7d'})
    // Send the user data and token to the client
    if(token){

        res.cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true }) // 1 hour cookie expiration
    }

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate the user input
    if (!email ||!password) {
      return res
       .status(400)
       .json({ message: "Please provide all required fields" });
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Compare the hashed password with the entered password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate JWT token
    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      process.env.JWT_SECRET_KEY,
      {expiresIn: '7d'}
    );
    // Send the user data and token to the client
    if(token){
        res.cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true }) // 1 hour cookie expiration
    }
    res
      .status(200)
      .json({ message: "User logged in successfully", user: user, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { userRegister, userLogin };
