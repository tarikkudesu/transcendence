import crypto from 'crypto';
export function generateHash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}
export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
