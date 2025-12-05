import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//register a new user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //1 validation: check if all fields are present
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 2 check if user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exist' });
        }

        // 3 hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4 create the new user 
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            // channels will be default to [] as per schema
        });

        await newUser.save()

        res.status(200).json({ message: 'User registered successfully. Please Login.' })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
};

// 2 login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1 check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });

        }

        // 1 validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });

        }

        // 3 Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d', });

        // 4 Send response (exclude password)

        const { password: _, ...userData } = user._doc; // Removes password from response

        res
            .cookie("access_token", token, {
                httpOnly: true, // Prevents JS from reading the cookie (XSS protection)
                secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Cross-site cookie strictness
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })
            .status(200)
            .json({
                user: userData,
            });
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
    };