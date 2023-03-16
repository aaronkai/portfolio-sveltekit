<script>
	export let project;
</script>

<div class="grid grid-rows-[auto,_1fr] my-3 border rounded shadow bg-stone-200">
	<figure>
		<img
			src={project.metadata.img}
			class="w-full  border-b-2 rounded-t shadow border-stone-500"
			alt="screenshot of project"
		/>
	</figure>
	<section class="grid items-center justify-center px-6 py-16 rounded-b shadow-md gap-y-12">
		<h2 class="text-3xl font-bold text-center uppercase text-stone-900">
			{project.metadata.title}
		</h2>
		<p class="text-center text-stone-900 ">{project.metadata.description}</p>
		<div class="flex justify-around">
			<a href={`/${project.path.split('/')[1]}/${project.path.split('/')[2]}`}>Details</a>
			<a href={project.metadata.link}>Go To Site</a>
		</div>
	</section>
</div>

<style>
	a {
		@apply flex items-center justify-center px-3 py-1 font-bold uppercase transition duration-300 ease-in-out transform rounded text-stone-100 bg-emerald-600 hover:bg-emerald-800  hover:scale-105 shadow;
	}
</style>
