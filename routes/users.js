import express from 'express';
import { signin, signup } from '../controllers/users.js';
import User from '../models/user.js';

const router = express.Router();

router.get('/',async (req,res) => {
    res.send("The Users are Confidential");
    // try {
    //     const Users = await User.find();
    //     res.send(Users);
    // } catch (error) {
    //     res.send.json({ message: error.message });
    // }
})
router.post('/signin', signin);
router.post('/signup', signup);

export default router;