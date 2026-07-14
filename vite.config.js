import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import fs from 'node:fs';

const DEV_ORIGIN = 'http://localhost:5173';
const root = import.meta.dirname;
const hotFile = resolve(root, 'assets/dist/hot');

/** Writes a `hot` file while the dev server runs so PHP knows to load from Vite. */
function wordpressHotFile() {
	return {
		name: 'wp-hot-file',
		configureServer(server) {
			server.httpServer?.once('listening', () => {
				fs.mkdirSync(resolve(root, 'assets/dist'), { recursive: true });
				fs.writeFileSync(hotFile, DEV_ORIGIN);
			});
			const cleanup = () => {
				if (fs.existsSync(hotFile)) fs.unlinkSync(hotFile);
			};
			process.on('exit', cleanup);
			process.on('SIGINT', () => process.exit());
			process.on('SIGTERM', () => process.exit());
		},
	};
}

export default defineConfig({
	base: '',
	plugins: [wordpressHotFile()],
	build: {
		manifest: true,
		outDir: 'assets/dist',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(root, 'assets/src/js/main.js'),
			},
		},
	},
	server: {
		port: 5173,
		strictPort: true,
		cors: true,
		origin: DEV_ORIGIN,
	},
});
