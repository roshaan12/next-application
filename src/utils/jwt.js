import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Adjust expiration time as needed
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
