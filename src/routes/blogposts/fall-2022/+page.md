---
title: Ch-Ch-(breaking)-Changes
tags:
  - React
  - Vite
  - SvelteKit
date: 2022-10-04 17:00:00
description: Returning to React and SvelteKit
---

## New Project: Another Workout Planner

We're back in the office two days a week, which means I'm back in my beloved gym two days a week as well. I decided I'd use the opportunity to build another workout tracker, this time for 5/3/1. [Here's what we have so far](https://workout.aaronhubbard.dev).

I wanted to return to actual marketable job skills, so I decided to build this project using React + Vite.

I'm tracking my issues with Github Issues this time, which is a big quality of life improvement vs. a ToDo app.

It's crazy how every project starts out seeming so simple, and how quickly the issues multiply and complexity compounds. Because I started out with such simple goals, the project is proving an engaging opportunity to work on my refactoring ability.

## Other considerations: Cloud IDE ☁️

I wanted to be able to code in a cloud IDE for this project. Initially I was using [StackBlitz](https://stackblitz.com), but there are still too many cases where you'll get some weird issue that costs you hours to troubleshoot. This time around it was that StackBlitz wasn't passing cookies in the header. After a fair bit of troubleshooting I found the GitHub issue. 😦

So ok, I think I really need an actual container to develop in and not just browser magic like StackBlitz is attempting. I tried going back to AWS Cloud9 because I've used it before, but it also requires a lot of set-up, and the IDE is pretty bad.

Finally, I found [GitPod](https://gitpod.io). It has a container-based product. It has VSCode as the IDE. It has great Github integration (unlike StackBlitz), and as icing on the cake, the free plan is generous. 👌

## Updating the portfolio site 🤺

I started a container to update this portfolio, and I was dismayed that the project wouldn't build. Turns out using package-version "next" in conjunction with a rapidly changing framework in beta has some downside 🤔.

After poking around, I learned that SvelteKit totally overhauled their routing and the way their endpoints work. It's taken me the better part of a day to run their migration tool and then go back and try to fix everything that broke. The tool worked fairly well, but failed to realize I needed server endpoints to use Vite to fetch the posts and projects that the site serves.

The good news is that I think I have everything straightened out until the next round of breaking changes 🙌.
