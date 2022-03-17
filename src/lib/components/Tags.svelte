<script>
	export let tags;
</script>

<div class="flex flex-wrap">
	{#each tags as tag}
		<a
			href="#"
			class="flex flex-wrap items-center justify-center px-8 py-2 mb-3 mr-3 font-bold rounded shadow text-stone-100 bg-emerald-600"
			>{tag}</a
		>
	{/each}
</div>
