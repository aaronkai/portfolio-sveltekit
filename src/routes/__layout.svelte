<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '$lib/styles/global.css';
</script>

<div class="grid min-h-screen justify-items-center wrapper bg-stone-200">
	<Header />
	<div class="max-w-screen-xl inner_wrapper ">
		<slot />
	</div>
	<Footer />
</div>

<style>
	.wrapper {
		grid-template-rows: auto 1fr auto;
	}
</style>
