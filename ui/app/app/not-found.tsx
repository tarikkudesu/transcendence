import React from 'react';
import SafeImage from './_components/mini/SafeImage';
import { Svg404 } from './_svg/svg';

const Page404: React.FC = () => {
	return (
		<>
			<SafeImage
				fill
				priority
				src="/arena.jpeg"
				fallbackSrc=""
				alt="cover image"
				className="opacity-5 object-cover"
			/>
			<div className="relative h-screen">
				<Svg404 />
			</div>
		</>
	);
};

export default Page404;
