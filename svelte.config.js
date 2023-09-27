import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';
import mdsvexConfig from './mdsvex.config.js';
<<<<<<< HEAD
import adapter from '@sveltejs/adapter-auto';
// import adapter from '@sveltejs/adapter-cloudflare';
// import adapter from '@sveltejs/adapter-vercel';
=======
// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-cloudflare';
>>>>>>> dev

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [
		preprocess({
			postcss: true
		}),
		mdsvex(mdsvexConfig)
	],

	kit: {
		adapter: adapter()
		// prerender: {
		// 	default: true
		// }
	}
};

export default config;
