const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const prisma = new PrismaClient();

const SECRET_KEY = 'your_secret_key'; // Use a strong key and keep it secure

app.use(express.json());

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


        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
            expiresIn: '1h',
        });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
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
    });

    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
        expiresIn: '1h',
    });

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

// Add payment data (Data Entry Guy)
app.post('/payments', async (req, res) => {
    const { billNumber, amount, amountPaid, paymentType, storeId } = req.body;

    const payment = await prisma.payment.create({
        data: {
            billNumber,
            amount,
            amountPaid,
            paymentType,
            store: { connect: { id: storeId } },
        },
    });

    res.json(payment);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
