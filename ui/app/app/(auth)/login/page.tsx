import { Metadata } from 'next';
import Login from './Login';
import { baseMetadata, authMetadata } from '@/app/_service/consts';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.login,
};

export default function Page() {
	return <Login />;
}
