---
title: Bacchus Atlas Expanded
client: Self
date: 2021-11-06 16:00:00
img: /projects/bacchus_atlas_expanded_screencap.png
description: A React app for cataloging and geo-locating wine with a GraphQL  and KeystoneJS backend. Sadly, the site is no longer active.
link: https://www.bacchusatlas.com/
tags:
  - Next.js
  - React
  - GraphQL
  - Apollo
  - KeystoneJS
---

## My first big JavaScript Project

Bacchus Atlas was a rework of the original page I built in Gatsby, after learning the limitations of the Sanity backend. This site is build in NextJS. It utilizes Apollo and GQL. It runs KeystoneJS on the backend to handle authentication, and runs postgres for its database.

It is still a work in progress, but essential functionality is in place. A user can log in, add wines to the database, geolocate them on a map, and rate them.

## What I learned from this project

I learned quite a bit from this project. I learned the basics of modern JavaScript frameworks working in Next. I learned that GraphQL and Apollo add _significant_ overhead: I would avoid them in the future unless I have complex data fetching needs. At the time, this project was using a version of Keystone in beta. I would not do that again. The documentation was horrible, I hit undiscovered bugs, and it was tough to find answers to questions online. React is great until you use a newer framework like Svelte. It's hard for me to go back and work on this project now, because the DX is so much worse.
