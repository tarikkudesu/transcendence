'use client';

import SafeImage from '@/app/_components/mini/SafeImage';
import { SvgOops } from '@/app/_svg/svg';

const ErrorPage: React.FC = () => {
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
				<SvgOops />
			</div>
		</>
	);
};

export default ErrorPage;
