<script context="module">
  const allPosts = import.meta.glob("../blogposts/*.md")
  let body = []
  for(let path in allPosts){
    body.push(allPosts[path]().then(({metadata}) => {
      return {path, metadata}
    })
    );
  }
  
  export const load = async({page}) => {
    const posts = await Promise.all(body);
    const tag = page.params.tag;
    const filteredPosts = posts.filter((post) => {
      return post.metadata.tags.includes(tag);
    });

    return {
      props:{
        filteredPosts,
        tag,
      },
    };
  };
</script>

<script>
  export let filteredPosts;
  export let tag;

</script>

<h1>{tag}</h1>
{#each filteredPosts as post}
  <li><a href="post.path">{post.metadata.title}</a></li>
{/each}