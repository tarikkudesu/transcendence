import { Box, Button, Card, Checkbox, Flex, Text } from '@radix-ui/themes';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../Hooks/useNotification';
import { HTTP_API } from '../services/API';
import { useAuth } from '../Hooks/AuthContext';

const LogIn: React.FC<unknown> = () => {
	const [type, setType] = useState<'password' | 'text'>('password');
	const [pass, setPass] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [username, setUsername_] = useState<string>('');
	const [logged, setLogged] = useState<boolean>(false);
	const { notify } = useNotification();
	const navigate = useNavigate();
	const { setUsername } = useAuth();

	useEffect(() => {
		if (logged) {
			setUsername(username);
			navigate(`/dashboard`);
			// navigate(`/verify-2fa?email=${email}`);
		}
	}, [email, logged, navigate, setUsername, username]);

	const switchtype = useCallback(() => {
		if (type === 'password') setType('text');
		else setType('password');
	}, [type]);

	const login = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!username || !pass) return;
			const payload = {
				username: username,
				password: pass,
			};
			try {
				const res = await fetch(`${HTTP_API}/auth/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
					credentials: 'include',
				});
				if (!res.ok) {
					const json = await res.json();
					throw new Error(json.message || 'Login Failed');
				} else {
					const json = await res.json();
					if (json.email) setEmail(json.email);
					if (json.username) setUsername_(json.username);
					setLogged(true);
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				notify({ message: err.message, error: true });
			}
		},
		[notify, pass, username]
	);

	return (
		<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<Card style={{ width: 400, padding: '12px 24px' }}>
				<Box height="24px" />
				<img src="/logo.png" draggable={false} style={{ width: '80%', margin: '0px auto' }} />
				<Box height="48px" />
				<Text as="div" size="5" weight="bold" align="center">
					Log In
				</Text>
				<Form onSubmit={login}>
					<Box height="8px" />
					<label className="text-sm">
						Username
						<input
							required
							minLength={4}
							maxLength={40}
							value={username}
							placeholder="Enter Your Username"
							className="w-full my-1 rounded-sm p-1.5 border-1 border-gray-300/25 text-sm outline-teal-400 focus:outline-1 placeholder:text-gray-300/50"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername_(e.target.value)}
							type="text"
							name="username"
						></input>
					</label>
					<Box height="8px" />
					<label className="text-sm">
						Password
						<input
							required
							minLength={4}
							maxLength={40}
							value={pass}
							placeholder="Enter Your Psssword"
							className="w-full my-1 rounded-sm p-1.5 border-1 border-gray-300/25 text-sm outline-teal-400 focus:outline-1 placeholder:text-gray-300/50"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}
							type={type}
							name="password"
						></input>
					</label>
					<Box height="8px" />
					<Text as="label" size="1">
						<Flex gap="2" align="center">
							<input type="checkbox" checked={type === 'text'} onChange={switchtype} />
							show password
						</Flex>
					</Text>
					<Box height="24px" />
					<Button type="submit" variant="solid" style={{ width: '100%', fontWeight: 'bolder' }}>
						Log In
					</Button>
				</Form>
				<Box height="8px" />
				<Link to="/signup">
					<Button variant="soft" style={{ width: '100%', fontWeight: 'bolder' }}>
						Sign Up
					</Button>
				</Link>
				<Box height="24px" />
			</Card>
		</div>
	);
};

export default LogIn;
