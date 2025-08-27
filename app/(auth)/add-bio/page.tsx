import { authMetadata, baseMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import AddBio from './AddBio';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.addBio,
};

export default function Page() {
	return <AddBio />;
}
