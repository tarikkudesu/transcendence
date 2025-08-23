import { ClientPong } from '@/app/_service/ws/game';

export const PongWidth = 800;
export const PongHeight = 600;

class Pong {
	sound: boolean = false;
	canvas: HTMLCanvasElement | null = null;
	ctx: CanvasRenderingContext2D | null = null;
	updateWinner: (w: string) => void = (w: string) => void w;
	keyUp: (e: KeyboardEvent) => void = (e: KeyboardEvent) => void e;
	keyDown: (e: KeyboardEvent) => void = (e: KeyboardEvent) => void e;
	setup(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		keyUp: (e: KeyboardEvent) => void = (e: KeyboardEvent) => void e,
		keyDown: (e: KeyboardEvent) => void = (e: KeyboardEvent) => void e
	): void {
		if (!canvas || !ctx) return;
		this.canvas = canvas;
		this.ctx = ctx;
		this.keyUp = keyUp;
		this.keyDown = keyDown;
		document.addEventListener('keyup', this.keyUp);
		document.addEventListener('keydown', this.keyDown);
	}
	clear() {
		document.removeEventListener('keyup', this.keyUp);
		document.removeEventListener('keydown', this.keyDown);
	}
	updateSound(state: boolean) {
		this.sound = state;
	}
	drawRightPaddles(pong: ClientPong) {
		if (this.ctx === null) return;
		this.ctx.beginPath();
		this.ctx.fillStyle = '#b3ec4b';
		this.ctx.rect(
			pong.rightPaddlePosX - pong.paddleRadius,
			pong.rightPaddlePosY - pong.paddleHeight / 2,
			pong.paddleRadius * 2,
			pong.paddleHeight
		);
		this.ctx.fill();
		this.ctx.beginPath();
	}
	drawLeftPaddles(pong: ClientPong) {
		if (this.ctx === null) return;
		this.ctx.fillStyle = '#b3ec4b';
		this.ctx.rect(
			pong.leftPaddlePosX - pong.paddleRadius,
			pong.leftPaddlePosY - pong.paddleHeight / 2,
			pong.paddleRadius * 2,
			pong.paddleHeight
		);
		this.ctx.fill();
		this.ctx.beginPath();
	}
	drawBall(pong: ClientPong) {
		if (this.ctx === null) return;
		this.ctx.fillStyle = '#b3ec4b';
		this.ctx.rect(pong.ballX - pong.ballRadius, pong.ballY - pong.ballRadius, pong.ballRadius * 2, pong.ballRadius * 2);
		this.ctx.fill();
		this.ctx.beginPath();
	}
	drawSep() {
		if (this.ctx === null) return;
		this.ctx.save();
		this.ctx.setLineDash([5, 5]);
		this.ctx.strokeStyle = '#b3ec4b';
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		this.ctx.moveTo(PongWidth / 2, 0);
		this.ctx.lineTo(PongWidth / 2, PongHeight);
		this.ctx.stroke();
		this.ctx.restore();
	}
	drawCircle() {
		if (this.ctx === null) return;
		this.ctx.save();
		this.ctx.setLineDash([5, 5]);
		this.ctx.strokeStyle = '#b3ec4b';
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		this.ctx.arc(PongWidth / 2, PongHeight / 2, 50, 0, Math.PI * 2);
		this.ctx.stroke();
		this.ctx.restore();
	}
	drawScore(pong: ClientPong) {
		if (this.ctx === null) return;
		this.ctx.font = 'bold 64px monospace';
		this.ctx.fillStyle = '#ffffff';
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillText(pong.opponentScore.toString(), PongWidth / 2 - 100, 70);
		this.ctx.fillText(pong.playerScore.toString(), PongWidth / 2 + 100, 70);
	}
	playSounds(sound: number) {
		if (sound === 1 || sound === 2) {
			const audio = new Audio('/audio/arena-hit.mp3');
			audio.play();
		}
		if (sound === 3 || sound === 4) {
			const audio = new Audio('/audio/arena-out.mp3');
			audio.play();
		}
	}
	draw(pong: ClientPong) {
		if (this.ctx === null || this.canvas === null) return;
		this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
		this.drawCircle();
		this.drawSep();
		this.drawBall(pong);
		this.drawRightPaddles(pong);
		this.drawLeftPaddles(pong);
		this.drawScore(pong);
		if (this.sound) this.playSounds(pong.sound);
	}
}

export default Pong;
