import { Theme } from '@radix-ui/themes';
import Game from './Components/Game';
import { SocketConnectionContext, userContext, useTeaWebsocket } from './Hooks/useTeaWebsocket';
import { faker } from '@faker-js/faker';

function App() {
	const { data, send } = useTeaWebsocket({ url: 'ws:127.0.0.1:3000/api/game' });
	const username = faker.internet.username();

	return (
		<>
			<userContext.Provider value={username}>
				<SocketConnectionContext.Provider value={{ data, send }}>
					<Theme appearance="dark" accentColor="ruby" grayColor="mauve" panelBackground="solid" scaling="100%">
						<Game />
						{/* <ThemePanel /> */}
					</Theme>
				</SocketConnectionContext.Provider>
			</userContext.Provider>
		</>
	);
}

export default App;
