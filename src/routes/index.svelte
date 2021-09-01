<script context="module">
	const allPosts = import.meta.glob('./blogposts/*.md');
	let body = [];
	for (let path in allPosts) {
		body.push(
			allPosts[path]().then(({ metadata }) => {
				return { path, metadata };
			})
		);
	}

	export const load = async () => {
		const posts = await Promise.all(body);
		return {
			props: {
				posts
			}
		};
	};
</script>

<script>
	import Selfie from '$lib/assets/self2.png';
	export let posts;
	const dateSortedPosts = posts.sort((post1, post2) => {
		return new Date(post2.metadata.date) - new Date(post1.metadata.date);
	});
</script>

<svelte:head>
	<title>Aaron Hubbard Web Dev</title>
</svelte:head>

<main>
	<section class="bio">
		<figure>
			<img src={Selfie} alt="selfie" />
		</figure>

		<header>
			<h1>Aaron Hubbard</h1>
			<h2>Jamstack Developer</h2>
			<h3>Building fast and functional things for the web</h3>
		</header>
		<section>
			<p>
				Hi! I'm Aaron Hubbard, a family-man and web-developer based in Asheville, NC. By day, I'm an
				application administrator for NOAA's CLASS project. In my free-time, I'm learning more and
				more about making modern websites.
			</p>
			<p>To see some examples of my work, <a href="/projects">check out my projects</a>.</p>
			<p>Drop me a line using the contact link.</p>
		</section>
	</section>

	<section class="blog">
		<h1>Blogposts</h1>
		<ul>
			{#each dateSortedPosts as { path, metadata: { title, tags, date } }}
				<li>
					<h2>
						<a href={`${path.replace('.md', '')}`}>{title} </a>
					</h2>
					<h3>
						{new Date(date).toDateString()}
					</h3>

					<div class="tags">
						{#each tags as tag}
							<a class="tag" href={`/tags/${tag}`}>#{tag} </a>
						{/each}
					</div>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		display: grid;
		row-gap: 4rem;
		column-gap: 2rem;
		justify-items: center;
		height: 100%;
		background-color: var(--nord6);
	}

	main:first-child {
		padding-left: 2rem;
	}

	h1,
	h2,
	h3,
	p,
	li,
	a {
		font-family: 'Rubik', sans-serif;
		color: var(--nord0);
	}
	h1 {
		font-size: 3rem;
	}
	p {
		font-size: 1.25rem;
		font-weight: 400;
	}

	/* sections */

	/* bio */
	figure {
		display: grid;
		justify-items: center;
		align-items: center;
	}
	figure img {
		max-height: 30vh;
	}

	.bio {
		padding-top: 3rem;
	}
	.bio h1 {
		font-size: 4rem;
		color: var(--nord0);
		margin: 1rem 0;
	}
	.bio h2 {
		font-size: 3rem;
		margin: 1rem 0;
		color: var(--nord7);
	}
	.bio h3 {
		font-size: 1.5rem;
		margin: 1rem 0;
		color: var(--nord9);
		font-weight: 700;
		text-transform: capitalize;
	}
	.bio section {
		margin-top: 2rem;
	}
	/* blog */
	.blog {
		background-color: var(--nord4);
		/* grid-column: span 2; */
		width: 100%;
		padding: 2rem;
		height: 100%;
	}
	.blog .tags {
		margin-left: 1rem;
		display: flex;
		flex-wrap: wrap;
	}
	.blog .tag {
		background-color: var(--nord9);
		color: var(--nord6);
		font-size: 0.85rem;
		font-weight: 700;
		padding: 0.5rem 0.75rem;
		border-radius: 0.75rem;
		margin: 0 0.5rem 0.5rem 0;
	}
	.blog .tag:hover {
		background-color: var(--nord15);
	}
	.blog h2 {
		margin: 0 0 1rem 0;
	}
	.blog h3 {
		margin: 0 0 1rem 1rem;
		font-size: 1rem;
	}
	.blog li {
		margin-bottom: 2rem;
	}

	/* breakpoints */
	@media only screen and (min-width: 600px) {
		main {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
