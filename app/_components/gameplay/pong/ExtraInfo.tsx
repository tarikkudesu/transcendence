import React from 'react';
import { Text } from '@radix-ui/themes';

const GameInfo: React.FC = ({}) => {
	return (
		<>
			<div className="flex justify-around gap-4 items-center p-[28px] bg-dark-700 max-w-[700px] mx-auto my-6 rounded-md">
				<div className="">
					<Text as="div" size="3" className="text-golden-500 font-bold mb-2 flex justify-center">
						Player 1 (Left)
					</Text>
					<Text as="div" align="center" size="2" className="text-dark-100 flex justify-center mb-2">
						<div className="py-1 px-3 rounded-md bg-dark-600 text-white">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={14} width={14} className="translate-y-1">
								<path
									fill="currentColor"
									d="M52.8 98C69.3 91.8 87.8 100.2 94 116.7L204.2 410.7L289.3 119C293.3 105.3 305.8 96 320 96C334.2 96 346.7 105.4 350.7 119L435.8 410.7L546 116.8C552.2 100.3 570.6 91.9 587.2 98.1C603.8 104.3 612.2 122.7 606 139.2L462 523.2C457.2 536.1 444.6 544.5 430.8 543.9C417 543.3 405.1 534.1 401.3 520.9L320 242.3L238.7 521C234.8 534.2 222.9 543.5 209.2 544C195.5 544.5 182.9 536.2 178 523.3L34 139.2C27.8 122.7 36.2 104.2 52.8 98z"
								/>
							</svg>
						</div>
						<div className="py-1 px-3">Move Up</div>
					</Text>
					<Text as="div" align="center" size="2" className="text-dark-100 flex justify-center">
						<div className="py-1 px-3 rounded-md bg-dark-600 text-white">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={14} width={14} className="translate-y-1">
								<path
									fill="currentColor"
									d="M160 221.5C160 152.2 216.2 96 285.5 96L432 96C449.7 96 464 110.3 464 128C464 145.7 449.7 160 432 160L285.5 160C251.5 160 224 187.5 224 221.5C224 252.5 247.1 278.7 277.9 282.5L370.1 294C432.9 301.9 480 355.2 480 418.5C480 487.8 423.8 544 354.5 544L208 544C190.3 544 176 529.7 176 512C176 494.3 190.3 480 208 480L354.5 480C388.5 480 416 452.5 416 418.5C416 387.5 392.9 361.3 362.1 357.5L269.9 346C207.1 338.1 160 284.8 160 221.5z"
								/>
							</svg>
						</div>
						<div className="py-1 px-3">Move Down</div>
					</Text>
				</div>
				<div className="">
					<Text as="div" size="3" className="text-golden-500 font-bold mb-2 flex justify-center">
						Player 1 (Right)
					</Text>

					<Text as="div" align="center" size="2" className="text-dark-100 flex justify-center mb-2">
						<div className="py-1 px-3 rounded-md bg-dark-600 text-white">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={14} width={14} className="translate-y-1">
								<path
									fill="currentColor"
									d="M342.6 81.4C330.1 68.9 309.8 68.9 297.3 81.4L137.3 241.4C124.8 253.9 124.8 274.2 137.3 286.7C149.8 299.2 170.1 299.2 182.6 286.7L288 181.3L288 552C288 569.7 302.3 584 320 584C337.7 584 352 569.7 352 552L352 181.3L457.4 286.7C469.9 299.2 490.2 299.2 502.7 286.7C515.2 274.2 515.2 253.9 502.7 241.4L342.7 81.4z"
								/>
							</svg>
						</div>
						<div className="py-1 px-3">Move Up</div>
					</Text>
					<Text as="div" align="center" size="2" className="text-dark-100 flex justify-center">
						<div className="py-1 px-3 rounded-md bg-dark-600 text-white">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={14} width={14} className="translate-y-1">
								<path
									fill="currentColor"
									d="M297.4 566.6C309.9 579.1 330.2 579.1 342.7 566.6L502.7 406.6C515.2 394.1 515.2 373.8 502.7 361.3C490.2 348.8 469.9 348.8 457.4 361.3L352 466.7L352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 466.7L182.6 361.3C170.1 348.8 149.8 348.8 137.3 361.3C124.8 373.8 124.8 394.1 137.3 406.6L297.3 566.6z"
								/>
							</svg>
						</div>
						<div className="py-1 px-3">Move Down</div>
					</Text>
				</div>
			</div>

			<Text as="div" align="center" size="2" className="text-dark-300">
				First to 7 wins
			</Text>
		</>
	);
};

export default GameInfo;
