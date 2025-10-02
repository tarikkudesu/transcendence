'use client';

import SafeImage from '@/app/_components/mini/SafeImage';
import { SvgNoyhing } from '@/app/_svg/svg';

const ErrorPage: React.FC = () => {
	return (
		<>
			<div className="relative mx-auto w-[800px] h-[800px] overflow-hidden rounded-md">
				<SafeImage
					fill
					priority
					draggable={false}
					src="/arena.jpeg"
					fallbackSrc=""
					alt="cover image"
					className="opacity-5 object-cover"
				/>
				<SvgNoyhing />
			</div>
		</>
	);
};

export default ErrorPage;
