---
title: Back in the Saddle 🏇
tags:
  - SpookySets
  - TailwindCSS
  - Cloudflare
date: 2022-06-24 17:00:00
description: I'm Back!
---

## Life Happens

I haven't really done much coding since my Dad died. I think it was enough for me just to do my dayjob and be with my family. Processing grief takes many forms I suppose. For me it was playing Elden Ring and pursuing Catholicism in my free time. I've found both very rewarding.

The seasons change, however, and I feel the stirrings of ambition once again. The job market is supposedly tightening, and tech workers are being laid off in droves. Perhaps it was for the best that I didn't change jobs last year. Unfortunately, the professional Earth I stand on is never as firm as I would like, so I must keep learning.

## Return to Spookysets 👻

I've been continuing to dog-food my SpookySets workout app, and have a list of improvements I'd like to make. Upon opening it, I grew frustrated with my old frontend choices. I've tried a number of CSS options. Vanilla CSS. TailwindCSS. Open Props. Everytime I open an old project I don't remember what I used in that initial moment, and I always find myself hoping it was Tailwinds. I think that's the impetus I need to stop fighting that fight for now, and just settle on what works and what I like.

## Converting SpookySets

Initially, I tried just using @apply methods in my Svelte style blocks to convert my mix of vanilla CSS and OpenProps to Tailwinds. This worked to a point, but VSCode was throwing errors, and upon looking into them, I learned that Tailwind really doesn't want you to code this way. I see their point: you are basically recreating the structure of CSS. I think they underplay the frustration attendant with alt-clicking the mouse onto 5 HTML elements and pasting the utility classes in, but that's exactly what I did, for all 6 pages and a dozen components.

It took me about a day. I was a little annoyed to be going back and redoing the CSS for the third time on this project, but it was a great way to re-acquaint myself with the code.

hen it was time to push to Netlify, I was met with cryptic build errors. I took the opportunity to update my packages. No luck. I tried starting a new project and pasting in my few config files and src folder. Still no luck in Netlify. I tried Cloudflare Pages and it worked on the first try. Since I've been porting over apps to Cloudflare for a little while now, I took the opportunity to move the page over to Cloudflare. As of now, SpookySets is back up and running, now in TailwindCSS on Cloudflare!

## What's next? E-commerce!

I had a whimsical idea for some tee-shirts I thought about selling. I also frequent a menswear store whose website is looking quite long in the tooth. I thought it might be worthwhile to delve into the world of E-commerce and see the lay of the land. I think the biggest uncertainty for me is the payments & inventory systems. We built one in a Wes Bos class, but I think what I learned is that it is hard to do a professional job from scratch. I've been meaning to check out Shopify, so maybe that's where I start. I'll probably make it about as far as learning the cost before deciding maybe it's worthwhile to build your own after all.
