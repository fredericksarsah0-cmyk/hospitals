// PUIT24210078 HOSPITAL MANAGEMENT SYSTEM - Secure Local Web Server & 2FA Auth API
// Runs using Node.js standard libraries (zero external dependencies needed)

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;
const USERS_FILE = path.join(BASE_DIR, 'users.json');

// System Pepper - Confidential secret key NEVER stored in the database
const PEPPER = process.env.HMS_PEPPER || 'PUIT24210078_SECURE_PEPPER_KEY_V1_CLINICAL_AUTHENTICATION_HMAC_SECRET';

// In-memory 2FA pending sessions & active sessions
// pendingSessions: pendingToken -> { user, otp, expiresAt, attempts }
const pendingSessions = new Map();
// activeSessions: sessionToken -> { user, createdAt, expiresAt }
const activeSessions = new Map();

// Supported MIME types
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

/* =========================================================================
   CRYPTOGRAPHIC & SECURITY FUNCTIONS (SALT & PEPPER + OTP)
   ========================================================================= */

// Generate unique 128-bit cryptographic salt (32 hex characters)
function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}

// Compute PBKDF2 hash using password + server-wide pepper and unique user salt
function hashPassword(password, salt) {
    const combined = password + PEPPER;
    return crypto.pbkdf2Sync(combined, salt, 10000, 64, 'sha512').toString('hex');
}

// Generate secure 6-digit numeric OTP (100000 - 999999)
function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}

// Mask contact information for security display
function maskContact(phone, email) {
    const maskedPhone = (phone || '+234 800 000 0000').replace(/(\+\d{3}\s*\d{3})\d+(\d{4})/, '$1 *** $2');
    const emailParts = (email || 'staff@hospital.puit.edu.ng').split('@');
    const maskedEmail = emailParts[0].substring(0, 2) + '***@' + (emailParts[1] || 'hospital.puit.edu.ng');
    return { maskedPhone, maskedEmail };
}

// Simulated SMS & Email dispatch logger
function logOTPDispatch(user, otp, isResend = false) {
    const { maskedPhone, maskedEmail } = maskContact(user.phone, user.email);
    console.log('\n========================================================================');
    console.log(`  🚨 PUIT24210078 SECURE 2FA DISPATCH GATEWAY ${isResend ? '(RESEND)' : ''} 🚨`);
    console.log('========================================================================');
    console.log(`  Staff Member   : ${user.name} [${user.staffId}]`);
    console.log(`  Role / Dept    : ${user.role}`);
    console.log(`  Username       : ${user.username}`);
    console.log(`  SMS Gateway    : ${maskedPhone} [Status: DELIVERED]`);
    console.log(`  Email Dispatch : ${maskedEmail} [Status: SENT]`);
    console.log(`  ----------------------------------------------------------------------`);
    console.log(`  >>> VERIFICATION CODE (OTP): [ ${otp} ] <<<`);
    console.log(`  Validity       : 5 Minutes (Expires: ${new Date(Date.now() + 5 * 60000).toLocaleTimeString()})`);
    console.log('========================================================================\n');
}

