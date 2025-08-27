import { authMetadata, baseMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import ForgotPassword from './ForgotPassword';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.forgotPassword,
};

export default function Page() {
	return <ForgotPassword />;
}
