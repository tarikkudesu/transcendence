import { Button } from '@radix-ui/themes';

export function SoudButtonOn({ onClick }: { onClick: () => void }): React.ReactNode {
	return (
		<Button onClick={onClick} radius="small" size="3" className="px-4 py-2.5 bg-dark-500 text-center text-dark-100">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={18} width={18}>
				<path
					fill="currentColor"
					d="M533.6 96.5C523.3 88.1 508.2 89.7 499.8 100C491.4 110.3 493 125.4 503.3 133.8C557.5 177.8 592 244.8 592 320C592 395.2 557.5 462.2 503.3 506.3C493 514.7 491.5 529.8 499.8 540.1C508.1 550.4 523.3 551.9 533.6 543.6C598.5 490.7 640 410.2 640 320C640 229.8 598.5 149.2 533.6 96.5zM473.1 171C462.8 162.6 447.7 164.2 439.3 174.5C430.9 184.8 432.5 199.9 442.8 208.3C475.3 234.7 496 274.9 496 320C496 365.1 475.3 405.3 442.8 431.8C432.5 440.2 431 455.3 439.3 465.6C447.6 475.9 462.8 477.4 473.1 469.1C516.3 433.9 544 380.2 544 320.1C544 260 516.3 206.3 473.1 171.1zM412.6 245.5C402.3 237.1 387.2 238.7 378.8 249C370.4 259.3 372 274.4 382.3 282.8C393.1 291.6 400 305 400 320C400 335 393.1 348.4 382.3 357.3C372 365.7 370.5 380.8 378.8 391.1C387.1 401.4 402.3 402.9 412.6 394.6C434.1 376.9 448 350.1 448 320C448 289.9 434.1 263.1 412.6 245.5zM80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416z"
				/>
			</svg>
			Sound On
		</Button>
	);
}
export function SoudButtonOff({ onClick }: { onClick: () => void }): React.ReactNode {
	return (
		<Button onClick={onClick} radius="small" size="3" className="px-4 py-2.5 bg-dark-500 text-center text-dark-100">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={18} width={18}>
				<path
					fill="currentColor"
					d="M80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416zM399 239C389.6 248.4 389.6 263.6 399 272.9L446 319.9L399 366.9C389.6 376.3 389.6 391.5 399 400.8C408.4 410.1 423.6 410.2 432.9 400.8L479.9 353.8L526.9 400.8C536.3 410.2 551.5 410.2 560.8 400.8C570.1 391.4 570.2 376.2 560.8 366.9L513.8 319.9L560.8 272.9C570.2 263.5 570.2 248.3 560.8 239C551.4 229.7 536.2 229.6 526.9 239L479.9 286L432.9 239C423.5 229.6 408.3 229.6 399 239z"
				/>
			</svg>
			Sound Off
		</Button>
	);
}
export function PlayButton({ onClick }: { onClick: () => void }): React.ReactNode {
	return (
		<Button onClick={onClick} radius="small" size="3" className="px-4 py-2.5 bg-accent-300 text-center">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={18} width={18}>
				<path
					fill="currentColor"
					d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
				/>
			</svg>
			Play
		</Button>
	);
}
export function StartButton({ onClick }: { onClick: () => void }): React.ReactNode {
	return (
		<Button onClick={onClick} radius="small" size="3" className="px-4 py-2.5 bg-accent-300 text-center">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={18} width={18}>
				<path
					fill="currentColor"
					d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
				/>
			</svg>
			Start
		</Button>
	);
}

export function PauseButton({ onClick }: { onClick: () => void }): React.ReactNode {
	return (
		<Button onClick={onClick} radius="small" size="3" className="px-4 py-2.5 bg-accent-300 text-center">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={18} width={18}>
				<path
					fill="currentColor"
					d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"
				/>
			</svg>
			Pause
		</Button>
	);
}
export function ResetButton({ onClick }: { onClick: () => void }): React.ReactNode {
	return (
		<Button onClick={onClick} radius="small" size="3" className="bg-dark-500 text-center text-dark-100">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={18} width={18}>
				<path
					fill="currentColor"
					d="M552 256L408 256C398.3 256 389.5 250.2 385.8 241.2C382.1 232.2 384.1 221.9 391 215L437.7 168.3C362.4 109.7 253.4 115 184.2 184.2C109.2 259.2 109.2 380.7 184.2 455.7C259.2 530.7 380.7 530.7 455.7 455.7C463.9 447.5 471.2 438.8 477.6 429.6C487.7 415.1 507.7 411.6 522.2 421.7C536.7 431.8 540.2 451.8 530.1 466.3C521.6 478.5 511.9 490.1 501 501C401 601 238.9 601 139 501C39.1 401 39 239 139 139C233.3 44.7 382.7 39.4 483.3 122.8L535 71C541.9 64.1 552.2 62.1 561.2 65.8C570.2 69.5 576 78.3 576 88L576 232C576 245.3 565.3 256 552 256z"
				/>
			</svg>
			Reset
		</Button>
	);
}
