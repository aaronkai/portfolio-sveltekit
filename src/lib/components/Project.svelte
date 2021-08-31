<script>
	export let project;
</script>

<div class="project">
	<h1><a href={project.url}>{project.title}</a></h1>
	<h2>{project.description}</h2>
	<p>{project.text}</p>
	<img src={project.image} alt="screencap of project" />
</div>

<style>
	.project {
		display: grid;
		background-color: var(--nord4);
		padding: 4rem 2rem 4rem 2rem;
	}
	.project:nth-child(2) {
		background-color: var(--nord6);
	}
	img {
		/* border: 2px solid var(--nord3); */
		width: 100%;
	}

	h1 {
		margin: 0 0 1rem 0;
		font-size: 3rem;
	}
	h2 {
		margin: 0 0 1rem 0;
		font-size: 2rem;
		color: var(--nord9);
	}
	p {
		margin: 0 0 2rem 0;
	}
</style>
