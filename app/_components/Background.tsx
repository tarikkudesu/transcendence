'use client';

import { usePathname } from 'next/navigation';
import { getBackground } from './mini/getBackground';
import SafeImage from './mini/SafeImage';

export default function Background() {
	const pathname = usePathname();
	const bgImage = getBackground(pathname);

	return (
		<SafeImage
			fill
			priority
			src={bgImage}
			fallbackSrc=""
			alt="cover image"
			className="opacity-[0.05]"
			style={{ objectFit: 'cover', objectPosition: 'top' }}
		/>
	);
}
