// use Vite glob import to pullin all posts
// This returns an object of objects with structure
// { pathToModule: Module, ...}
const allPosts = import.meta.glob('./blogposts/*/*.md');
// loop over the object & destructure the metadata from the Module as a promise
let blogpostMetadata = [];
for (let path in allPosts) {
	blogpostMetadata.push(
		allPosts[path]().then(({ metadata }) => {
			return { path, metadata };
		})
	);
}
//fetch all projects
let projectMetadata = [];
const allProjects = import.meta.glob('./projects/*/*.md');
for (let path in allProjects) {
	projectMetadata.push(
		allProjects[path]().then(({ metadata }) => {
			return { path, metadata };
		})
	);
}

// Await the promised metadata from above.
// feed posts & projects to page as props
export async function load() {
	const posts = await Promise.all(blogpostMetadata);
	const projects = await Promise.all(projectMetadata);
	return {
		posts: posts,
		projects: projects
	};
	// return new Response(JSON.stringify({ posts, projects }));
}
