import { SvgInfo } from '@/app/_svg/svg';

const Error: React.FC<{
	message?: string;
	className?: string;
}> = ({ message = 'Something went wrong. Please try again.', className = '' }) => {
	return (
		<div className={`flex items-center justify-center p-4 rounded-md border border-red-700/50 ${className}`}>
			<div className="flex items-center space-x-3 text-red-700">
				<SvgInfo size={36} />
				<p className="text-sm font-medium">{message}</p>
			</div>
		</div>
	);
};

export default Error;