// Load users from users.json (or initialize with default accounts)
function getUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const raw = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.error('Error reading users.json:', e);
    }
    return initializeUsers();
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function initializeUsers() {
    const defaultUsers = [
        {
            id: 'USR-001',
            username: 'admin',
            name: 'System Administrator',
            role: 'Chief Administrator',
            staffId: 'PUIT-ADM-001',
            email: 'admin@hospital.puit.edu.ng',
            phone: '+234 803 123 4567',
            passwordPlain: 'AdminPassword123!'
        },
        {
            id: 'USR-002',
            username: 'dr.adebayo',
            name: 'Dr. Samuel Adebayo, FWACS',
            role: 'Chief Consultant Physician',
            staffId: 'PUIT-DOC-101',
            email: 'dr.adebayo@hospital.puit.edu.ng',
            phone: '+234 802 987 6543',
            passwordPlain: 'DoctorPassword123!'
        },
        {
            id: 'USR-003',
            username: 'nurse.chioma',
            name: 'Nurse Chioma Okonjo, RN',
            role: 'Head Triage Nurse',
            staffId: 'PUIT-NRS-204',
            email: 'chioma@hospital.puit.edu.ng',
            phone: '+234 814 555 0199',
            passwordPlain: 'NursePassword123!'
        }
    ];

    const users = defaultUsers.map(u => {
        const salt = generateSalt();
        const hash = hashPassword(u.passwordPlain, salt);
        return {
            id: u.id,
            username: u.username,
            name: u.name,
            role: u.role,
            staffId: u.staffId,
            email: u.email,
            phone: u.phone,
            salt: salt,
            hash: hash,
            createdAt: new Date().toISOString()
        };
    });

    saveUsers(users);
    console.log('[SECURITY] Initialized users.json with 3 default salted & peppered staff accounts.');
    return users;
}

/* =========================================================================
   REQUEST BODY PARSER & JSON RESPONSE HELPERS
   ========================================================================= */

function parseRequestBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 1e6) {
                req.destroy();
            }
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                resolve({});
            }
        });
        req.on('error', () => resolve({}));
    });
}

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
}

/* =========================================================================
   AUTHENTICATION API HANDLERS
   ========================================================================= */

