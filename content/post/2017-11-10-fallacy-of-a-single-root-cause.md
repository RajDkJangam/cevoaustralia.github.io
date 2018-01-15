---
title: Recognising the fallacy of a single root cause
description: when something goes wrong it’s often tempting to attribute it to a single root cause
date:  2017-11-10
categories:
    - devops
tags:
    - devops
author: tom
excerpt: Think back to a successful deployment or a project and try and attribute the success to a single thing. It seems ridiculous, and that’s because it is. It’s easy to see that many things that had to go right for success.
images: blog/bus-fire.jpg
thumbnail: blog/bus-fire.jpg
---
When something goes wrong it’s often tempting to attribute it to a single root cause:  

 - The site was down because the database crashed.
 - The application broke because the developer pushed bad code.
 - The machine stopped responding because it ran out of disk space.

However this misses the point that many things had to align for this to situation to occur:

 - The site was down because the database crashed.
  - The system ran out of memory.
  - Too many intensive queries were running at once.
  - There was no input validation on the front end.
 - The application broke because the developer pushed bad code.
  - The unit tests didn’t cover this bit of code.
  - The issue wasn’t picked up in the code review.
  - The integration test had a bug.
 - The machine stopped responding because it ran out of disk space.
  - Logrotate wasn’t rotating all the logs.
  - The system wasn’t provisioned with enough disk space for its workload.
  - The log level had been set to debug and forgotten.

Had any of these factors not been present we would have had a near-miss instead of a failure.  

Unfortunately; despite many years of following experts such as Sidney Dekker, John Allspaw and Todd Conklin; I still find myself falling into the trap of wanting to attribute a failure to a single root cause.

One technique I’ve started using to help recognise this fallacy is inversion. To remind myself that it is a fallacy to attribute a single root cause for the case where something went wrong, I try and attribute a single root cause to the case where something went right.

Think back to a successful deployment or a project and try and attribute the success to a single thing. It seems ridiculous, and that’s because it is. It’s easy to see that many things that had to go right for success.

It is no different for failure, and as tempting as it can be to attribute it to a single root cause we need to see this for the fallacy it is. We need to recognise all of the conditions which aligned to allow the failure to occur, because only when we do this will we be able to properly address these conditions and build stronger, safer, more resilient systems.

