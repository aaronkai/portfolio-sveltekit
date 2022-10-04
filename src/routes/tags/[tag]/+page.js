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
  filteredPosts,
  tag,
};
};
