const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient, PaymentType } = require('@prisma/client');
var cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret

app.use(express.json());
app.use(cors());

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

// User Signup (For both Medical Store and Data Entry)
app.post('/api/signup', async (req, res) => {
    const { name, email, password, role, address } = req.body;

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
                role: role || 'DATA_ENTRY', // Default role is DATA_ENTRY if not provided
                address: role === 'MEDICAL_STORE' ? address : null, // Only store address if the role is MEDICAL_STORE
            },
        });

        console.log(user);

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error during user registration:', error); // Log the full error
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

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

        res.json({ message: 'Login successful', token, user: user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log in' });
    }
});

// Create a new medical store (Admin only)
app.post('/api/stores', authenticate, isAdmin, async (req, res) => {
    const { name, address } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                name,
                address,
                role: 'MEDICAL_STORE',
                password: await bcrypt.hash('defaultpassword', 10), // Default password for medical stores
            },
        });

        res.json({ message: 'Medical store created successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create medical store' });
    }
});

// Create a new payment record
app.post('/api/payments', authenticate, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authorization token missing' });
        }

        const decodedToken = jwt.decode(token);
        if (!decodedToken || !decodedToken.userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const storeId = decodedToken.userId; // Assuming userId represents storeId in your schema
        const { billNumber, amount, amountPaid, paymentType } = req.body;

        const amountFloat = parseFloat(amount);
        const amountPaidFloat = parseFloat(amountPaid);

        const payment = await prisma.payment.create({
            data: {
                billNumber,
                amount: amountFloat,
                type: paymentType, // Store the payment type
                amountPaid: amountPaidFloat,
                userId: storeId, // Assuming the storeId is represented by userId
                userId: req.user.userId, // The actual user performing the payment record
            },
        });

        console.log(payment);

        res.json({ message: 'Payment recorded successfully', payment });
    } catch (err) {
        console.error('Payment record error:', err);
        res.status(500).json({ error: 'Failed to record payment' });
    }
});

// Fetch all medical stores (Admin only)
app.get('/api/stores', authenticate, isAdmin, async (req, res) => {
    try {
        const stores = await prisma.user.findMany({
            where: { role: 'MEDICAL_STORE' },
        });
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch medical stores' });
    }
});

// Fetch payments for a specific medical store
app.get('/api/stores/:storeId/payments', authenticate, async (req, res) => {
    const { storeId } = req.params;

    try {
        const payments = await prisma.payment.findMany({
            where: { userId: parseInt(storeId) }, // Assuming the storeId is the userId of the medical store
        });

        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// Fetch entries by data-entry individual and date (default to today)
app.get('/api/entries', authenticate, async (req, res) => {
    const { user_id, date } = req.query;
    const queryDate = date ? new Date(date) : new Date();

    // Set the time to the beginning and end of the day
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    try {
        const entries = await prisma.entry.findMany({
            where: {
                userId: parseInt(user_id),
                entryDate: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
            include: {
                user: true,
            },
        });

        res.json({
            status: 'success',
            data: {
                date: queryDate.toISOString().split('T')[0],
                entries,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
