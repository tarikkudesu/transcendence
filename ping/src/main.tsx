// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import App from './App.tsx';
import '@radix-ui/themes/styles.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<Theme appearance="dark" accentColor="purple" grayColor="gray" panelBackground="solid" scaling="100%" radius="medium">
		<App />
	</Theme>
	// </StrictMode>
);
