import { authMetadata, baseMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import ResetPassword from './ResetPassword';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.resetPassword,
};

export default function Page() {
	return <ResetPassword />;
}
