<script>
	export let project;
</script>

<img src={project.image} alt="screencap of project" />
<h1><a href={project.url}>{project.title}</a></h1>
<h2>{project.description}</h2>
<p>{project.text}</p>
