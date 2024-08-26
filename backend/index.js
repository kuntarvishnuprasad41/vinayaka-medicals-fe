const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
var cors = require('cors')

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret

app.use(express.json());
app.use(cors())

// Middleware to authenticate and get user info
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

// User Signup
app.post('/api/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER', // Default role is USER if not provided
            },
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;


    console.log(email);


    try {
        // Find the user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log({ message: 'Login successful', token });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log in' });
    }
});

// Create a new medical store (Admin only)
app.post('/api/stores', authenticate, isAdmin, async (req, res) => {
    const { name, address } = req.body;

    try {
        const store = await prisma.store.create({
            data: {
                name,
                address,
                userId: req.user.userId,
            },
        });

        res.json({ message: 'Store created successfully', store });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create store' });
    }
});

// Create a new payment record
app.post('/api/payments', authenticate, async (req, res) => {
    const { billNumber, amount, type, amountPaid, storeId } = req.body;
    const userId = req.user.userId;

    try {
        const payment = await prisma.payment.create({
            data: {
                billNumber,
                amount,
                type,
                amountPaid,
                storeId,
                userId,
            },
        });

        res.json({ message: 'Payment recorded successfully', payment });
    } catch (err) {
        res.status(500).json({ error: 'Failed to record payment' });
    }
});

// Fetch all stores (Admin only)
app.get('/api/stores', authenticate, isAdmin, async (req, res) => {
    try {
        const stores = await prisma.store.findMany();
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
});

// Fetch payments for a specific store
app.get('/api/stores/:storeId/payments', authenticate, async (req, res) => {
    const { storeId } = req.params;

    try {
        const payments = await prisma.payment.findMany({
            where: { storeId: parseInt(storeId) },
        });

        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
