import { Box, Button, Card, Flex, Text, TextField } from '@radix-ui/themes';
import { useContext, useState, type ChangeEvent } from 'react';
import { useNotification } from '../Hooks/useNotification';
import { ConnectMessage, WSC, wsContext } from '../Hooks/ws-client';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC<unknown> = () => {
	const navigate = useNavigate();
	const { notify } = useNotification();
	const [pass, setPass] = useState<string>('otman');
	const [username, setUsername] = useState<string>('otman');
	const { send } = useContext(wsContext);
	const [auth, setAuth] = useState<boolean>(false);

	async function signIn() {
		if (!username || !pass) return;
		const payload: { username: string; pass: string } = { username, pass };
		const response = await fetch('/api/auth/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
			credentials: 'include',
		});
		if (!response.ok) notify({ message: 'Could not sign in', error: true });
		else {
			WSC.username = username;
			send(ConnectMessage(username, ''));
			setAuth(true);
		}
	}

	return (
		<>
			<Card style={{ width: 400, padding: '12px 24px' }} className="mx-auto">
				<Box height="24px" />
				<Text size="6" weight="bold">
					Sign In
				</Text>
				<Box height="12px" />
				<Text size="1">Username</Text>
				<Box height="4px" />
				<TextField.Root
					value={username}
					defaultValue={username}
					placeholder="Enter Your Username"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
				></TextField.Root>
				<Box height="12px" />
				<Text size="1">Password</Text>
				<Box height="4px" />
				<TextField.Root value={pass} defaultValue={pass} placeholder="Enter Your Psssword" onChange={(e: ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}></TextField.Root>
				<Box height="24px" />
				<Flex justify="end">
					<Button disabled={!pass || !username} onClick={signIn}>
						Sign In
					</Button>
				</Flex>
				<Box height="12px" />
				{auth && <Button onClick={() => navigate('/')}>Play</Button>}
				<Box height="24px" />
			</Card>
		</>
	);
};

export default SignIn;
