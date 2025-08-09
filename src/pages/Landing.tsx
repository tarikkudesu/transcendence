import { Box, Button, Card, Text } from '@radix-ui/themes';
import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

const Auth: React.FC<unknown> = () => {
	const [username, setUsername_] = useState<string>('');
	// const navigate = useNavigate();
	// const { setUsername } = useAuth();

	// function connect() {
	// 	if (!username) return;
	// 	setUsername(username);
	// 	navigate('/dashboard');
	// }
	return (
		<>
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<Card style={{ width: 400, padding: '12px 24px' }}>
					<Box height="24px" />
					<img src="/logo.png" draggable={false} style={{ width: '80%', margin: '0px auto' }} />
					<Box height="24px" />
					<Text as="div" size="5" weight="bold" align="center">
						Welcome To Ping Pop
					</Text>
					<Box height="48px" />

					<label className="text-sm">
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
					<Box height="24px" />
					<Link to="/">
						<Button variant="classic" style={{ width: '100%', fontWeight: 'bolder' }}>
							Log In
						</Button>
					</Link>
					<Box height="8px" />
					<Link to="/signup">
						<Button variant="outline" style={{ width: '100%', fontWeight: 'bolder' }}>
							Sign Up
						</Button>
					</Link>
					{/* <Box height="8px" />
					<Button onClick={connect} disabled={!username} variant="outline" style={{ width: '100%', fontWeight: 'bolder' }}>
						Play
					</Button> */}
					<Box height="24px" />
				</Card>
			</div>
		</>
	);
};

export default Auth;
