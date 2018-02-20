---
title:  "Mapping system couplings and dependencies for discovery and profit"
description: Crowdsourcing and social engineering combined with open-source tools to map your systems
twittercreator: nonspecialist
date:   2016-11-27
categories:
    - tools
    - devops
    - methods
tags:
    - graphviz
    - discovery
author: Colin Panisset
images: blog/mapping-systems-blog.png
thumbnail: blog/mapping-systems-blog.png
date: 2016-11-27
excerpt:
    Have you ever wondered just what would break if _that system_ (you know the one) went down?  Do you actually _know_ what systems depend on it? How do the reports get from it to Marketing? In this post, I'll describe a simple technique I've developed to surface and share all this juicy, interesting information.
url: tools/devops/methods/2016/11/27/mapping-system-coupling.html
---

Have you ever wondered just what would break if <em>that system</em>
(you know the one) went down?  Do you actually <em>know</em> what systems
depend on it? How do the reports get from it to Marketing? In this post,
I'll describe a simple technique I've developed to surface and share
all this juicy, interesting information.

## The Problem, Restated

Systems grow and morph over time, quite naturally. This happens for a
variety of reasons: lack of time or experience are the most common,
and neither are cause for blame.  Even in environments
that are strictly controlled (for example, about systems that come
under the aegis of external regulators), these systems end up being
coupled to others in ways that may not have been planned. In most older
environments, there are human elements to this coupling: Bob, over there,
is a critical part of the deployment process, or Karen up on Level 15
is the only way the reports get from the database over to Sales (via the `Z:`
drive, of course), and that's the way it's always been.

The risks to the business here are many:

* system changes or interruptions can have unforseen consequences; how
  many times have you heard the phrase "it was supposed to be a simple
  upgrade", usually followed by "but ..." and then a tale of horror
  unfolds?
* individual people who are critical parts of processes can become sick,
  leave, or worse; this is somewhat morbidly referred to
  as the "bus factor" (what happens if Jenny goes under a bus?);
* knowledge of how an environment actually works is held as "oral
  tradition" which fades and mutates over time,
  leading to expensive and time-consuming discovery, whether before
  change or after, in the process of picking up the pieces;
* perhaps worst, the perceived risk of change becomes so great that it
  exceeds the organisational appetite, and the system ossifies in
  place. At that point, the organisation is effectively dead in the
  water.

## What to do?

The solution is simple to state, but challenging to implement: you have to get
a representation of the system, the _real_ system, how it actually
works _right now_, out of people's heads and into some kind of map.

It sounds easy, right? And it can be, although it must be understood
that this takes time, it takes effort, and above all, it takes the
ability to engage with the people who hold that knowledge in an
atmosphere of trust and openness, because if the ones who really know
how things work fear recrimination for the _way_ those things work,
you'll never get the real picture.

There are 4 stages:

### Stage 1: Capture some raw data

1. Get a few knowledgeable people in a room, with a large enough
   whiteboard (or butcher's paper, or post-it notes, or whatever). This
   doesn't have to be the whole team, and (unless they built the
   system and have run it themselves), it shouldn't be anyone with
   Solution Architect, Manager, or Analyst in their title. You need
   folks who map to "Engineer", "Operations", or "Support" in that
   room.
1. Start a conversation about a system that those people own and run
   in production. Resist the temptation to try and describe your whole
   production environment in one session; if you can do that, you
   don't need this method.
1. Draw boxes on the whiteboard for hardware, people, individual
   pieces of software (programs), databases, message queues, messages,
   and external third parties. Connect them with arrows that indicate
   coupling. These are usually "sends data to", or "depends on".
   The direction of the arrows indicate the direction of the data flow
   or dependency. You can annotate arrows with the type of connection,
   if you want (HTTP, SQL, etc)
1. Resist the temptation to make it too neat. That'll be fixed later.
1. When your session is done, take a photo for reference. You'll need
   it.

### Stage 2: Create a directed graph

