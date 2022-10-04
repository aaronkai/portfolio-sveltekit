<script>
	import '$lib/styles/markdown.css';

	// get posts from props
	export let data;
	let posts = data.posts.sortedPosts;
	console.log(posts[0].path.split('/'));
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
		<h1 class="text-5xl font-extrabold md:text-7xl text-stone-800">Blogposts</h1>
		<fieldset class="grid p-4 border border-stone-800 text-stone-800">
			<legend class="text-xl font-bold">Table of Contents</legend>
			<ul class="ml-4 font-bold list-disc ">
				{#each posts as post}
					<li class="py-1 underline ">
						<a
							class="transition duration-300 ease-in-out transform text-emerald-600 hover:text-emerald-800"
							href={`/${post.path.split('/')[1]}/${post.path.split('/')[2]}`}>{post.meta.title}</a
						>
					</li>
				{/each}
			</ul>
		</fieldset>
	</section>
	<section class="grid gap-8">
		<article class="-m-6 markdown">
			{@html posts[0].html}
		</article>
	</section>
</main>
