const config = {
	extensions: ['.svelte.md', '.md', '.svx'],
	layout: {
		projects: 'src/routes/projects/_projects.svelte',
		blogposts: 'src/routes/blogposts/_blogposts.svelte'
	},
	smartypants: {
		dashes: 'oldschool'
	},

	remarkPlugins: [],
	rehypePlugins: []
};

export default config;
