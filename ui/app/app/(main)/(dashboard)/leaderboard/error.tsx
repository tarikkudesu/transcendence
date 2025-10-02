'use client';

import SafeImage from '@/app/_components/mini/SafeImage';
import { SvgOops } from '@/app/_svg/svg';

const ErrorPage: React.FC = () => {
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
				<SvgOops />
			</div>
		</>
	);
};

export default ErrorPage;
