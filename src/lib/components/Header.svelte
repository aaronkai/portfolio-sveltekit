<script>
	import Icon from 'svelte-awesome';
	import { envelope, github, linkedinSquare } from 'svelte-awesome/icons';
</script>

<nav>
	<a href="/">Home</a>
	<a href="/projects">Projects</a>
	<a href="mailto:hotel.kilo.alpha@gmail.com"><Icon scale="2" data={envelope} /></a>
	<a href="https://www.github.com/aaronkai" target="_blank" rel="noreferrer"
		><Icon scale="2" data={github} /></a
	>
	<a href="https://www.linkedin.com/in/aaron-hubbard/" target="_blank" rel="noreferrer">
		<Icon scale="2" data={linkedinSquare} />
	</a>
</nav>

<style>
	nav {
		display: grid;
		border-bottom: 4px solid var(--fuchsia);
		grid-template-columns: 2fr 2fr 2fr 1fr 1fr;
	}
	a {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		font-family: 'Rubik', sans-serif;
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--off-white);
		height: 100%;
		background-color: var(--off-black);
		padding: 1rem;
	}
	a:hover {
		color: var(--fuchsia);
	}
</style>
