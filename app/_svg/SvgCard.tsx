import * as React from 'react';

const SvgCard: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={140}
		height={148}
		fill="none"
		{...props}
		className="group cursor-pointer hover:scale-105 duration-100"
	>
		<rect width={140} height={140} y={6} fill="#ED3803" rx={16} />
		<rect width={140} height={130.859} fill="#FF6B3A" rx={16} className="group-hover:translate-y-[5px] duration-150" />
		<path
			fill="#FF7B4F"
			d="M124 0c8.837 0 16 7.163 16 16v24.253C122.183 69.35 90.962 102.274 35.278 117.34 19.536 121.6 8.078 120.652 0 115.989V16C0 7.163 7.163 0 16 0h108Z"
			className="group-hover:translate-y-[5px] duration-150"
		/>
		<path
			fill="#ED3803"
			d="M56.683 50.847a2.275 2.275 0 0 1 1.845-.977h22.944a2.25 2.25 0 0 1 1.845.977L94.025 66c.65.917.583 2.183-.144 3.03l-22.18 25.524a2.254 2.254 0 0 1-1.701.787 2.27 2.27 0 0 1-1.702-.787l-22.18-25.523A2.471 2.471 0 0 1 45.976 66l10.708-15.154Zm3.68 3.968a.819.819 0 0 0-.2 1.047l5.487 9.54-14.073 1.217c-.391.03-.697.379-.697.798a.79.79 0 0 0 .697.797l18.356 1.595h.124l18.356-1.595c.392-.03.698-.379.698-.797a.79.79 0 0 0-.698-.798L74.34 65.393l5.488-9.532a.817.817 0 0 0-.2-1.046.753.753 0 0 0-1.024.1L70 64.644l-8.614-9.73a.753.753 0 0 0-1.023-.1Z"
			className="group-hover:translate-y-[5px] duration-150 animate-pulse"
		/>
	</svg>
);

export default SvgCard;
