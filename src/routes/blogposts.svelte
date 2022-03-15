<script context="module">
	//fetch all posts
	const allPosts = import.meta.glob('./blogposts/*.md');
	let body = [];
	let body2 = [];
	for (let path in allPosts) {
		body.push(
			allPosts[path]().then((post) => {
				return post;
			})
		);
	}

	// feed posts to page as props
	export const load = async () => {
		const posts = await Promise.all(body);
		return {
			props: {
				posts
			}
		};
	};
</script>

<script>
	// get props
	export let posts;
	// sort blogposts by date and return most current 3
	const dateSortedPosts = posts.sort((post1, post2) => {
		return new Date(post2.metadata.date) - new Date(post1.metadata.date);
	});
	const latestPostDate = new Date(dateSortedPosts[0].metadata.date).toLocaleDateString();
	const blogHtml = dateSortedPosts[0].default.render().html;
</script>

<svelte:head>
	<title>Blogposts</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-twilight.css"
	/>
</svelte:head>

<main class="grid max-w-xl gap-16 px-6 m-auto">
	<section class="grid gap-8">
		<h1 class="mt-8 text-2xl">Blogposts</h1>
		<fieldset class="p-4 border border-gray-500">
			<legend class="text-xl font-bold">Table of Contents</legend>
			<ul role="list" class="ml-4 font-bold list-disc ">
				{#each dateSortedPosts as post}
					<li class="py-1 underline ">
						<a class="text-blue-800" href={post.metadata.url}>{post.metadata.title}</a>
					</li>
				{/each}
			</ul>
		</fieldset>
	</section>
	<section class="grid gap-8">
		<header class="grid gap-2 pb-4 border-b-2">
			<h2 style="font-size: clamp(2rem, 6vw, 3rem);">
				Latest Post: {dateSortedPosts[0].metadata.title}
			</h2>
			<h3>{latestPostDate}</h3>
		</header>
		<article class="grid gap-2 blog">
			{@html blogHtml}
		</article>
	</section>
</main>
