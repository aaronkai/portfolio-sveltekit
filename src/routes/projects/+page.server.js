let body = [];
// const allProjects = import.meta.glob('./projects/**/*.md');
const allProjects = import.meta.glob('./**/*.md');
for (let path in allProjects) {
	// add 'projects' string to beginning of path so that ProjectCard component can parse the path just as at project root
	body.push(
		allProjects[path]().then(({ metadata }) => {
			console.log(path);
			const newPath = `./projects/${path.split('/')[1]}/${path.split('/')[2]}`;
			console.log(newPath);
			path = newPath;
			return { path, metadata };
		})
	);
}

// feed posts to page as props
export const load = async () => {
	const projects = await Promise.all(body);
	return {
		projects
	};
};
