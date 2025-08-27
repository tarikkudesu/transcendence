export const getBackground = (pathname: string): string => {
	if (pathname.includes('pong')) return '/local.png';
	if (pathname.includes('doom')) return '/local.png';
	if (pathname.includes('tournament')) return '/local.png';
	// if (pathname.includes('leaderboard')) return '/local.png'
	// if (pathname.includes('chat')) return '/local.png'
	// if (pathname.includes('playground')) return '/local.png'
	// if (pathname.includes('/main/')) return '/local.png'
	return '/local.png';
};
