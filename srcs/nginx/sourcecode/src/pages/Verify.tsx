import { Box, Button, Card, Text } from '@radix-ui/themes';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNotification } from '../Hooks/useNotification';

const Verify: React.FC<unknown> = () => {
	const [searchParams] = useSearchParams();
	const [code, setCode] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const { notify } = useNotification();
	const navigate = useNavigate();
	const [verified, setVerified] = useState<boolean>(false);

	useEffect(() => {
		if (verified) navigate('/login');
	}, [navigate, verified]);

	useEffect(() => {
		const mail: string | null = searchParams.get('email');
		if (!mail) {
			navigate('/');
			return;
		}
		setEmail(mail);
	}, [navigate, searchParams]);

	async function verify() {
		if (!code || !email) return;
		const payload = {
			email,
			verificationCode: code,
		};
		try {
			const res = await fetch('http://10.13.100.159:3000/api/verify-user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const json = await res.json();
				throw new Error(json.message || 'Verification Failed');
			} else {
				notify({ message: 'Email has been verified', error: true });
				setVerified(true);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			notify({ message: err.message, error: true });
		}
	}

	async function resend() {
		if (!code || !email) return;
		const payload = {
			email,
		};
		try {
			const res = await fetch('http://10.13.100.159:3000/api/resend-code', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const json = await res.json();
				throw new Error(json.message || 'Invalid Email');
			} else {
				notify({ message: 'Code has been sent', success: true });
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			notify({ message: err.message, error: true });
		}
	}
	return (
		<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<Card style={{ width: 400, padding: '12px 24px' }}>
				<Box height="24px" />
				<Text as="div" size="5" weight="bold" align="center">
					Verify Your Email
				</Text>
				<Box height="12px" />
				<Text as="div" size="1" align="center">
					Enter the verification link sent to your email
				</Text>
				<Box height="36px" />
				<input
					required
					value={code}
					minLength={4}
					maxLength={30}
					onChange={(e) => setCode(e.target.value)}
					className="w-full my-1 rounded-sm p-1.5 border-1 border-gray-300/25 text-sm outline-teal-400 focus:outline-1 placeholder:text-gray-300/50"
					placeholder="Code"
					name="Code"
					type="text"
				/>
				<Box height="18px" />
				<Button style={{ width: '100%' }} onClick={verify}>
					Continue
				</Button>
				<Box height="12px" />
				<div className="flex justify-center gap-1">
					<Text size="1" align="center">
						Didn't receive a code?
					</Text>
					<Text size="1" align="center" weight="bold" className="hover:text-teal-500 cursor-pointer" onClick={resend}>
						resend
					</Text>
				</div>
				<Box height="24px" />
			</Card>
		</div>
	);
};

export default Verify;
