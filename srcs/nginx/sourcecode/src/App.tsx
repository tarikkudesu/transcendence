import { Theme } from '@radix-ui/themes';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Main from './pages/Main';
import Local from './pages/Local';
import Extra from './pages/Extra';
import Server from './pages/Server';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import { Toaster } from 'react-hot-toast';
import Verify from './pages/Verify';
import Landing from './pages/Landing';
import { Provider } from 'react-redux';
import store from './Redux/Store';
import WSProvider from './Hooks/ws-context';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Outlet />,
		children: [
			{
				index: true,
				element: <Landing />,
				errorElement: <ErrorPage />,
			},
			{
				path: 'login',
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
				path: 'dashboard',
				element: (
					<WSProvider url="ws://localhost:3004/api/game/ws">
						<Toaster />
						<Home />
					</WSProvider>
				),
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
		],
		errorElement: <ErrorPage />,
	},
]);

const queryClient = new QueryClient();

function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<Theme appearance="dark" accentColor="teal" grayColor="mauve" panelBackground="solid" scaling="100%">
					<Provider store={store}>
						<RouterProvider router={router} />
					</Provider>
				</Theme>
				{/* <ReactQueryDevtools /> */}
			</QueryClientProvider>
		</>
	);
}

export default App;
