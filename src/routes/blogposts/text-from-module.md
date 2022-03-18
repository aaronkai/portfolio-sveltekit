---
title: How To Get Markdown Text from a Vite Glob Import
date: 2022-03-17 16:00:00
description: Working out the last mile of a coding problem.
tags:
  - SvelteKit
  - Vite
  - ES Modules
  - Promises
---

## Extracting text from a module on the SvelteKit backend

I was working on my SvelteKit Markdown blog and ran into a snag. I wanted to be able to make a [table of contents](https://www.aaronhubbard.dev/blogposts) page that displayed not only metadata from the markdown files (as is commonly demonstrated in online examples) but also the text from the latest post.

Doing this proved a little trickier than I anticipated, so I thought I'd share the code for the next neophite that comes along. This code borrows heavily from [The blog of Josh Collinsworth](https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog). I recommend you read it. I'll not explain things that Josh already covers. However, there was a lot here that I had to look up, neophite that I am.

```js
//blogposts.json.js
export const get = async () => {
	const allPostFiles = import.meta.glob('./blogposts/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const resolvedPost = await resolver();
			const { html } = resolvedPost.default.render();
			const postPath = path.slice(2, -3);

			return {
				meta: resolvedPost.metadata,
				path: postPath,
				html: html
			};
		})
	);

	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.meta.date) - new Date(a.meta.date);
	});

	return {
		body: sortedPosts
	};
};
```

In SvelteKit, the endpoint will be loaded automagically into page props for pages with the same name.

```js
export const get = async () => {
	const allPostFiles = import.meta.glob('./blogposts/*.md');
```

We start by creating an asychronous function. We use [Vite's _glob imports_](https://vitejs.dev/guide/features.html#glob-import) to pull in the markdown files. Interestingly, this pulls in an object whose key is the path to the module, and whose value is the module itself. I believe Vite uses [ES6 dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to do this.

```js
const iterablePostFiles = Object.entries(allPostFiles);
```

Next, we create an iterable object using Object.entries, which creates an array of arrays. The interior arrys are the key/value pairs.

```js
	const allPosts = await Promise.all(
    iterablePostFiles.map(async ([path, resolver]) => {
          const resolvedPost = await resolver();
          const { html } = resolvedPost.default.render();
          const postPath = path.slice(2, -3);

          return {
            meta: resolvedPost.metadata,
            path: postPath,
            html: html
          };
    };
```

Now, we iterate over the new array. We destructure the array, pulling out the path and the resolver/module. We await the return of this promise of module. It has a function named default, which in turn has a function called render, which returns an object out of which we can destructure the html. Now we have the body of the markdown file, rendered as HTML!

We return an object from the function that contains the metadata, the path to the markdown file, and the html body. Neat!
