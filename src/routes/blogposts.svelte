<script context="module">
	// feed posts to page as props
	export const load = async ({ fetch }) => {
		const posts = await fetch('./blogposts.json');
		const allPosts = await posts.json();
		return {
			props: {
				posts: allPosts
			}
		};
	};
</script>

<script>
	import '$lib/styles/markdown.css';

	// get posts from props
	export let posts;

	const latestPostDate = new Date(posts[0].meta.date).toLocaleDateString();
</script>

<svelte:head>
	<title>Blogposts</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-twilight.css"
	/>
</svelte:head>

<main class="grid gap-16 p-6 max-w-prose">
	<section class="grid gap-8">
		<h1 class="font-extrabold text-stone-800 text-7xl">Blogposts</h1>
		<fieldset class="p-4 border border-gray-500">
			<legend class="text-xl font-bold">Table of Contents</legend>
			<ul class="ml-4 font-bold list-disc ">
				{#each posts as post}
					<li class="py-1 underline ">
						<a class="text-emerald-600" href={post.path}>{post.meta.title}</a>
					</li>
				{/each}
			</ul>
		</fieldset>
	</section>
	<section class="grid gap-8">
		<header class="grid gap-2 pb-4 border-b-2">
			<h2 class="text-4xl text-stone-800">
				Latest Post: <br />
				{posts[0].meta.title}
			</h2>
			<h3 class="text-stone-800">{latestPostDate}</h3>
		</header>
		<article class="-m-6 markdown">
			{@html posts[0].html}
		</article>
	</section>
</main>
