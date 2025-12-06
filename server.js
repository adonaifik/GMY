const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
// Enable CORS for ANY device on the network (e.g., phones accessing laptop IP)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
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

// Helper: Generate Random Rh Factor
const generateRhFactor = () => {
    const factors = ['+', '-'];
    return factors[Math.floor(Math.random() * factors.length)];
};

// Endpoint: Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Endpoint: Register User
app.post('/api/register', (req, res) => {
    try {
        const { name, gender, email, bloodType } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and Email are required' });
        }

        const users = readDb();
        
        // Generate User Data
        const code = generateUserCode();
        
        // Use provided blood type (from quiz) or fallback to random if missing (safety check)
        const types = ['A', 'B', 'AB', 'O'];
        const finalBloodType = bloodType && types.includes(bloodType) 
            ? bloodType 
            : types[Math.floor(Math.random() * types.length)];
            
        const rhFactor = generateRhFactor();
        
        const newUser = {
            code,
            name,
            gender,
            email,
            registeredAt: new Date().toLocaleDateString(),
            bloodType: finalBloodType,
            rhFactor
        };

        // Save to DB
        users.push(newUser);
        writeDb(users);

        console.log(`[SERVER] Registered new user: ${name} (${code}) [Type: ${finalBloodType}${rhFactor}]`);
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

// Start Server listening on all interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`BloodTesting Server running on port ${PORT}`);
    console.log(`Local:   http://localhost:${PORT}`);
    console.log(`Network: http://<Your-IP-Address>:${PORT}`);
});