import { Box, Grid } from '@radix-ui/themes';
import { useState } from 'react';

const Diamond: React.FC<unknown> = () => {
	const [active, setActive] = useState<boolean>(false);
	const className: string =
		'aspect-square bg-amber-700 hover:bg-amber-500 rounded-md xl:rounded-xl hover:border-b-8 border-amber-600 duration-100 demo-box cursor-pointer';
	const classNameActive: string = 'aspect-square bg-amber-950/80 rounded-md xl:rounded-xl cursor-pointer';

	return (
		<Box className={active ? classNameActive : className} onClick={() => setActive(!active)}>
			{active ? <img src="/src/assets/d.png" className="p-8 zoom-bounce" draggable="false" /> : ''}
		</Box>
	);
};

const Extra: React.FC<unknown> = () => {
	return (
		<>
			<div className="parent">
				<div className="div1"></div>
				<div className="div2">
					<Grid columns="4" rows="4" gap="8">
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
						<Diamond />
					</Grid>
				</div>
				<div className="div3"></div>
			</div>
		</>
	);
};

export default Extra;
