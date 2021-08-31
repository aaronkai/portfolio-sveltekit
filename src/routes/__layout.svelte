<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div class="wrapper">
	<Header />
	<div class="inner_wrapper">
		<slot />
	</div>
	<Footer />
</div>

<style>
	.wrapper {
		display: grid;
		width: 100vw;
		min-height: 100vh;
		grid-template-rows: auto 1fr auto;
	}
</style>
