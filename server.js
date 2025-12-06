const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper: Read Database
const readDb = () => {
    if (!fs.existsSync(DB_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data || '[]');
};

// Helper: Write Database
const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Helper: Generate Random Code
const generateUserCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
};

// Helper: Generate Random Blood Type & Rh
const generateBloodData = () => {
    const types = ['A', 'B', 'AB', 'O'];
    const factors = ['+', '-'];
    return {
        bloodType: types[Math.floor(Math.random() * types.length)],
        rhFactor: factors[Math.floor(Math.random() * factors.length)]
    };
};

// Endpoint: Register User
app.post('/api/register', (req, res) => {
    try {
        const { name, gender, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and Email are required' });
        }

        const users = readDb();
        
        // Generate User Data
        const code = generateUserCode();
        const { bloodType, rhFactor } = generateBloodData();
        
        const newUser = {
            code,
            name,
            gender,
            email,
            registeredAt: new Date().toLocaleDateString(),
            bloodType,
            rhFactor
        };

        // Save to DB
        users.push(newUser);
        writeDb(users);

        console.log(`[SERVER] Registered new user: ${name} (${code})`);
        res.status(201).json(newUser);

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint: Get User by Code
app.get('/api/user/:code', (req, res) => {
    try {
        const code = req.params.code.toUpperCase();
        const users = readDb();
        
        const user = users.find(u => u.code === code);
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`BloodTesting Server running on http://localhost:${PORT}`);
    console.log(`To make this accessible anywhere, deploy this script to a cloud host.`);
});