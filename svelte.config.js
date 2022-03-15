// import { mdsvex } from 'mdsvex';
// import mdsvexConfig from './mdsvex.config.js';
// import adapter from '@sveltejs/adapter-netlify';

// const mode = process.env.NODE_ENV;
// const dev = mode === 'development';
// process.env.TAILWIND_MODE = dev ? 'watch' : 'build';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	extensions: ['.svelte', ...mdsvexConfig.extensions],

// 	kit: {
// 		adapter: adapter()
// 	},

// 	preprocess: [mdsvex(mdsvexConfig)]
// };

// export default config;

import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';
import mdsvexConfig from './mdsvex.config.js';

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
	}
};

export default config;
