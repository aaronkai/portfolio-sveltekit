<script>
	import GithubLogo from '$lib/components/GithubLogo.svelte';
	import LinkedIn from './LinkedIn.svelte';
	import Envelope from './Envelope.svelte';
	import Logo from './Logo.svelte';

	const svgClasses =
		'h-6 fill-stone-800 hover:fill-emerald-600 transition duration-300 ease-in-out transform';
</script>

<nav
	class="flex flex-wrap items-end self-start justify-end py-2 border-b-2 shadow md:p-4 justify-self-stretch border-emerald-700 bg-stone-50"
>
	<a href="/"
		><Logo
			classes="h-10 fill-stone-800 hover:fill-emerald-600 transition duration-300 ease-in-out transform"
		/></a
	>
	<a href="/projects">Projects</a>
	<a href="/blogposts">Posts</a>
	<a href="mailto:hotel.kilo.alpha@gmail.com"><Envelope classes={svgClasses} /></a>
	<a href="https://www.github.com/aaronkai" target="_blank" rel="noreferrer "
		><GithubLogo classes={svgClasses} /></a
	>
	<a href="https://www.linkedin.com/in/aaron-hubbard/" target="_blank" rel="noreferrer"
		><LinkedIn classes={svgClasses} /></a
	>
</nav>

<style>
	a {
		@apply items-center flex no-underline font-sans font-bold text-lg text-stone-800 px-2 h-full hover:text-emerald-500 h-10 transition duration-300 ease-in-out transform hover:text-emerald-600;
	}
	nav :first-child {
		@apply flex items-start justify-start grow shrink pl-1;
	}
</style>
