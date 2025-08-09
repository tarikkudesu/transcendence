import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Theme } from '@radix-ui/themes';

import Main from './pages/Main';
import Local from './pages/Local';
import Extra from './pages/Extra';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Server from './pages/Server';
import Verify from './pages/Verify';
import ErrorPage from './pages/ErrorPage';
import AuthProvider from './Hooks/AuthProvider';
import ProtectedRoute from './Hooks/ProtectedRoute';
import Verify2FA from './pages/Verify2fa';

const router = createBrowserRouter([
	{
		index: true,
		element: <LogIn />,
		errorElement: <ErrorPage />,
	},
	{
		path: 'signup',
		element: <SignUp />,
		errorElement: <ErrorPage />,
	},
	{
		path: 'verify',
		element: <Verify />,
		errorElement: <ErrorPage />,
	},
	{
		path: 'verify-2fa',
		element: <Verify2FA />,
		errorElement: <ErrorPage />,
	},
	{
		path: 'dashboard',
		element: <ProtectedRoute />,
		children: [
			{
				index: true,
				element: <Main />,
			},
			{
				path: 'local',
				element: <Local />,
			},
			{
				path: 'server/:game',
				element: <Server />,
			},
			{
				path: 'extra/:game',
				element: <Extra />,
			},
		],
	},
]);

const queryClient = new QueryClient();

function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Theme appearance="dark" accentColor="teal" grayColor="mauve" panelBackground="solid" scaling="100%">
						<Toaster />
						<RouterProvider router={router} />
					</Theme>
				</AuthProvider>
			</QueryClientProvider>
		</>
	);
}

export default App;
