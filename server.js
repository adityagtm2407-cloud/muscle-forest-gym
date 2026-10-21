
require('dotenv').config();

const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const { rateLimit } = require('express-rate-limit');
const { MongoStore } = require('connect-mongo');

const app = express();
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
const PORT = process.env.PORT || 3000;

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'muscleForestGym';

const client = new MongoClient(MONGO_URL);

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        dbName: 'muscleForestGym',
        collectionName: 'sessions',
        ttl: 60 * 60
    }),

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60
    }
}));


function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin === true) {
        return next();
    }

    return res.status(401).json({
        success: false,
        message: 'Please log in as admin first.'
    });
}

app.get('/api/test', (req, res) => {
    res.json({ message: 'Correct server is working!' });
});

const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    }
});

const enquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many enquiries. Please try again after 15 minutes.'
    }
});

async function startServer() {
    try {
        await client.connect();

        console.log('MongoDB connected successfully!');

        const db = client.db(DB_NAME);

        app.locals.db = db;

        
        // Admin login route
        app.post('/api/admin/login', adminLoginLimiter, async (req, res) => {
            try {
                const { username, password } = req.body;

                if (
                    username !== process.env.ADMIN_USERNAME ||
                    password !== process.env.ADMIN_PASSWORD
                ) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid username or password.'
                    });
                }

                
req.session.regenerate((error) => {
    if (error) {
        console.error('Session regeneration failed:', error);

        return res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }

    req.session.isAdmin = true;

    req.session.save((saveError) => {
        if (saveError) {
            console.error('Session save failed:', saveError);

            return res.status(500).json({
                success: false,
                message: 'Login failed. Please try again.'
            });
        }

        res.json({
            success: true,
            message: 'Admin login successful!'
        });
    });
});

            } catch (error) {
                console.error('Admin login failed:', error);

                res.status(500).json({
                    success: false,
                    message: 'Login failed. Please try again.'
                });
            }
        });


        // Check admin login session
        app.get('/api/admin/session', (req, res) => {
            res.json({
                isAdmin: req.session.isAdmin === true
            });
        });

        // Admin logout route
        app.post('/api/admin/logout', (req, res) => {
            req.session.destroy((error) => {
                if (error) {
                    console.error('Logout failed:', error);

                    return res.status(500).json({
                        success: false,
                        message: 'Logout failed.'
                    });
                }

                res.clearCookie('connect.sid');

                res.json({
                    success: true,
                    message: 'Logged out successfully.'
                });
            });
        });
        
        // Get all enquiries from MongoDB
        app.get('/api/enquiries', requireAdmin, async (req, res) => {
            try {
                const enquiries = await db
                    .collection('enquiries')
                    .find({})
                    .sort({ createdAt: -1 })
                    .toArray();

                res.json({
                    success: true,
                    count: enquiries.length,
                    enquiries: enquiries
                });

            } catch (error) {
                console.error('Enquiries fetch failed:', error);

                res.status(500).json({
                    success: false,
                    message: 'Could not fetch enquiries.'
                });
            }
        });

        app.post('/api/enquiries', enquiryLimiter, async (req, res) => {
            try {
                const { name, phone, plan, message } = req.body;

                
                if (
                    typeof name !== 'string' ||
                    !name.trim() ||
                    name.trim().length > 100 ||
                    typeof phone !== 'string' ||
                    !/^\d{10}$/.test(phone.trim()) ||
                    !['1-month', '3-months', '1-year'].includes(plan) ||
                    (message !== undefined &&
                        (typeof message !== 'string' || message.length > 1000))
                ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Please enter valid enquiry details.'
                    });
                }

                const result = await req.app.locals.db
                    .collection('enquiries')
                    .insertOne({
                        name: name.trim(),
                        phone: phone.trim(),
                        plan,
                        message: (message || '').trim(),
                        createdAt: new Date()
                    });

                res.status(201).json({
                    success: true,
                    message: 'Your enquiry has been submitted successfully!',
                    id: result.insertedId
                });

            } catch (error) {
                console.error('Enquiry save failed:', error);

                res.status(500).json({
                    success: false,
                    message: 'Could not submit your enquiry. Please try again.'
                });
            }
        });

        app.listen(PORT, () => {
            console.log(
                `Muscle Forest Gym running at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error('MongoDB connection failed:', error);
    }
}

startServer();