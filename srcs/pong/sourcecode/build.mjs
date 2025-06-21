import * as esbuild from 'esbuild';

await esbuild.build({
	entryPoints: ['index.js'],
	outfile: 'dist/server.js',
	sourcemap: true, // ! remove in production
	platform: 'node',
	bundle: true,
	minify: true,
});
