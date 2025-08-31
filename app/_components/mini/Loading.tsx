import { SvgPongLoading } from '@/app/_svg/svg';

function LoadingIndicator() {
	return (
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<SvgPongLoading />
		</div>
	);
}

export function Spinner(): React.ReactNode {
	return (
		<div className="text-accent-300 w-full">
			<SvgPongLoading />
		</div>
	);
}

export default LoadingIndicator;
