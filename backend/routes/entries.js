// src/routes/entries.js

const express = require('express');
const prisma = require('../prisma'); // Assuming prisma.js initializes PrismaClient
const router = express.Router();

// Get entries by data-entry individuals and date
router.get('/entries', async (req, res) => {
    try {
        const { user_id, date } = req.query;
        const queryDate = date ? new Date(date) : new Date();

        // Set the time to the beginning and end of the day
        const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

        // Fetch entries made by the specific user on the given date
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
                store: true,
            },
        });

        res.json({
            status: 'success',
            data: {
                date: queryDate.toISOString().split('T')[0],
                entries,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
