---
title: Stepping on a Bug 🐛
tags:
  - SvelteKit
  - bugfix
date: 2022-05-12 16:00:00
description: Squishing a bug
---

## The Issue

My Lent website is supposed to show you the reflection from the current day of Lent, if we are in Lent. Otherwise, it should show you the reflection from the first day of Lent. Instead, the site is stuck on day 41 for some reason 🤔

Going in, I know that the site is querying the date of Easter from Google Calendar API, and then subtracting days to calculate the start of Lent. Then it should calculate the number of days between today and the start of Lent. If today is a day within lent, it should display that page, otherwise, display day 1. Let's take a look...

## Oh good, it's only happening in production

Firing up my development environment locally, I see that the problem is only happening in production. Awesome! I'm fairly sure I've had this problem before, and I'd be willing to bet that there's an issue with connection to the Google Calendar API.

However, another thing occurs to me...Perhaps the issue is that the site was built on day 40 of lent, and is not regenerating every time I hit the page. I'm going to test this theory by going to cloudflare and redeploying the build to see if the site is built on the correct day.

I rebuilt the page, and now at least the correct day is highlighted in the sidebar. However the content is still wrong and I'm wondering if it was cached.

## How does this site even work 😲

So, in a perfect world the layout file for the index page hits the dates.json, gets the current day of Lent, if we're in lent, and otherwise passes day of zero to the index page, which in turn fetches the relevant markdown file to serve the visitor.

The problem is that since we're out of Lent, I can't debug the issue, since zero is being passed, post-rebuild and Cloudflare-cache-purge. Hmm.

I added a "current-date" to the info returned by dates.json, which I am having the \_layout file pass to the Footer. Now I can at least see the date the page was built. I can check back in soon and see if there's a caching/build issue.

## Resolution

Oh bother. Looks like I set prerender=true in svelte.config at some point. Cloudflare was displaying the site as a static rather than dynamic site. That'll probably do it 🤦

## Going forward

I think this might be a good test case for the testing library that is now shipping with Svelte. It would be cool to learn how to stub out the Google Calendar API.

## Follow up

I checked on this the following day. The date in the footer was current for all pages, which means that I was not correctly understanding how prerendering works. I expected the time in the footer of the index page to be current when I hit the index page, but to the build time for the static pages that were not the index page. Perhaps the client-side router is keeping everything but the text section intact when it navigates between pages. I'm going to dig in further.
