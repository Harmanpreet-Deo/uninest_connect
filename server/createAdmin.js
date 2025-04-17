// scripts/createAdmin.js (you can run this once)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from "./models/Admin.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
        fullName: 'Super Admin',
        email: 'uninestconnect@proton.me',
        password: hashedPassword,
        role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin created');
    process.exit();
};

createAdmin();
