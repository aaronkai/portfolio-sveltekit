<script>
	import Project from '$lib/components/Project.svelte';

	import aikidoScreenshot from '$lib/assets/aikikai.png';
	import bacchusV1Screenshot from '$lib/assets/bacchus_atlas_v1_screencap.png';
	import bacchusExpandedScreenshot from '$lib/assets/bacchus_atlas_expanded_screencap.png';

	let projects = [
		{
			title: 'Aikido Website',
			image: aikidoScreenshot,
			url: 'www.example.com',
			description: 'A landing page for a martial arts dojo',
			text: 'Built in SvelteKit'
		},
		{
			title: 'Bacchus Atlas Expanded',
			image: bacchusExpandedScreenshot,
			url: 'www.bacchusatlas.com',
			description: 'A site for cataloging and geolocating wine',
			text:
				'Bacchus Atlas was a rework of the original page I built in Gatsby, after learning the limitations of the Sanity backend. This site is build in NextJS. It utilizes Apollo and GQL. It runs KeystoneJS on the backend to handle authentication, and runs postgres for its database. It is still a work in progress, but essential functionality is in place. A user can log in, add wines to the database, geolocate them on a map, and rate them.'
		},
		{
			title: 'Bacchus Atlas v.1',
			image: bacchusV1Screenshot,
			url: 'www.bacchusatlas.com',
			description: 'A site for displaying wine',
			text:
				'Bauccus Atlas is a static page generated with Gatsby with a Sanity backend CMS. Based on, but not identical to, a tutorial given by Wes Bos.'
		}
	];
</script>

<h1>Projects</h1>
{#each projects as project}
	<Project {project} class="project" />
{/each}
