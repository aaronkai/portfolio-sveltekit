---
title: Reflections For Lent
date: 2022-03-17 16:00:00
img: /projects/lent3.png
description: A static site, built in Astro, to display the writing of St. Thomas Aquinas on Lent
link: https://lent.immanent.dev
tags:
  - Astro
  - Theming
  - Open-Props
---

## Meaningful Work

I've always found it tough to work on something that I didn't think the world actually needed or needed more of. Does the world really need one more undergraduate philosophy paper on Existential Ethics? Does the world really need another to-do app? 🤔 I try to keep my eyes peeled for needs that actually exist.

## Spiritual Journey

I've always been a seeker. I try to live by a code, and I take ethics seriously. Very recently I've been trying out Catholic Mass. I'm not sure how it's all going to work out, but as I was looking around I discovered these _Medititaions on Lent_ by St. Thomas Aquinas. It seemed that they were recorded either in weird formats or on ancient websites. I set about putting them in a static site so I could read them easily. Hopefully, others will benefit as well.

## Astro

I really want to like Astro 🚀 . I like the idea of "islands of reactivity". I like the intelligent defaults and the out-of-the-box functionality. _However_, while one benefits from these great features, one pays in full eventually.

Astro isn't really even in beta yet, afaik. I continually hit snags that were fixed in subsequent releases. I would upgrade the packages, only to hit other snags. Confusing concepts, like how scoped styles do or don't cascade, were complicated by documentation that was being reworked as I developed and bugs in HMR that were cropping up constantly and being squashed on an ongoing basis 😠.

On the bright side, I did get to file my first open-source PR!

I really like the project, but...

## Boring Tech

I was listening to [this](https://shoptalkshow.com/506/) episode of ShopTalk recently, and Dave mentioned a talk I hadn't heard of before: [Choose Boring Technology](https://boringtechnology.club).

The basic concept is that there is an adoption cost for every new thing you learn, and an ongoing cost for every different tech you have to maintain in production. Nonetheless, developers like shiny new things, especially when they don't have to maintain them, and are prone to reaching for new things. Instead, the talk argues, you should always reach for what you already use unless you can make a case that the work of retrofitting what you have will exceed the total cost of adoption of something new.

Ooof. Guilty as charged 🤯

I'm not sure I totally agree, but it's giving me some material to chew on. I think I'll fire it over to the syntax guys and see what they think.

## Theming

This was the first project I wrote multiple themes for 🌔 🔄 🌞. I used Open Props, and used the method suggested by Adam Argyle. I think it worked out very well. However, my feelings about Open Props somewhat mirror my thoughts on Astro. Both are awesome projects that don't seem ready for mass adoption.

## Update

In the end, I got grumpy and ripped out both Astro and Open Props. Regarding Astro, I finally hit one bug too many and decided the juice wasn't worth the squeeze. I ported the project to SvelteKit, making use of endpoints to serve the daily reflections. More or less the same thing happened with Open Props. At this point, I don't like opening a project and finding that I didn't use Tailwinds. It's easy, it's fast, and I'm familiar with it. I'm done thinking about this one for a while.
