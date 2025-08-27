import { authMetadata, baseMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import SignUp from './SignUp';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.signup,
};

export default function Page() {
	return <SignUp />;
}
