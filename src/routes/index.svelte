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

<main class="grid h-full gap-12 bg-stone-200">
	<section class="grid gap-8 p-5">
		<header class="grid gap-4">
			<figure class="grid items-center justify-items-center">
				<img class="max-h-[30vh]" src={Selfie} alt="selfie" />
			</figure>
			<h1 class="font-bold text-7xl text-fuchsia-700">Aaron Hubbard</h1>
			<h2 class="text-4xl font-bold text-emerald-700">Jamstack Developer</h2>

			<h3 class="text-2xl font-bold capitalize text-emerald-700">
				Building fast and functional things for the web
			</h3>
		</header>
		<section class="grid gap-3 font-sans text-xl text-stone-900">
			<p>
				Hi! I'm Aaron Hubbard, a family-man and web-developer based in Asheville, NC. By day, I'm an
				application administrator for NOAA's CLASS project. In my free-time, I'm learning more and
				more about making modern websites.
			</p>
			<p>To see some examples of my work, <a href="/projects">check out my projects</a>.</p>
			<p>
				If you want to hear me ramble about what I'm working on right now, check out my blog posts
			</p>
			<p>Drop me a line using the contact link.</p>
		</section>
	</section>

	<section class="px-5 py-16 blog bg-stone-800 text-stone-100">
		<h1 class="mb-10 text-5xl font-bold text-fuchsia-400">Most Recent Blogposts</h1>
		<ul class="grid gap-6">
			{#each mostRecentPosts as { path, metadata: { title, tags, date } }}
				<li>
					<h2 class="mb-3 text-2xl font-bold underline text-emerald-300">
						<a href={`${path.replace('.md', '')}`}>{title} </a>
					</h2>
					<div class="flex ">
						{#each tags as tag}
							<a
								class="px-3 py-1 ml-3 rounded-sm text-stone-900 bg-fuchsia-300"
								href={`/tags/${tag}`}
								>#{tag}
							</a>
						{/each}
					</div>
				</li>
			{/each}
		</ul>
	</section>
	<section class="px-3">
		<h1 class="mb-6 text-5xl font-bold text-fuchsia-700">Featured Project</h1>
		<ProjectCard project={featuredProject} />
	</section>
</main>
