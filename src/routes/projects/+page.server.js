let body = [];
// const allProjects = import.meta.glob('./projects/**/*.md');
const allProjects = import.meta.glob('./**/*.md');
for (let path in allProjects) {
	body.push(
		allProjects[path]().then(({ metadata }) => {
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
