import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// useRouteError() get access to errors, Mainly in ErrorElement:
// useNavigation() get loading state
// useLoaderData() get loader data
// loader functions get access to params as props

createRoot(document.getElementById('root')!).render(<App />);
