import { Theme } from '@radix-ui/themes';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Main from './pages/Main';
import Local from './pages/Local';
import Server from './pages/Server';
import WSProvider from './Hooks/ws-context';
import Extra from './pages/Extra';
import { Toaster } from 'react-hot-toast';
import SignIn from './pages/SignIn';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<WSProvider url="wss://localhost:7443/ws">
				<Home />
			</WSProvider>
		),
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Main />,
			},
			{
				path: 'signin',
				element: <SignIn />,
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
	{
		path: '/error',
		element: <ErrorPage />,
		errorElement: <ErrorPage />,
	},
]);

function App() {
	return (
		<>
			<Theme appearance="dark" accentColor="teal" grayColor="mauve" panelBackground="solid" scaling="100%">
				<Toaster />
				<RouterProvider router={router} />
			</Theme>
		</>
	);
}

export default App;
