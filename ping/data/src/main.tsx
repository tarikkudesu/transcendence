import { createRoot } from 'react-dom/client';

import '@radix-ui/themes/styles.css';
import './index.css';

import App from './App.tsx';
import { Theme } from '@radix-ui/themes';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<Theme appearance="dark" accentColor="iris" grayColor="gray" panelBackground="solid" scaling="100%">
		<Toaster position="bottom-center" />
		<div className="mx-auto pt-12 px-12">
			<App />
		</div>
	</Theme>
	// </StrictMode>
);
