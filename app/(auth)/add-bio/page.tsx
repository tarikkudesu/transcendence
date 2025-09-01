import { Metadata } from 'next';
import AddBio from './AddBio';
import { baseMetadata, authMetadata } from '@/app/_service/consts';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.addBio,
};

export default function Page() {
	return <AddBio />;
}
