'use client';

import SafeImage from '@/app/_components/mini/SafeImage';
import { ToastContainer } from 'react-toastify';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const contextClass = {
		success: 'bg-dark-900 border-l-accent-300',
		error: 'bg-dark-900 border-l-red-600',
		info: 'bg-dark-900 border-l-blue-500',
		warning: 'bg-dark-900 border-l-orange-600',
		default: 'bg-dark-900 border-l-accent-300',
		dark: 'bg-dark-900 border-l-accent-300',
	};
	return (
		<>
			<SafeImage priority src="/arena.jpeg" fallbackSrc="" alt="cover image" fill className="opacity-5 object-cover" />
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				toastClassName={(context) =>
					contextClass[context?.type || 'default'] +
					' py-8 px-4 mt-1 rounded-md w-[500px] text-left border border-dark-500 border-l-4 border-l-accent-300 flex justify-start'
				}
				closeButton={false}
			/>
			{children}
		</>
	);
}
