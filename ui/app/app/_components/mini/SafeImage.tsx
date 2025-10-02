'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type Props = ImageProps & { fallbackSrc: string; alt: string };

export default function SafeImage({ fallbackSrc, alt, ...props }: Props) {
	const [src, setSrc] = useState(props.src);
	if (!src) return <Image {...props} src="/Logo.png" alt={alt} />;
	return <Image {...props} src={src} alt={alt} draggable={false} onError={() => setSrc(fallbackSrc)} />;
}
