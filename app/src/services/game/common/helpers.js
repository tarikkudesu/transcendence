import crypto from 'crypto';
import * as Main from '../index.js';
export function generateHash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}
export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function transformFrame(f) {
    return {
        ...f,
        ballY: f.ballY,
        ballX: Main.PongWidth - f.ballX,
        ballRadius: f.ballRadius,
        paddleHeight: f.paddleHeight,
        paddleRadius: f.paddleRadius,
        leftPaddlePosY: f.rightPaddlePosY,
        rightPaddlePosY: f.leftPaddlePosY,
        leftPaddlePosX: Main.PongWidth - f.rightPaddlePosX,
        rightPaddlePosX: Main.PongWidth - f.leftPaddlePosX,
    };
}
