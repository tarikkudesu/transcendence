import { createContext } from 'react';
import { initialState as userInitialState } from '../Redux/userSlice';

export const userContext = createContext(userInitialState);
