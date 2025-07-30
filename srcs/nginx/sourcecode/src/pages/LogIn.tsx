import { Box, Button, Card, Text } from '@radix-ui/themes';
import { useEffect, useState, type ChangeEvent } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../Hooks/useNotification';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/userSlice';

const LogIn: React.FC<unknown> = () => {
	const [pass, setPass] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [logged, setLogged] = useState<boolean>(false);
	const { notify } = useNotification();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (logged) {
			dispatch(
				setUser({
					username,
					email: '',
					bio: '',
					created_at: '',
					avatar: '',
				})
			);
			navigate('/dashboard');
		}
	}, [dispatch, logged, navigate, username]);

	async function login(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!username || !pass) return;
		const payload = {
			username: username,
			password: pass,
		};
		try {
			const res = await fetch('http://10.13.100.159:3000/api/login', {
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
				setLogged(true);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			notify({ message: err.message, error: true });
		}
		return;
	}

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
							onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
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
							type="password"
							name="password"
						></input>
					</label>
					<Box height="24px" />
					<Button type="submit" variant="classic" style={{ width: '100%', fontWeight: 'bolder' }}>
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
