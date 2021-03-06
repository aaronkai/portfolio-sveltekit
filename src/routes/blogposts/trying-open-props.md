---
tags:
  - Open-Props

date: 2022-02-24 16:30:00
title: Trying out Open-Props
description: Let's give Open-Props a shot!
---

## What a Month!

Lordy, what a month! This has been a month where you just try to stay above water 🏊‍♂️. My dad is having health problems, so I've spent the last two weeks on the phone a lot with the hospital/nursing-home or in Michigan doing triage. Not a lot of fun, and not conducive to learning new job-adjacent skills.

## Open Props

I made a snap decision to switch Spookysets over to [Open Props](https://open-props.style) in order to try it out. Open Props is a modular design system that leverages CSS variables to provide a design framework for you to use. I'm hearing murmurings that it is the way forward. After some time playing around, here are my observations:

### Pros:

1. Design frameworks are good. I don't want to have to invent a design language for every project I work on, and I'm not very good at it anyway. Having someone that is good at design provide me with a toolset to reach for is a big help. Tailwind is one such example, Open Props is another.

2. Less headache to set up. With OpenProps, you don't have to worry about post-processing your CSS. This means one less package to install, one ( or more) less config files to understand and maintain, more complications at deployment time. I like the idea of having my design framework live in native CSS.

3. Adam Argile is doing cool stuff with CSS, and it's been fun just to study his code and pick up some neat tricks. I learned one with text-shadow/blur to make my text look like glowing neon. Super cool!

### Cons:

1. The documentation isn't there yet. I keep feeling like there's a missing manual.

2. The complexity has to live somewhere. For Open-Props, I think the complexity lives in a tangled web of css variables that reference each other. Like, is it easier to remember that you have a padding of 1rem on all of your card items, or that you use 'var(--card-padding) which references '--card-padding: var(--size-3)' which in turn is in the bowels of the open-props code set to 1rem? And then to remember where you are declaring your custom properties. It feels like I'm making more work for myself when the object is to make less work. Perhaps if you have a large site and team, these upfront costs are worth the expenditure. I'm not sure they are worth it for me.

As an example...I was trying to apply a box-shadow to a button on my dark-themed site. I applied the shadow open-prop to the div, but no shadow appeared. Huh, weird. When I looked at the website, it was using the same dark background as I was, the same shadow property as I was, but the shadows looked different. Why? According to the documentation, the shadows should look correct on light and dark backgrounds without intervention.

I started looking into the code of the docs, and it looked like some additional custom-properties were being layered on top of the open-prop properties. One of those was defining the shadow color and passing it into the open-prop box shadow prop, which uses --shadow-color to determine the box-shadow. When I applied this custom property on top of the open props, my shadow looked like the documentation.

But why wasn't it working automagically? Well, looking further, open-props is using an OS defined theme variable, which in a perfect world is passed to the browser, to determine what theme the user prefers. In my unfortunate case, Arch is not declaring that variable, so my site believes that I prefer light-mode. Open-props is then using the light-theme box-shadow over my dark background, making it nearly invisible.

All of this took hours to unravel in CodePens and on the Discord. Maybe I'm the dummy here, and if I understood site theming and CSS variables better, this wouldn't be a problem. But at the end of the day, I want something that 'just works', and this isn't 'just-working' for me.

3. Mr. Argile's code can feel code-golfy to me. Maybe to someone that lives on the cutting edge of CSS, it doesn't feel this way, but someone that is not a CSS expert, it can feel a bit opaque. For example:

```css
.card {
	border-radius: var(--radius-2);
	padding: var(--size-fluid-3);
	box-shadow: var(--shadow-2);

	&:hover {
		box-shadow: var(--shadow-3);
	}

	@media (--motionOK) {
		animation: var(--animation-fade-in);
	}
}
```

Is this all CSS, or is there postCSS in here too? I think at best Adam is using proposed CSS language here, and using postCSS to polyfill it for the browser. It's very forward looking, and for someone that needs to prove they are on the cutting edge of CSS, it's necessary. For someone like me that just needs code that they can understand and potentially explain in a coding interview, this sort of thing is a headache, even if it does expand my knowledge.

## EDIT 1

Spent some time pouring over the Open Props docs. This is feeling less like a design framework and more like an opinionated demo on next-gen CSS. Pretty wild what Adam is able to do with pure CSS. I need to keep looking at this, I may come around yet.

## What's Next

There's so much up in the air right now ✈️. Will I have to go back to the office? Will my contract be renewed? Will I ever get a web-dev job? What's my next project going to be?
