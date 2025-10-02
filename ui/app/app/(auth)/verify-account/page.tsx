import { authMetadata, baseMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import VerifyAccount from './VerifyAccount';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.verifyAccount,
};

export default function Page() {
	return <VerifyAccount />;
}
