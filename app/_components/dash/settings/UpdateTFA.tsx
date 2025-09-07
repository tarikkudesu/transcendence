'use client';

import client from '@/app/_service/axios/client';
import { MutateResponse, PongError } from '@/app/_service/schema';
import { useUser } from '@/app/_service/user/userContext';
import { SvgArmor } from '@/app/_svg/svg';
import { Card, Flex, Text } from '@radix-ui/themes';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { useNotification } from '../../mini/useNotify';

function use2FA() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<MutateResponse | null>(null);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsLoading(false);
	}, []);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const response: AxiosResponse<MutateResponse> = await client.put('/users/2fa', {});
			setData(response.data);
		} catch (err) {
			if (err instanceof AxiosError && err.response) {
				setError({
					error: err.response.statusText,
					statusCode: err.response.status,
					message: err.response.data.message,
				});
			} else {
				setError({
					error: 'Unknown Error',
					statusCode: 520,
					message: 'Something went wrong, Please try again later',
				});
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { isLoading, error, data, enable2fa: fetchData, reset };
}

const UpdateTFA: React.FC = () => {
	const { active } = useUser();
	const { notify } = useNotification();
	const { data, error, isLoading, enable2fa } = use2FA();
	const [changed, setChanged] = useState<boolean>(false);

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			notify({ message: 'Please Refresh the page', success: true });
			setChanged(true);
		}
		if (error) {
			notify({ message: error.message, error: true });
		}
	}, [data, error, notify]);

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Enable Two Factor Authentication
			</Text>
			<div className="mt-1 mb-4 text-sm text-dark-200">
				Require both your password and a verification code to access your account.
			</div>
			<Card>
				<Flex justify="between" align="center" p="2" gap="9">
					<div className="flex justify-start items-center gap-4">
						<SvgArmor size={64} className={active ? 'text-accent-200' : 'text-red-600'} />
						<div className="">
							<div className="font-bold text-white text-md">Two-Factor Authentication</div>
							<div className="text-dark-200 text-xs">Add an extra layer of security to your account</div>
						</div>
					</div>
					<PongButton
						onClick={() => enable2fa()}
						loading={isLoading}
						disabled={isLoading || changed}
						className={`${
							!active ? 'bg-accent-300 hover:bg-accent-200' : 'bg-red-600 hover:bg-red-500 text-white'
						} text-black disabled:bg-dark-600 disabled:text-dark-200`}
					>
						{active ? 'Disable' : 'Enable'} 2FA
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateTFA;
