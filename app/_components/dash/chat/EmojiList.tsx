import React from 'react';

interface EmojiListProps {
	set: (e: string) => void;
}

const EmojiList: React.FC<EmojiListProps> = ({ set }) => {
	const emojis: string[] = [
		'😀',
		'😃',
		'😄',
		'😁',
		'😆',
		'😅',
		'🤣',
		'😂',
		'🙂',
		'🙃',
		'😉',
		'😊',
		'😇',
		'🥰',
		'😍',
		'🤩',
		'😘',
		'😗',
		'😚',
		'😙',
		'😋',
		'😛',
		'😜',
		'🤪',
		'😝',
		'🤑',
		'🤗',
		'🤭',
		'🤫',
		'🤔',
		'🤐',
		'🤨',
		'😐',
		'😑',
		'😶',
		'😏',
		'😒',
		'🙄',
		'😬',
		'😮',
		'🤥',
		'💔',
	];

	return (
		<div className="bg-dark-900 p-3 w-[300px] rounded-lg absolute bottom-[70px] left-[10px] shadow-lg border border-dark-600">
			<div className=""></div>
			<div className="grid grid-cols-6 gap-2 select-none">
				{emojis.map((ele, index) => (
					<div
						key={index}
						className="w-10 h-10 flex justify-center items-center rounded-md hover:bg-dark-700 transition-colors cursor-pointer text-xl"
						onClick={() => set(ele)}
					>
						<div className="translate-y-0.5">{ele}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default EmojiList;
