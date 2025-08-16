const StartCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<div className="bg-gray-800 rounded-md p-8 text-center border border-gray-700">
				<div className="bg-golden-500 p-4 rounded-full w-fit mx-auto mb-6">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 640"
						height={32}
						width={32}
						className="text-dark-950 translate-x-0.5"
					>
						<path
							fill="currentColor"
							d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
						/>
					</svg>
				</div>
				<h2 className="text-2xl font-bold text-gray-100 mb-4">Ready to Start?</h2>
				{children}
			</div>
		</div>
	);
};

export default StartCard;
