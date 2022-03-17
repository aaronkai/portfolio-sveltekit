<script>
	import '$lib/styles/markdown.css';
	import Tags from '$lib/components/Tags.svelte';

	export let tags;
	export let title;
	export let date;
</script>

<svelte:head>
	<title>{title}</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-twilight.css"
	/>
</svelte:head>

<article class="grid w-full gap-6 p-6 text-stone-800 max-w-prose">
	<!-- <figure>
		<img class="shadow" src={img} alt="project" />
	</figure> -->
	<header>
		<h1 class="mt-6 mb-4 text-5xl font-bold">{title}</h1>
		<p class="text-xl">Published: {new Date(date).toLocaleDateString()}</p>
	</header>
	<Tags {tags} />
	<div class="markdown">
		<slot />
	</div>
</article>
