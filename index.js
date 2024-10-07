const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users').authenticated;
const genl_routes = require('./router/general').general;

const app = express();

app.use(express.json());

// Initialize session for customer routes
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// JWT Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
