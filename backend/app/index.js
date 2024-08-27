const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const prisma = new PrismaClient();
const cors = require('cors');

const SECRET_KEY = 'PIOASYEFNJGCeq9876123jkASDFD';  

app.use(express.json());
app.use(cors({
    origin: '*', // Replace '*' with your frontend's URL for a more secure setup
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));



// Create a store (Admin only)
app.post('/stores', async (req, res) => {
    const { name, address } = req.body;

    const store = await prisma.store.create({
        data: { name, address },
    });

    res.json(store);
});

// Create a data entry user (Admin only)
app.post('/users', async (req, res) => {
    const { name, email, password, storeId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: 'DATA_ENTRY',
            store: { connect: { id: storeId } },
        },
    });

    res.json(user);
});

// Signup
app.post('/signup', async (req, res) => {
    const { name, email, password, role, storeId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                store: storeId ? { connect: { id: storeId } } : undefined,
            },
        });

        console.log(user);

        const token = jwt.sign(
            { userId: user.id, role: user.role, storeId: user.storeId },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                storeId: user.storeId,
            },
        });
    } catch (error) {
        res.status(400).json({ error: 'User already exists' + error });
    }
});


// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
        include: { store: true }, // Include store to get storeId
    });

    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role, storeId: user.storeId },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            storeId: user.storeId,
        },
    });
});

// Middleware to authenticate and attach user data from JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Add payment data (Data Entry Guy)
app.post('/payments', authenticateToken, async (req, res) => {
    const { billNumber, amount, amountPaid, paymentType } = req.body;

    const payment = await prisma.payment.create({
        data: {
            billNumber,
            amount,
            amountPaid,
            paymentType,
            store: { connect: { id: req.user.storeId } }, // Use storeId from the token
        },
    });

    res.json(payment);
});



app.get('/stores', async (req, res) => {
    try {
        const stores = await prisma.store.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve stores' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
