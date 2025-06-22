import toast from 'react-hot-toast';

interface useNotificationProps {
	message: string;
	error?: boolean;
	success?: boolean;
}
export function useNotification() {
	function notify({ message, error, success }: useNotificationProps) {
		setTimeout(() => {
			if (error) toast.error(message, { style: { fontWeight: 'bold', color: 'white', backgroundColor: 'var(--red-3)' } });
			else if (success) toast.success(message, { style: { fontWeight: 'bold', color: 'white', backgroundColor: 'var(--green-3)' } });
			else toast(message, { style: { fontWeight: 'bold', color: 'white', backgroundColor: 'var(--accent-3)' } });
		}, 200);
	}
	return { notify };
}
