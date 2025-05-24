import { Theme } from '@radix-ui/themes';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Main from './pages/Main';
import Local from './pages/Local';
import Server from './pages/Server';
import WSProvider from './Hooks/ws-context';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: 'main',
				element: (
					<WSProvider url="ws://localhost:3000/api/game/">
						<Main />
					</WSProvider>
				),
			},
			{
				path: 'local',
				element: <Local />,
			},
			{
				path: 'server/:game',
				element: (
					<WSProvider url="ws://localhost:3000/api/game/">
						<Server />
					</WSProvider>
				),
			},
		],
	},
]);

function App() {
	return (
		<>
			<Theme appearance="dark" accentColor="orange" grayColor="mauve" panelBackground="solid" scaling="100%">
				<RouterProvider router={router} />
			</Theme>
		</>
	);
}

export default App;
