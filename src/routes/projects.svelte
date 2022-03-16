<script context="module">
	let body = [];
	const allProjects = import.meta.glob('./projects/*.md');
	for (let path in allProjects) {
		body.push(
			allProjects[path]().then(({ metadata }) => {
				return { path, metadata };
			})
		);
	}

	// feed posts to page as props
	export const load = async () => {
		const projects = await Promise.all(body);
		return {
			props: {
				projects
			}
		};
	};
</script>

<script>
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	export let projects;

	const dateSortedProjects = projects.sort((project1, project2) => {
		return new Date(project2.metadata.date) - new Date(project1.metadata.date);
	});
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<html lang="en">
	<body>
		<div
			class="grid items-center justify-center gap-16 px-6 pt-16 pb-4 bg-stone-200 wrapper md:p-12"
		>
			<h1 class="font-extrabold text-fuchsia-700 text-7xl">All Projects</h1>
			<div class="grid gap-12 lg:grid-cols-2 2xl:grid-cols-3">
				{#each dateSortedProjects as project}
					<ProjectCard {project} />
				{/each}
			</div>
		</div>
	</body>
</html>
