// feed posts to page as props
export let data;

export async function load({ fetch }) {
	const posts = await fetch('./blogposts.json');
	const allPosts = await posts.json();

	return {
		posts: allPosts
	};
}
