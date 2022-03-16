<script context="module">
	//fetch all posts
	const allPosts = import.meta.glob('./blogposts/*.md');
	let body = [];
	for (let path in allPosts) {
		body.push(
			allPosts[path]().then(({ metadata }) => {
				return { path, metadata };
			})
		);
	}
	//fetch all projects
	let body2 = [];
	const allProjects = import.meta.glob('./projects/*.md');
	for (let path in allProjects) {
		body2.push(
			allProjects[path]().then(({ metadata }) => {
				return { path, metadata };
			})
		);
	}

	// feed posts to page as props
	export const load = async () => {
		const posts = await Promise.all(body);
		const projects = await Promise.all(body2);
		return {
			props: {
				posts,
				projects
			}
		};
	};
</script>

<script>
	import Selfie from '$lib/assets/self2.png';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	// get props
	export let posts, projects;
	// sort blogposts by date and return most current 3
	const dateSortedPosts = posts.sort((post1, post2) => {
		return new Date(post2.metadata.date) - new Date(post1.metadata.date);
	});
	const mostRecentPosts = dateSortedPosts.slice(0, 3);
	//pick a project to be the featured project
	const [featuredProject] = projects.filter((project) => {
		return project.metadata.title === 'Spooky Sets';
	});
</script>

<svelte:head>
	<title>Aaron Hubbard Web Dev</title>
</svelte:head>

<main
	class="grid items-start h-full px-3 last:py-9 bg-stone-100 gap-9 md:grid-cols-2 md:gap-y-12 md:gap-y-16"
>
	<section class="grid md:grid-cols-[auto_1fr] gap-12 items-center md:col-span-2">
		<figure class="grid items-center justify-items-center">
			<img class="max-h-[40vh]" src={Selfie} alt="selfie" />
		</figure>
		<div class="grid gap-6 text-stone-800">
			<h1 class="text-2xl md:text-5xl font-bold text-stone-800 max-w-[70vw]">
				I'm Aaron Hubbard, a <a href="https://github.com/aaronkai">Jamstack Developer</a>, a
				<a href="https://www.instagram.com/p/CVJmDN-AFbQwIwD9kF2dv9l8IDtB-NtVdJMdJ40/">dad</a>, and
				a
				<a href="https://photos.app.goo.gl/pb8RjhBWJ6HPkeMx8">middling fingerpicker</a>.
			</h1>
			<p class="md:text-xl max-w-prose">
				By day, I'm an application administrator for NOAA's CLASS project. In my free-time, I'm
				learning more and more about making modern websites.
			</p>
		</div>
	</section>
	<section class="grid gap-3">
		<header class="grid grid-cols-[3fr_1fr]">
			<h1 class="text-3xl font-bold text-stone-800">Latest Posts</h1>
			<a
				class="flex items-center justify-center font-bold rounded shadow text-stone-100 bg-emerald-600"
				href="/blogposts">Archive ></a
			>
		</header>
		<ul class="grid">
			{#each mostRecentPosts as { path, metadata: { title, description, date } }}
				<li class="border-t border-stone-400">
					<h2 class="my-3 text-2xl font-bold text-stone-800">
						<a href={`${path.replace('.md', '')}`}>{title} </a>
					</h2>
					<p class="text-stone-800">{description}</p>
					<p class="mb-3 text-stone-800">{new Date(date).toLocaleDateString()}</p>
				</li>
			{/each}
		</ul>
	</section>
	<section class="grid gap-3">
		<header class="grid grid-cols-[2fr_1fr]">
			<h1 class="text-3xl font-bold text-stone-800">Project Highlight</h1>
			<a
				class="flex items-center justify-center font-bold rounded shadow text-stone-100 bg-emerald-600"
				href="/blogposts">All Projects ></a
			>
		</header>
		<ProjectCard project={featuredProject} />
	</section>
</main>

<style>
	header a {
		@apply flex items-center justify-center px-3 py-1 font-bold  transition duration-300 ease-in-out transform rounded text-stone-100 bg-emerald-600 hover:bg-emerald-800 hover:scale-105;
	}
	h1 a {
		@apply underline text-emerald-600 decoration-emerald-400 decoration-2 underline-offset-4 transition duration-300 ease-in-out transform hover:text-emerald-800;
	}
</style>
