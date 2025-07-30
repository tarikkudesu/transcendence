
process.env.DB_PATH = './src/data/users.db';
process.env.PORT = '3004';
process.env.HOST = '0.0.0.0';

const config = {
	host: process.env.HOST || '0.0.0.0',
	port: process.env.PORT || 3004,
	db_path: process.env.DB_PATH,
};

export { config };
