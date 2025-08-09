import { Box, Button, Card, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, useNavigate } from 'react-router';
import { useNotification } from '../Hooks/useNotification';
import { HTTP_API } from '../services/API';

const SignUp: React.FC<unknown> = () => {
	const navigate = useNavigate();
	const [pass, setPass] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const { notify } = useNotification();

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!username || !pass || !email) return;
		const payload = {
			username: username,
			password: pass,
			email: email,
		};
		try {
			const res = await fetch(`${HTTP_API}/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const json = await res.json();
				throw new Error(json.message || 'Signup failed');
			} else {
				navigate('/verify?email=' + email);
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
				<img src="/logo.png" draggable={false} style={{ width: '80%', margin: '0px auto' }} />
				<Box height="48px" />
				<Text as="div" size="5" weight="bold" align="center">
					Sign Up
				</Text>

				<Form onSubmit={onSubmit}>
					<Box height="8px" />
					<label className="text-sm">
						Email
						<input
							required
							value={email}
							minLength={4}
							maxLength={30}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full my-1 rounded-sm p-1.5 border-1 border-gray-300/25 text-sm outline-teal-400 focus:outline-1 placeholder:text-gray-300/50"
							placeholder="Enter Your Email"
							name="email"
							type="email"
						/>
					</label>
					<Box height="8px" />
					<label className="text-sm">
						Username
						<input
							required
							minLength={4}
							maxLength={30}
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full my-1 rounded-sm p-1.5 border-1 border-gray-300/25 text-sm outline-teal-400 focus:outline-1 placeholder:text-gray-300/50"
							placeholder="Enter Your Username"
							name="username"
							type="text"
						/>
					</label>
					<Box height="8px" />
					<label className="text-sm">
						Password
						<input
							required
							minLength={4}
							maxLength={30}
							value={pass}
							onChange={(e) => setPass(e.target.value)}
							className="w-full my-1 rounded-sm p-1.5 border-1 border-gray-300/25 text-sm outline-teal-400 focus:outline-1 placeholder:text-gray-300/50"
							placeholder="Enter Your Psssword"
							name="password"
							type="password"
						/>
					</label>
					<Box height="24px" />
					<Button type="submit" variant="solid" style={{ width: '100%', fontWeight: 'bolder' }}>
						Sign Up
					</Button>
				</Form>
				<Box height="12px" />
				<Link to="/">
					<Button variant="soft" style={{ width: '100%', fontWeight: 'bolder' }}>
						Log In
					</Button>
				</Link>
				<Box height="24px" />
			</Card>
		</div>
	);
};

export default SignUp;
