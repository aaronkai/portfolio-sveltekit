<script>
	import Project from '$lib/components/Project.svelte';

	import aikidoScreenshot from '$lib/assets/aikikai.png';
	import bacchusV1Screenshot from '$lib/assets/bacchus_atlas_v1_screencap.png';
	import bacchusExpandedScreenshot from '$lib/assets/bacchus_atlas_expanded_screencap.png';

	let projects = [
		{
			title: 'Asheville Aikikai',
			image: aikidoScreenshot,
			url: 'https://development--asheville-aikikai-refresh.netlify.app/',
			description: 'A landing page for a martial arts dojo',
			text:
				'I built this site on spec for a local dojo in in SvelteKit. Orignally designed to be a static site, I later converted it to server-side rendering to accomodate a backend CMS, which I did in Sanity to allow stakeholders to dynamically edit content.'
		},
		{
			title: 'Bacchus Atlas Expanded',
			image: bacchusExpandedScreenshot,
			url: 'https://www.bacchusatlas.com',
			description: 'A site for cataloging and geolocating wine',
			text:
				'Bacchus Atlas was a rework of the original page I built in Gatsby, after learning the limitations of the Sanity backend. This site is build in NextJS. It utilizes Apollo and GQL. It runs KeystoneJS on the backend to handle authentication, and runs postgres for its database. It is still a work in progress, but essential functionality is in place. A user can log in, add wines to the database, geolocate them on a map, and rate them.'
		},
		{
			title: 'Bacchus Atlas v.1',
			image: bacchusV1Screenshot,
			url: 'https://bauccus-atlas.netlify.app/',
			description: 'A site for displaying wine',
			text:
				'Bauccus Atlas is a static page generated with Gatsby with a Sanity backend CMS. Based on, but not identical to, a tutorial given by Wes Bos.'
		}
	];
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<article>
	{#each projects as project}
		<Project {project} />
	{/each}
</article>

<style>
	article {
		display: grid;
		row-gap: 4rem;
		padding-bottom: 4rem;
		background-color: var(--off-white);
		padding-top: 2rem;
	}
</style>
