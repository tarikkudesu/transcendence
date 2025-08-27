import { authMetadata, baseMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import Login from './Login';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.login,
};

export default function Page() {
	return <Login />;
}
