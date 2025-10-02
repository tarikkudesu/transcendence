'use client';

import { useCallback } from 'react';
import { toast } from 'react-toastify';

interface useNotificationProps {
	message: string;
	error?: boolean;
	success?: boolean;
}
export function useNotification() {
	const notify = useCallback(({ message, error }: useNotificationProps) => {
		if (error) toast.error(message);
		else toast(message);
	}, []);
	return { notify };
}
