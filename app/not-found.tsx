import React from 'react';
import SafeImage from './_components/mini/SafeImage';
import { Svg404 } from './_svg/svg';

const Page404: React.FC = () => {
	return (
		<>
			<SafeImage
				priority
				src="/arena.jpeg"
				fallbackSrc=""
				alt="cover image"
				fill
				className="opacity-5"
				style={{ objectFit: 'cover' }}
			/>
			<div className="relative h-screen">
				<Svg404 />
			</div>
		</>
	);
};

export default Page404;
