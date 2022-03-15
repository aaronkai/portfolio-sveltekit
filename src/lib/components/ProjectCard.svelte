<script>
	export let project;
</script>

<div class="grid border rounded shadow">
	<div>
		<img
			src={project.metadata.img}
			class="w-full h-full border-b-2 rounded-t shadow border-stone-500"
			alt="screenshot of project"
		/>
	</div>
	<div class="grid items-center justify-center px-6 py-16 rounded-b shadow-md">
		<div class="grid gap-y-12">
			<h2 class="font-bold text-center uppercase text-stone-900 cardtitle">
				{project.metadata.title}
			</h2>
			<p class="text-xl text-center text-stone-900 ">{project.metadata.description}</p>
			<div class="flex justify-around">
				<a
					class="px-2 py-1 text-lg font-bold uppercase transition duration-500 ease-in-out transform border-2 rounded text-stone-900 border-stone-900 hover:bg-stone-300 hover:scale-110"
					href={project.metadata.url}>Details</a
				>
				<a
					class="px-2 py-1 text-lg font-bold uppercase transition duration-500 ease-in-out transform border-2 rounded text-stone-900 border-stone-900 hover:bg-stone-300 hover:scale-110"
					href={project.metadata.link}>Go To Site</a
				>
			</div>
		</div>
	</div>
</div>
