---
title: "System Mapping Redux"
date: 2018-03-23T22:50Z
draft: true
description:
    System Mapping Redux
categories:
    - communication
    - systems thinking
    - discovery
tags:
    - system mapping
    - graphviz
author: Colin Panisset
excerpt:
    Expanding on the previous system mapping post to capture thoughts around capturing new kinds of data, keeping it up to date, and distributing the responsibility.
---

This is the raw outline, working from discussions with clients

# Slicing the System

* dependency map captures what things rely on other things to move customer data about,
  what about how deployments etc happen?
* change-flow map to capture the slice through ownership/source
  control/build/artifact/deploy/monitor/alert/respond
* responsibility flow map to capture hand-offs? getting too much?

# Keeping it Up To Date

## Perhaps you don't have to

* point in time discovery for future work, to help direct people or resources
* used as communication tool to rally troops, as shock-and-awe, etc

## Perhaps as-hoc is fine

* if your architectures or systems don't change materially very quickly
* if the occasional "interested party" shows up often enough (this happens more
  if the map is displayed publicly)

## Perhaps you need to assign responsibility

* if your system dependencies evolve more rapidly but the coupled
  domain contains components which cannot be instrumented to report
  dependencies automatically (eg COTS things, manual processes)

## Perhaps you can distribute responsibility

(watch out for tragedy of the commons)

* since the source for the map is in version control already (of course)
  you could split the map into sub-parts and let teams update their own
  source parts; then compose the final map using a build pipeline

## Perhaps you can apply some automation

Technical folks love this one, though it's most likely to be wrong:

* reduces human engagement in the map (it "just happens")

* if you have control over enough parts of the system that you can automate logging
  the dependencies every now and then, centralise the logs, and parse them to
  generate the map (could be VPC flow logs, firewall logs, etc as well) though this
  won't capture changes to the Manual Parts

