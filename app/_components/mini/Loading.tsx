import { SvgSpinner } from '@/app/_svg/svg';

interface LoadingIndicatorProps {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

function LoadingIndicator({ size = 'md', className = '' }: LoadingIndicatorProps) {
	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8',
		lg: 'w-12 h-12',
	};

	const dotSizes = {
		sm: 'w-2 h-2',
		md: 'w-3 h-3',
		lg: 'w-4 h-4',
	};

	return (
		<div className={`${sizeClasses[size]} ${className} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}>
			<div className="relative w-full h-full animate-spin-reverse">
				<div className={`animate-spin absolute bottom-0 left-0 ${dotSizes[size]} bg-accent-400 opacity-25`}></div>
				<div className={`animate-spin absolute bottom-0 right-0 ${dotSizes[size]} bg-accent-400 opacity-50`}></div>
				<div className={`animate-spin absolute top-0 right-0 ${dotSizes[size]} bg-accent-400 opacity-75`}></div>
				<div className={`animate-spin absolute top-0 left-0 ${dotSizes[size]} bg-accent-400`}></div>
			</div>
		</div>
	);
}

export function Spinner(): React.ReactNode {
	return (
		<div className="text-accent-300 w-full">
			<SvgSpinner size={24} className="animate-spin mx-auto my-4" />
		</div>
	);
}

export default LoadingIndicator;
