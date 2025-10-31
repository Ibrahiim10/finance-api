import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// register new user
export const registerUser = async (req, res, next) => {

    let { name, email, password, role, profilePic } = req.body;

    try {

        email = email.toLowerCase();
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).send('User already exists');

        const user = await User.create({ name, email, password, role, profilePic });

        const token = generateToken(user._id);
        res.status(201).json({ token });

    } catch (error) {
        next(error);
    }

}

// login user
export const login = async (req, res, next) => {
    let { email, password } = req.body;

    try {
        email = email.toLowerCase();
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        const token = generateToken(user._id);
        res.json({ token, user });

    } catch (error) {
        next(error);
    }
}

// get user profile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        next(error);
    }
}