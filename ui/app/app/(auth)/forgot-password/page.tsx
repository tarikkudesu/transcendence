import { Metadata } from 'next';
import ForgotPassword from './ForgotPassword';
import { baseMetadata, authMetadata } from '@/app/_service/consts';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.forgotPassword,
};

export default function Page() {
	return <ForgotPassword />;
}
