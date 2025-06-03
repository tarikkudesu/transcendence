import { Box, Flex, Grid, Text } from '@radix-ui/themes';
import { useContext, useEffect } from 'react';
import { EngageMessage, WS, WSC, wsContext } from '../Hooks/ws-client';
import { Lost, Start, Stop, Won } from './Server';
import { useNavigate, useParams } from 'react-router-dom';

interface DiamondProps {
	state: string;
	index: number;
}

const Diamond: React.FC<DiamondProps> = ({ state, index }) => {
	const { send, hash } = useContext(wsContext);
	const { game } = useParams();
	const className: string =
		'aspect-square bg-amber-700 hover:bg-amber-500 rounded-md xl:rounded-xl hover:border-b-8 border-amber-600 duration-100 demo-box cursor-pointer';
	const classNameActive: string = 'aspect-square bg-amber-950/80 rounded-md xl:rounded-xl cursor-pointer';

	return (
		<Box
			className={state !== 'C' ? classNameActive : className}
			onClick={() => {
				if (state === 'C') send(WS.FlipMessage(WSC.username, hash, 'card of doom', game ? game : '', index));
			}}
		>
			{state !== 'C' ? (
				<img src={state === 'B' ? '/src/assets/bomb_b.png' : '/src/assets/d.png'} className="p-8 zoom-bounce" draggable="false" />
			) : (
				''
			)}
		</Box>
	);
};

interface GameFrameElementProps {
	cards: string[];
}
const GameFrameElement: React.FC<GameFrameElementProps> = ({ cards }) => {
	return (
		<>
			<Grid columns="5" rows="5" gap="8">
				{cards.map((elem, index) => (
					<Diamond state={elem} index={index} key={index} />
				))}
			</Grid>
		</>
	);
};

const Extra: React.FC<unknown> = () => {
	const { send, hash, doom } = useContext(wsContext);
	const { game } = useParams();
	const navigate = useNavigate();

	function Content(): React.ReactNode {
		if (doom.stop) return <Stop />;
		if (!doom.start) return <Start />;
		return (
			<>
				{doom.lost ? <Lost /> : ''}
				{doom.won ? <Won /> : ''}
				<GameFrameElement cards={doom.cards} />
			</>
		);
	}

	useEffect(function () {
		if (game) send(EngageMessage(WSC.username, hash, 'card of doom', game ? game : '')); // ! needs more thinking
		else navigate(-1);
	}, []);

	return (
		<>
			<div className="parent">
				<div className="div1"></div>
				<div className="div2 min-h-100 relative overflow-hidden">{Content()}</div>
				<div className="div3"></div>
			</div>
		</>
	);
};

export default Extra;
