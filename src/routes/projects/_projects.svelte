<script>
	import '$lib/styles/markdown.css';
	import Tags from '$lib/components/Tags.svelte';
	export let title;
	export let date;
	export let img;
	export let description;
	export let link;
	export let tags;
</script>

<article class="grid w-full gap-6 p-6 text-stone-800 max-w-prose">
	<figure>
		<img class="shadow" src={img} alt="project" />
	</figure>
	<header>
		<h1
			class="mt-6 mb-4 text-5xl font-bold underline transition duration-300 ease-in-out transform text-emerald-600 decoration-emerald-400 decoration-2 underline-offset-4 hover:text-emerald-800"
		>
			<a href={link}> {title}</a>
		</h1>
		<p class="mb-4 text-lg">Published: {new Date(date).toLocaleDateString()}</p>
		{#if description}
			<p class="text-lg italic">{description}</p>
		{/if}
	</header>
	<Tags {tags} />
	<div class="markdown">
		<slot />
	</div>
</article>
