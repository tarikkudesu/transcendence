import MyDashboardProfile from '@/app/_components/dash/MyProfile';
import { Box, Flex } from '@radix-ui/themes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'YingYangPong',
	description: '',
	icons: {
		icon: '/favicon.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="mx-[50px] relative">
			<div className="w-full h-[150px] fixed top-0 left-0 right-0 bg-dark-700 -z-10"></div>
			<Flex justify="between" gap="8">
				<section className="bg-dark-950 w-[250px] p-4 rounded-md">
					<MyDashboardProfile />
					<Box height="36px" />
					<div className="flex flex-col gap-2">
						<div className="py-3 px-4 text-sm font-bold text-dark-100 hover:bg-dark-800 rounded-md hover:text-accent-300 flex justify-start items-center gap-4 cursor-pointer">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={20} width={20}>
								<path
									fill="currentColor"
									d="M161 191L228.4 123.6C266.6 85.4 318.4 64 372.4 64C484.9 64 576.1 155.2 576.1 267.6C576.1 314 560.3 358.7 531.6 394.6C508 377.8 479.2 367.9 448.1 367.9C417 367.9 388.2 377.8 364.7 394.5L161 191zM304 512C304 521.7 305 531.1 306.8 540.2C287 535 268.8 524.7 254.1 510C241.9 497.8 222.2 497.8 210 510L160.6 559.4C150 570 135.6 576 120.6 576C89.4 576 64 550.7 64 519.4C64 504.4 70 490 80.6 479.4L130 430C142.2 417.8 142.2 398.1 130 385.9C108.3 364.2 96.1 334.7 96.1 304C96.1 274.6 107.2 246.4 127.2 225L330.6 428.6C313.9 452.1 304 480.9 304 512zM448 416C501 416 544 459 544 512C544 565 501 608 448 608C395 608 352 565 352 512C352 459 395 416 448 416z"
								/>
							</svg>
							Ping Pong
						</div>
						<div className="py-3 px-4 text-sm font-bold text-dark-100 hover:bg-dark-800 rounded-md hover:text-accent-300 flex justify-start items-center gap-4 cursor-pointer">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={20} width={20}>
								<path
									fill="currentColor"
									d="M180.7 97.8C185.2 91.7 192.4 88 200 88L440 88C447.6 88 454.8 91.6 459.3 97.8L571.3 249.8C578.1 259 577.4 271.7 569.8 280.2L337.8 536.2C333.3 541.2 326.8 544.1 320 544.1C313.2 544.1 306.8 541.2 302.2 536.2L70.2 280.2C62.5 271.7 61.9 259 68.7 249.8L180.7 97.8zM219.2 137.6C215.9 140.1 215 144.6 217.1 148.1L274.5 243.8L127.3 256C123.2 256.3 120 259.8 120 264C120 268.2 123.2 271.6 127.3 272L319.3 288C319.7 288 320.2 288 320.6 288L512.6 272C516.7 271.7 519.9 268.2 519.9 264C519.9 259.8 516.7 256.4 512.6 256L365.4 243.7L422.8 148.1C424.9 144.6 424 140 420.7 137.6C417.4 135.2 412.8 135.6 410 138.6L320 236.2L229.9 138.6C227.1 135.6 222.5 135.2 219.2 137.6z"
								/>
							</svg>
							Doom Cards
						</div>
						<div className="py-3 px-4 text-sm font-bold text-dark-100 hover:bg-dark-800 rounded-md hover:text-accent-300 flex justify-start items-center gap-4 cursor-pointer">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={20} width={20}>
								<path
									fill="currentColor"
									d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z"
								/>
							</svg>
							Friends
						</div>
						<div className="py-3 px-4 text-sm font-bold text-dark-100 hover:bg-dark-800 rounded-md hover:text-accent-300 flex justify-start items-center gap-4 cursor-pointer">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={20} width={20}>
								<path
									fill="currentColor"
									d="M416 208C416 305.2 330 384 224 384C197.3 384 171.9 379 148.8 370L67.2 413.2C57.9 418.1 46.5 416.4 39 409C31.5 401.6 29.8 390.1 34.8 380.8L70.4 313.6C46.3 284.2 32 247.6 32 208C32 110.8 118 32 224 32C330 32 416 110.8 416 208zM416 576C321.9 576 243.6 513.9 227.2 432C347.2 430.5 451.5 345.1 463 229.3C546.3 248.5 608 317.6 608 400C608 439.6 593.7 476.2 569.6 505.6L605.2 572.8C610.1 582.1 608.4 593.5 601 601C593.6 608.5 582.1 610.2 572.8 605.2L491.2 562C468.1 571 442.7 576 416 576z"
								/>
							</svg>
							Chat
						</div>
					</div>
					<Box height="180px" />
				</section>
				<section className="flex-grow p-4 mt-[80px] rounded-md">{children}</section>
			</Flex>
		</div>
	);
}
