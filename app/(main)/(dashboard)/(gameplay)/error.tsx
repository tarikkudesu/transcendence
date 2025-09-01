'use client';

import SafeImage from '@/app/_components/mini/SafeImage';
import { SvgNoyhing } from '@/app/_svg/svg';

const ErrorPage: React.FC = () => {
	return (
		<>
			<div className="relative mx-auto w-[800px] h-[800px] overflow-hidden rounded-md">
				<SafeImage
					priority
					draggable={false}
					src="/arena.jpeg"
					fallbackSrc=""
					alt="cover image"
					fill
					className="opacity-5"
					style={{ objectFit: 'cover' }}
				/>
				<SvgNoyhing />
			</div>
		</>
	);
};

export default ErrorPage;
