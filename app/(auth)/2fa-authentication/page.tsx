import { Metadata } from 'next';
import Tfa from './Tfa';
import { authMetadata, baseMetadata } from '@/app/_service/consts';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.twoFactorAuth,
};

export default function Page() {
	return <Tfa />;
}
