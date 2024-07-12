---
title: 📓 Week 39 of 2023
tags:
  - aws
  - cloudflare
  - time blocking
date: 2023-09-27 17:00:00
description: Work Notes for the 39th Week of 2023
---

## Let's Get Organized

After a bit of a foray into BG3, I'm trying to buckle down. Inspired by a recent meeting with a friend, I'm going to try some time blocking and journaling. I've divided my day into a few chunks. Work work. Dev work. AWS study.

## Dev Work

### 9/27

I logged into my portfolio site to learn that it had not completed a build in months. It had been running the last successful deployment, and the changes I had been making were so minor that I hadn't noticed.

Changes I was making to the repo were not being passed down to Cloudflare. It was not immediately obvious what was going wrong. After poking around, I learned that Github had invalidated Cloudflare's permissions to pull from the repo. After getting that straightened out, I am able to see changes reflected once more.
re
I wrote a little blogpost for the F3 website I made, but my heart wasn't really in it.

I'm excited to begin a new site. I think I want to make a simple, stand alone body-fat calculator. I have one already, but it's nested in a weight-lifting app I don't use any more. I'm thinking I want something clean, simple, and fun. I'm going to try out Astro 3, as I've been hearing about it in the aether.

### 9/28

I logged into Porkbun this morning to make sure that my domain was set to auto-renew. Clicked on the wrong button and was sent to my site, only to see an internal 500 error. Fired up the site in dev and I see that I had a colon in my frontmatter, and that broke the site. :tongue: Easy fix.

## AWS work

I got an email from AWS telling me my 1-year free plan was going to expire. Yeesh. Luckily, I recently had Apple host an email server for me tied to my aaronhubbard.dev domain. This is starting to feel like a life-hack for techies. So many orgs assume creating a new email account is non-trivial, and use this friction to lock you into a user account. Well, NYT and AWS, say hello to my disposable email accounts!

## Arch Issues

For some reason I started having network issues today. I'm not exactly sure what the issue was. I checked on my router, and my DHCP reservation did not exist for my desktop. I am thinking I may have have my address stepped on by another device, for post-reboots I would have a moment of connectivity and then nothing, but I was able to ping the gateway. Just not beyond it. I made the DHCP reservation on my router, rebooted the network to force everything to reapply for an IP address, and re-ran the script I wrote to activate my network interface on Archbox. This seems to have done the trick. Ah, the joys of using Arch when you actually want to get some work done. Sometimes I think of going back to Fedora 🤔
