<script>
	import Icon from 'svelte-awesome';
	import { github, linkedinSquare } from 'svelte-awesome/icons';
</script>

<nav>
	<a href="/">Home</a>
	<a href="/projects">Projects</a>
	<a href="mailto:hotel.kilo.alpha@gmail.com">Contact</a>
	<a href="https://www.github.com/aaronkai" target="_blank" rel="noreferrer"
		><Icon scale="2" data={github} /></a
	>
	<!-- <Icon data={beer} /> -->
	<a href="https://www.linkedin.com/in/aaron-hubbard/" target="_blank" rel="noreferrer">
		<Icon scale="2" data={linkedinSquare} />
	</a>
</nav>

<style>
	nav {
		display: grid;
		border-bottom: 2px solid var(--nord1);
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
		color: var(--nord1);
		height: 100%;
		background-color: var(--nord6);
		height: 3rem;
		padding: 0.5rem;
	}
	a:hover {
		background-color: var(--nord7);
	}
</style>
