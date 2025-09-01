import { baseMetadata, authMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import AddProfilePicture from './AddProfilePicture';

export const metadata: Metadata = {
	...baseMetadata,
	...authMetadata.addProfilePicture,
};


export default function Page() {
	return <AddProfilePicture />;
}
