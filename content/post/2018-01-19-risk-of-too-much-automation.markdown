---
draft: true
title: "Is there such a thing as too much automation?"
date: 2018-01-22
description: "Thinking of automation as a competitive cognitive artifact, and on ways to minimise the associated risks"
categories:
    - automation
tags:
    - automation
author: Tom Partington
excerpt: "Automation is fantastic for many reasons - it saves time, reduces errors, and enables people to perform extremely complex tasks with little to no understanding of what is being done directly. But by automating everything are we setting ourselves up for disaster? What happens when something goes wrong and the people who built the automation have all left?"
---
A recent discussion at Cevo HQ came onto the topic of satellite navigation and how lost we would be without it, how in the good old days of street directories you were generally only lost the first time you travelled to a new location. This led on to a discussion of the work of [David Krakauer](https://www.santafe.edu/people/profile/david-krakauer) and the concepts of complementary and competitive [cognitive artifacts](http://nautil.us/blog/will-ai-harm-us-better-to-ask-how-well-reckon-with-our-hybrid-nature).

A complementary cognitive artifact is something which you learn from. A map is a great example, when you study one it improves your mental model of an area and this understanding mostly remains even when the technology itself is taken away. Similarly, people who become experts at using an abacus can use a mental model of one to perform extraordinary calculations without the physical device. In this way these technologies compliment our own mental abilities.

A competitive cognitive artifact on the other hand is something which performs a task on our behalf, offloading our own mental processing of the task. Satellite navigation means we no longer need to develop a mental model of our surrounding area but instead just listen to whether we need to turn left, right or to continue straight ahead. A calculator lets us perform incredible calculations but it does not improve our ability to calculate without it.

This discussion got me thinking about the role of automation as a competitive cognitive artifact, and I started wondering *is there such a thing as too much automation?*

Automation is fantastic for many reasons - it saves time, reduces errors, and enables people to perform extremely complex tasks with little to no understanding of what is being done directly. But by automating everything are we setting ourselves up for disaster? What happens when something goes wrong and the people who built the automation have all left? Are we, like the characters of E.M. Forster’s short story, doomed when [The Machine Stops](https://en.wikipedia.org/wiki/The_Machine_Stops)?

Maybe.

#### Making automation a complimentary cognitive artifact

All too often I come across scripts which are automating a number of tasks but are needlessly hiding the details. Sometimes they print what is being done, but rarely do they show how.  For example a script might print out a detail like
```bash
	# restarting web-server
```
and while this is useful we can make this much more valuable by including the detail of how the script is doing this:
```bash
	# restarting web-server: sudo systemctl restart nginx
```
While this doesn't force us to learn the steps in quite the same way as if we had no automation, we are no longer hiding the details away, which will give us a better idea of what is happening. Should something go wrong we'll no longer need to dig through the source code to find out (possibly for the first time) what the script was doing.

#### Preventing skills atrophy from relying on automation

Another method to prevent automation from limiting our understanding of our systems is to occasionally go without it. In the same way the pilots are required to spend a certain number of hours in a simulator to keep their skills fresh we should be encouraging the same of our engineers in the form of [Game Days](https://queue.acm.org/detail.cfm?id=2371297). During a Game Day a fault is purposefully introduced into a system, one of the benefits is that it gives responders an opportunity to practice incident response and debugging techniques in a low stress environment, so that they are more easily able to use these skills during a higher stress time, such as at 3am during a full production outage.

#### Accepting automation as a competitive cognitive artifact

Alternatively we can also accept that automation provides a level of abstraction that reduces our understanding of how things work under the covers, and instead of trying to maintain this understanding of everything we can instead focus or efforts elsewhere. The fact that we no longer need to worry about racking servers and installing operating systems or even configuring services such as elasticsearch, postgres or apache means we have more time to solve far more [interesting problems](https://www.cevo.com.au/case-study/).

And ultimately, we can generally always reverse engineer how something as done, the far more critical thing we need to understand is [why](https://cevo.com.au/culture/2017/02/28/devopsdays2016.html)?
