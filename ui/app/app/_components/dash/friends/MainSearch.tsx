'use client';

import client from '@/app/_service/axios/client';
import { FriendSearch } from '@/app/_service/schema';
import { ScrollArea } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, memo, useCallback, useState } from 'react';
import { Spinner } from '../../mini/Loading';
import SafeImage from '../../mini/SafeImage';
import { User } from '../game/User';

const Search: React.FC<{ search: string; clear: () => void }> = memo(({ search, clear }) => {
	const router = useRouter();
	const fetchData = (): Promise<FriendSearch[]> =>
		client.get(`/friends/u/${encodeURIComponent(search)}`).then((response) => response.data);
	const { data, isPending } = useQuery({
		queryKey: [`friendsu${encodeURIComponent(search)}`],
		queryFn: fetchData,
	});

	if (isPending)
		return (
			<div className="py-2 rounded-md bg-dark-950 absolute top-0 left-0 translate-y-[60px] w-[400px] text-white shadow-xl z-10 border border-dark-500">
				<Spinner />
			</div>
		);

	if (!data || data.length === 0) return null;

	return (
		<>
			{
				<div className="py-2 rounded-md bg-dark-950 absolute top-0 left-0 translate-y-[60px] w-[400px] text-white shadow-xl z-10 border border-dark-500">
					<ScrollArea type="always" scrollbars="vertical" style={{ maxHeight: 600 }}>
						{data.map((ele) => (
							<div
								key={ele.username}
								className="py-1 cursor-pointer hover:bg-dark-700"
								onClick={() => {
									clear();
									router.push(`/profile/${ele.username}`);
								}}
							>
								<div className="scale-90">
									<User.Trigger username={ele.username} avatar={ele.avatar_url} extra="" />
								</div>
							</div>
						))}
					</ScrollArea>
				</div>
			}
		</>
	);
});

Search.displayName = 'Search';

interface SearchInputProps {
	setSearch: (s: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = memo(({ setSearch }) => {
	const [temp, setTemp] = useState<string>('');

	const handleEnter = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.code === 'Enter' || e.code === 'NumpadEnter') setSearch(temp);
		},
		[setSearch, temp]
	);

	const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setTemp(e.target.value);
	}, []);

	return (
		<>
			<svg
				width={20}
				height={20}
				viewBox="0 0 640 640"
				xmlns="http://www.w3.org/2000/svg"
				className="text-dark-200 mx-3 absolute top-1/2 left-0 -translate-y-1/2"
			>
				<path
					fill="currentColor"
					d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"
				/>
			</svg>
			<input
				required
				maxLength={40}
				value={temp}
				autoComplete="off"
				placeholder="Search..."
				onKeyDown={handleEnter}
				className="w-full outline-none pr-3 pb-2 pt-2.5 pl-10 text-sm text-white rounded-md bg-transparent"
				onChange={onChange}
				type="text"
				name="text"
			/>
		</>
	);
});

SearchInput.displayName = 'SearchInput';

const MainSearch: React.FC = () => {
	const [search, setSearch] = useState<string>('');
	const [active, setActive] = useState<boolean>(false);

	const closeAndClear = useCallback(() => {
		setActive(false);
	}, []);

	const open = useCallback(() => setActive(true), []);

	return (
		<>
			{active && <div className="fixed top-0 left-0 right-0 bottom-0 z-10" onClick={closeAndClear} />}
			<div
				onClick={open}
				className={`rounded-full flex justify-start items-center my-1 mx-6 w-[400px] relative border ${
					active ? 'border-accent-300' : 'border-transparent'
				}`}
			>
				<SafeImage
					fill
					priority
					src="/search.png"
					fallbackSrc=""
					alt="cover image"
					className="opacity-50 -z-10 object-contain object-right"
				/>
				{active && search && <Search search={search} clear={closeAndClear} />}
				<SearchInput setSearch={setSearch} />
			</div>
		</>
	);
};

export default MainSearch;
