'use client';
'use client';

import { useEffect } from 'react';
// import { AlertTriangle, RefreshCw, Home, ChevronLeft } from 'lucide-react';


interface ErrorProps {
	error?: Error & { digest?: string };
	reset?: () => void;
	statusCode?: number;
	hasGetInitialPropsRan?: boolean;
	err?: Error;
}

export default function Error({ error, reset, statusCode }: ErrorProps) {
	useEffect(() => {
		// Log the error to an error reporting service
		if (error) {
			console.error('Error boundary caught an error:', error);
		}
	}, [error]);

	// Determine error type and messaging
	const getErrorInfo = () => {
		if (statusCode === 404) {
			return {
				title: 'Page Not Found',
				description: "The page you're looking for doesn't exist or has been moved.",
				suggestion: 'Check the URL or return to the homepage.',
			};
		}

		if (statusCode === 500) {
			return {
				title: 'Internal Server Error',
				description: "Something went wrong on our end. We're working to fix this issue.",
				suggestion: 'Try refreshing the page or contact support if the problem persists.',
			};
		}

		if (statusCode === 403) {
			return {
				title: 'Access Forbidden',
				description: "You don't have permission to access this resource.",
				suggestion: 'Please check your credentials or contact an administrator.',
			};
		}

		// Default error for client-side errors or unknown status codes
		return {
			title: 'Something Went Wrong',
			description: error?.message || 'An unexpected error occurred while processing your request.',
			suggestion: 'Try refreshing the page. If the problem continues, please contact support.',
		};
	};

	const { title, description, suggestion } = getErrorInfo();

	const handleGoBack = () => {
		if (typeof window !== 'undefined') {
			window.history.back();
		}
	};

	const handleGoHome = () => {
		if (typeof window !== 'undefined') {
			window.location.href = '/';
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-950 flex items-center justify-center p-4">
			<div className="max-w-2xl w-full">
				{/* Error Icon */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
						{/* <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" /> */}
						ICON
					</div>

					{/* Status Code */}
					{statusCode && <div className="text-6xl font-bold text-dark-300 mb-2">{statusCode}</div>}
				</div>

				{/* Error Content */}
				<div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-8 border border-dark-200 dark:border-dark-700">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-4">{title}</h1>
						<p className="text-lg text-dark-600 dark:text-dark-300 mb-2">{description}</p>
						<p className="text-dark-500 dark:text-dark-400">{suggestion}</p>
					</div>

					{/* Error Details (Development only) */}
					{process.env.NODE_ENV === 'development' && error && (
						<div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
							<h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">Error Details (Development)</h3>
							<p className="text-sm text-red-700 dark:text-red-400 font-mono break-all">{error.message}</p>
							{error.digest && <p className="text-xs text-red-600 dark:text-red-500 mt-2">Error ID: {error.digest}</p>}
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						{reset && (
							<button
								onClick={reset}
								className="inline-flex items-center justify-center px-6 py-3 bg-accent-300 hover:bg-accent-400 text-dark-900 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2 focus:ring-offset-dark-900"
							>
								{/* <RefreshCw className="w-5 h-5 mr-2" /> */}
								ICON
								Try Again
							</button>
						)}

						<button
							onClick={handleGoBack}
							className="inline-flex items-center justify-center px-6 py-3 bg-dark-600 hover:bg-dark-500 text-dark-100 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-500 focus:ring-offset-2 focus:ring-offset-dark-900"
						>
							{/* <ChevronLeft className="w-5 h-5 mr-2" /> */}
							ICON
							Go Back
						</button>

						<button
							onClick={handleGoHome}
							className="inline-flex items-center justify-center px-6 py-3 bg-dark-700 hover:bg-dark-600 text-dark-100 font-semibold rounded-lg border border-dark-600 hover:border-dark-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-500 focus:ring-offset-2 focus:ring-offset-dark-900"
						>
							{/* <Home className="w-5 h-5 mr-2" /> */}
							ICON
							Home
						</button>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-sm text-dark-400">
						If this problem persists, please{' '}
						<a href="/contact" className="text-accent-300 hover:text-accent-200 underline transition-colors duration-200">
							contact support
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

// For use as a custom _error.js page (Pages Router)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Error.getInitialProps = ({ res, err }: { res?: any; err?: any }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};