async function handleApiRequest(req, res, pathname) {
    // 1. STEP 1: LOGIN (Credentials Verification with Salt & Pepper)
    if (pathname === '/api/auth/login' && req.method === 'POST') {
        const { username, password } = await parseRequestBody(req);

        if (!username || !password) {
            return sendJson(res, 400, {
                success: false,
                error: 'Please enter both username and password.'
            });
        }

        const users = getUsers();
        const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());

        if (!user) {
            return sendJson(res, 401, {
                success: false,
                error: 'Invalid credentials. Staff username not found.'
            });
        }

        // Verify password using user's unique salt and server pepper
        const computedHash = hashPassword(password, user.salt);
        if (computedHash !== user.hash) {
            return sendJson(res, 401, {
                success: false,
                error: 'Invalid credentials. Password does not match our records.'
            });
        }

        // STEP 1 PASSED: Generate 2-Step Authentication OTP
        const otp = generateOTP();
        const pendingToken = crypto.randomBytes(24).toString('hex');
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        const { maskedPhone, maskedEmail } = maskContact(user.phone, user.email);

        pendingSessions.set(pendingToken, {
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                staffId: user.staffId,
                email: user.email,
                phone: user.phone,
                salt: user.salt
            },
            otp,
            expiresAt,
            attempts: 0
        });

        // Log OTP dispatch to server terminal (simulation of SMS & Email delivery)
        logOTPDispatch(user, otp, false);

        return sendJson(res, 200, {
            success: true,
            requires2FA: true,
            pendingToken,
            user: {
                name: user.name,
                username: user.username,
                role: user.role,
                staffId: user.staffId,
                maskedPhone,
                maskedEmail
            },
            otpPreview: otp, // Passed for simulated in-browser dispatch notification
            expiresInSeconds: 300,
            message: `Step 1 verified! A 6-digit OTP code has been dispatched to ${maskedPhone} and ${maskedEmail}.`
        });
    }

    // 2. STEP 2: VERIFY OTP (Two-Step Authentication Verification)
    if (pathname === '/api/auth/verify-otp' && req.method === 'POST') {
        const { pendingToken, otp } = await parseRequestBody(req);

        if (!pendingToken || !otp) {
            return sendJson(res, 400, {
                success: false,
                error: 'Missing pending verification token or OTP code.'
            });
        }

        const pending = pendingSessions.get(pendingToken);
        if (!pending) {
            return sendJson(res, 401, {
                success: false,
                error: 'Verification session expired or invalid. Please log in again.'
            });
        }

        if (Date.now() > pending.expiresAt) {
            pendingSessions.delete(pendingToken);
            return sendJson(res, 401, {
                success: false,
                error: 'The 6-digit OTP code has expired. Please request a new code.'
            });
        }

        if (pending.attempts >= 5) {
            pendingSessions.delete(pendingToken);
            return sendJson(res, 403, {
                success: false,
                error: 'Too many incorrect attempts. Session invalidated for security. Please log in again.'
            });
        }

        if (pending.otp !== otp.toString().trim()) {
            pending.attempts++;
            const remaining = 5 - pending.attempts;
            return sendJson(res, 400, {
                success: false,
                error: `Incorrect OTP code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
            });
        }

        // 2-STEP VERIFICATION SUCCEEDED: Generate Active Session Token
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const sessionData = {
            user: pending.user,
            createdAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        };
        activeSessions.set(sessionToken, sessionData);
        pendingSessions.delete(pendingToken);

        console.log(`[AUTH SUCCESS] User ${pending.user.name} (${pending.user.username}) completed 2-Step Authentication.`);

        return sendJson(res, 200, {
            success: true,
            token: sessionToken,
            user: pending.user,
            message: 'Identity confirmed! Access granted to PUIT24210078 Hospital Management System.'
        });
    }

    // 3. RESEND OTP
    if (pathname === '/api/auth/resend-otp' && req.method === 'POST') {
        const { pendingToken } = await parseRequestBody(req);

        const pending = pendingSessions.get(pendingToken);
        if (!pending) {
            return sendJson(res, 400, {
                success: false,
                error: 'Session expired. Please log in again.'
            });
        }

        const newOtp = generateOTP();
        pending.otp = newOtp;
        pending.expiresAt = Date.now() + 5 * 60 * 1000;
        pending.attempts = 0;

        logOTPDispatch(pending.user, newOtp, true);

        return sendJson(res, 200, {
            success: true,
            otpPreview: newOtp,
            expiresInSeconds: 300,
            message: 'A fresh 6-digit verification code has been dispatched.'
        });
    }

    // 4. REGISTER NEW CLINICAL STAFF
    if (pathname === '/api/auth/register' && req.method === 'POST') {
        const { username, password, name, role, staffId, email, phone } = await parseRequestBody(req);

        if (!username || !password || !name || !role) {
            return sendJson(res, 400, {
                success: false,
                error: 'Please fill in all required fields (username, password, name, and role).'
            });
        }

        if (password.length < 8) {
            return sendJson(res, 400, {
                success: false,
                error: 'Password must be at least 8 characters long for clinical security standards.'
            });
        }

        const users = getUsers();
        if (users.some(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
            return sendJson(res, 409, {
                success: false,
                error: 'A staff member with this username already exists.'
            });
        }

        const salt = generateSalt();
        const hash = hashPassword(password, salt);

        const newUser = {
            id: `USR-${Date.now().toString().slice(-4)}`,
            username: username.trim(),
            name: name.trim(),
            role: role.trim(),
            staffId: staffId ? staffId.trim() : `PUIT-STF-${Math.floor(100 + Math.random() * 900)}`,
            email: email ? email.trim() : `${username.trim().toLowerCase()}@hospital.puit.edu.ng`,
            phone: phone ? phone.trim() : '+234 800 000 0000',
            salt: salt,
            hash: hash,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        console.log(`[USER REGISTRATION] New staff registered: ${newUser.name} (${newUser.username}) with unique 128-bit Salt.`);

        return sendJson(res, 201, {
            success: true,
            message: 'Staff account registered successfully with Salt & Pepper encryption. You can now login.'
        });
    }

    // 5. GET CURRENT AUTHENTICATED USER
    if (pathname === '/api/auth/me' && req.method === 'GET') {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();

        const session = activeSessions.get(token);
        if (!session || Date.now() > session.expiresAt) {
            return sendJson(res, 401, { success: false, error: 'Unauthorized or session expired.' });
        }

        return sendJson(res, 200, { success: true, user: session.user });
    }

    // 6. LOGOUT
    if (pathname === '/api/auth/logout' && req.method === 'POST') {
        const { token } = await parseRequestBody(req);
        if (token) activeSessions.delete(token);
        return sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
    }

    // 7. SECURITY SPECIFICATION INFO
    if (pathname === '/api/auth/security-info' && req.method === 'GET') {
        return sendJson(res, 200, {
            success: true,
            algorithm: 'PBKDF2-HMAC-SHA512',
            iterations: 10000,
            saltLengthBits: 128,
            pepperStatus: 'Active (Confidential Server Secret)',
            twoFactorAuth: 'Time-Based 6-digit OTP (5-minute expiry with brute-force throttling)',
            defenseFeatures: [
                'Rainbow Table Immunity via unique per-user 128-bit Salt',
                'Database Exfiltration Defense via secret application Pepper',
                'Device / Session hijack prevention via Two-Step OTP verification',
                'Attempt throttling (max 5 OTP retries before invalidation)'
            ]
        });
    }

    return sendJson(res, 404, { success: false, error: 'API endpoint not found.' });
}

/* =========================================================================
   SERVER CREATION & STATIC FILE SERVING
   ========================================================================= */

const server = http.createServer(async (req, res) => {
    // Basic CORS & headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let parsedUrl = req.url.split('?')[0];

    // Route API requests
    if (parsedUrl.startsWith('/api/')) {
        await handleApiRequest(req, res, parsedUrl);
        return;
    }

    // Default route
    if (parsedUrl === '/') {
        parsedUrl = '/index.html';
    }

    // Prevent direct access to users.json file over HTTP for security
    if (parsedUrl.toLowerCase().includes('users.json')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden: Direct access to credentials store is prohibited.');
        return;
    }

    const safeSuffix = path.normalize(parsedUrl).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(BASE_DIR, safeSuffix);

    // Prevent directory traversal
    if (!filePath.startsWith(BASE_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>404 Not Found</title></head>
                <body style="font-family:sans-serif; text-align:center; padding:50px;">
                    <h2>404 - File Not Found</h2>
                    <p>Requested: ${parsedUrl}</p>
                    <a href="/">Return to PUIT24210078 Hospital Management System</a>
                </body>
                </html>
            `);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

// Ensure default users are initialized
getUsers();

server.listen(PORT, () => {
    console.log('========================================================================');
    console.log('   🏥 PUIT24210078 HOSPITAL MANAGEMENT SYSTEM SECURE SERVER 🏥');
    console.log(`   Running at: http://localhost:${PORT}`);
    console.log('------------------------------------------------------------------------');
    console.log('   🔐 SECURITY ENGINE: ACTIVE');
    console.log('   🧂 Unique Per-User Salt: 128-bit Random Hex');
    console.log('   🌶 Confidential Server Pepper: PBKDF2-HMAC-SHA512 (10,000 Iterations)');
    console.log('   🔢 Two-Step Verification (2FA): Real-time 6-digit OTP Dispatch');
    console.log('------------------------------------------------------------------------');
    console.log('   PRE-CONFIGURED CLINICAL DEMO ACCOUNTS:');
    console.log('   1. Administrator : admin        / AdminPassword123!');
    console.log('   2. Senior Doctor : dr.adebayo   / DoctorPassword123!');
    console.log('   3. Triage Nurse  : nurse.chioma / NursePassword123!');
    console.log('========================================================================\n');
});

// Fallback in case port is in use
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        const altPort = Number(PORT) + 1;
        console.log(`Port ${PORT} in use, trying port ${altPort}...`);
        server.listen(altPort, () => {
            console.log(`PUIT24210078 HMS running at http://localhost:${altPort}`);
        });
    } else {
        console.error('Server error:', err);
    }
});
