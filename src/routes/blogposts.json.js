// posts.json.js
export const get = async () => {
	const allPostFiles = import.meta.glob('./blogposts/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const resolvedPost = await resolver();
			const { html } = resolvedPost.default.render();
			const postPath = path.slice(2, -3);

			return {
				meta: resolvedPost.metadata,
				path: postPath,
				html: html
			};
		})
	);

	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.meta.date) - new Date(a.meta.date);
	});

	return {
		body: sortedPosts
	};
};