1. Using Your Favourite Directed Graph Mapping Software (I like
   [GraphViz](http://graphviz.org) and my examples will use it),
   turn the whiteboard scrawl into a directed graph of nodes and edges.
1. Apply colours and annotations to the nodes and edges to distinguish
   types of nodes (databases, humans, etc) and types of edges (HTTP,
   SQL, email, USB stick, etc)
1. Use a version control system to capture the source code of the graph.
   You'll need this because it will change, and you'll find it useful
   to be able to look back to a particular point in time.

### Stage 3: Iterative improvements and information radiators

1. **Print the graph out** and stick it up in a highly-visible common
   space. Put a sign next to it. The sign says "This map is probably
   wrong. Please help fix it". Stick a permanent marker next to the
   map. Draw one correction line on it (I'm sure you can find one
   mistake, right?) -- this last helps people understand that it really is
   ok to actually draw on the map, with a pen, yes for real.
1. Encourage people to draw on the map. This is critical! This is
   how you capture the "oh, I just remembered" and the "I was too
   ashamed to say it before" details. A measure of both anonymity and
   time-dependent opportunity is at work here.
1. Before the map becomes illegible from updates, take it off the wall
   and capture the changes in the map source code (version-controlled,
   of course, so you can illustrate changes over time)
1. Print it out again, stick it up, and repeat until the rate of change
   becomes low enough that it's now a visual radiator of the current state.

### Stage 4: The Payoff

If it's all gone according to plan, you now have a
map that's a good approximation of the territory that really exists.
You can, with a glance, see:

* points of high coupling and dependency. Some of these may be humans!
* bizarre, unexpected, and previously uncaught dependencies between
  systems
* just what a tangled mess your system is

Take heart: _every_ organisation's systems are a tangled mess. I have
yet to see one that doesn't have, somewhere, either a specific person
as a critical point of coupling, or a service that turns out to be
a synchronous dependency that wasn't expected. Remember: you haven't
made them be like this by mapping it, you've just uncovered what's
already there!

## Examples

A picture tells a thousand words, so here are some worked examples. The
source code for all of these examples is at [the Cevo system-map
repository](https://github.com/cevoaustralia/system-maps) in case you'd like
to use them as a basis for your own efforts.

### A web app that also sends an email

Sounds simple, right? You've got a webserver, an app server, a backend
database. That's it? Well, sure, except for how the code gets on to the
webserver. And where it's stored before that. And that app server, it somehow
gets a report to the external auditor every week. How does that actually
happen? A little digging reveals that there's also an internal microservice
that this application relies on to do authentication of users.

Perhaps it looks like this:

![Basic System With Humans](/img/blog/basic-system-with-humans.png)

Uh-oh. A quick glance shows us that:

* Bob is on the critical path for these reports. Perhaps he does something
  important to them before they're sent to the auditor, and he's just always
  been doing that. Maybe Bob wants to go on holiday for a month; what will
  happen to those reports?
* The database isn't replicated. If it dies, the whole system stops!
* Why is Jenny, a human, doing the deployments? Can anyone else do it? What
  if she leaves, or gets sick? Surely that part could be automated, leaving
  Jenny to focus on high-value work instead?

With a little more analysis we can start to see other things:

* The protocol coming in to the webserver is HTTPS but it's HTTP on the back
  end. This means that the webserver is terminating the SSL connections, and
  should have SSL certificates and keys installed and managed, but they
  aren't represented on the map. Best find someone who knows about that, and
  have them draw on the map!
* The internal authentication service is also over a plaintext protocol,
  which means username/password pairs are going over the wire in the clear.
* The fulfilment service seems to be scanning the database to find out what
  to do next, indicating that the DB is being used as a point of integration
  between applications; not a great pattern, as it introduces synchronous
  couplings that could impact availability.
* How does the fulfilment service even get deployed? Where does the code come
  from?

Now, this is a highly artificial example. In many cases, you wouldn't
actually show the flow of code into a complex graph, because it would get too
cluttered. Instead focus on a level that makes sense and is consistent -- eg
all the business-level data (user transactions, database traffic, etc) on one
map, the deployment pipeline on another, network maps on a third.

### A real system

This is an anonymised _real world_ system. If you've seen it before, you may
recognise it, but you won't be able to guess the organisation if you don't
know it already. I do apologise for the density of the graph.
However, some key things to note:

* See that blue node with a lot of magenta lines going through it? That's
  Daisy. Daisy is a critical single point for several finance systems
* An awful lot of things talk through one database
* There are synchronous couplings between systems owned and maintained by
  different teams and departments, implying human chains of communication
  about custodianship and negotiation for fixes and when versions change.

![Complex Example](/img/blog/complex-example.png)

## You're in charge

Maybe you've spent some time to map your systems, and uncovered a dragon;
perhaps you simply don't have time or capacity to do the mapping yourself;
or perhaps you've mapped your system thoroughly, and want some help
untangling it. In any of these cases, if you're looking for a team who've
Been There and Seen That, and made it better, please give us a call!
