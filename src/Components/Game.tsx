import { Box } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

const Game: React.FC<unknown> = () => {
	const [pos, setPos] = useState<number>(0);

	const [up, setUp] = useState<boolean>(false);
	const [down, setDown] = useState<boolean>(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			console.log(e.code);
			if (e.code === 'ArrowDown') setDown(true);
			if (e.code === 'ArrowUp') setUp(true);
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			console.log(e.code);
			if (e.code === 'ArrowDown') setDown(false);
			if (e.code === 'ArrowUp') setUp(false);
		};
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	useEffect(
		function () {
			if (up) setPos(pos + 10);
		},
		[up]
	);

	useEffect(
		function () {
			if (down) setPos(pos + 10);
		},
		[down]
	);

	return (
		<>
			<div className="h-12"></div>
			<Box className="max-w-300 min-h-200 mx-auto bg-gray-950/50 relative">
				<Box id="paddle" className="w-4 h-12 bg-amber-400 absolute" style={{ top: pos }}></Box>
			</Box>
		</>
	);
};

export default Game;
