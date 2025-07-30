import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
	username: string;
	email: string;
	bio: string;
	created_at: string;
	avatar: string;
}

export const initialState: User = {
	username: '',
	email: '',
	bio: '',
	created_at: '',
	avatar: '',
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.username = action.payload.username;
			state.email = action.payload.email;
			state.bio = action.payload.bio;
			state.created_at = action.payload.created_at;
			state.avatar = action.payload.avatar;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
