import { Theme } from '@radix-ui/themes';
import { SocketConnectionContext, useTeaWebsocket } from './Hooks/useTeaWebsocket';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Main from './pages/Main';
import Local from './pages/Local';
import Server from './pages/Server';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: 'main',
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
		],
	},
]);

function App() {
	const { data, send } = useTeaWebsocket({ url: 'ws:127.0.0.1:3000/api/game' });

	return (
		<>
			<SocketConnectionContext.Provider value={{ data, send }}>
				<Theme appearance="dark" accentColor="ruby" grayColor="mauve" panelBackground="solid" scaling="100%">
					<RouterProvider router={router} />
				</Theme>
			</SocketConnectionContext.Provider>
		</>
	);
}

export default App;
