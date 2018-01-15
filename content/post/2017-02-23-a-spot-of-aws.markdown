---
title:  "A spot of AWS"
description: Have you considered using spot instances to save on AWS costs?
date:   2017-02-23
categories:
    - aws
tags:
    - spot
    - cost
author: henrik
images: blog/a-spot-of-aws.png
thumbnail: blog/a-spot-of-aws.png
date: 2017-02-23
excerpt:
    Have you considered using spot instances to save on AWS costs? It may pay to investigate the details of your operating environment first!

    Andy and I took journey down a pricing rabbit hole...
url: aws/2017/02/23/a-spot-of-aws.html
---

As more enterprises start transitioning over to using AWS, cost optimisation has become a hot topic. Andy and I were recently given the opportunity to explore the potential savings of running on spot instances.

## What are spot instances?
Spare compute capacity that Amazon Web Services (AWS) sells at a discounted price. When a user requests a spot instance, they must also provide a ‘bid price’.  As long as the market price remains below the bid price, you will retain control of the instance. If the market price rises higher than the bid price, you have three minutes to clean up your work before the instance is destroyed (you must check for this yourself).

The spot price of an instance can be up to ten times cheaper than the on-demand price, so there are potentially massive savings to be realised through the use of spot!

## The situation at hand
We were dealing with development environments that had been subject to a lift and shift from local infrastructure to AWS.  This lead to several challenges:

- There were lots of load time and run time dependencies between apps. In fact to show just how bad the dependency tree was Andy made a graph:


<a href="{% asset_path depend-map.png %}"><img src="{% asset_path depend-map.png %}" alt="dependency map" style="width: 200px"></a>

- It took in the region of three hours to stand up a complete dev environment.
- Apps needed to maintain state.
- Apps frequently required manual poking to bring online.

There were also conflicting business priorities; where one stakeholder group wanted to save as much as possible, another didn’t want to compromise on environment stability.


## First steps
The first question was, “can we save money by running on spot?” The obvious answer is “yes”. I mean after all, if you check the pricing for instances on AWS the spot instances are much, much cheaper.

But… we wanted to provide some data and actually prove it would be cheaper.

So on a basic level, we wanted to calculate the cost of running a dev environment using both spot and on-demand.

## Building an environment profile
The first step was building a catalogue of all the instances currently used for a dev environment. The list looked like this:

*On-demand profile*

|Size	    | OS     | Quantity |
|---------|:------:|---------:|
|t2.micro |	Linux  |  10      |
|t2.small |	Linux  |	12      |
|t2.medium|	Linux  |  17      |
|t2.large	| Linux  |  10      |
|m3.medium|	Linux  |   0      |
|m3.large	| Linux  |   1      |
|m3.xlarge|	Linux	 |   0      |
|r3.large	| Linux	 |   6      |
|t2.micro	| Windows|   1      |
|t2.small	| Windows|	 3      |
|t2.medium|	Windows|	 5      |
|m3.medium|	Windows|	 0      |
|m3.large	| Windows| 	 0      |
|TOTAL		|        |  65      |


When it came to building a spot profile, there was bit of a problem; not all on-demand instances had an equivalent spot instance type. When this occurred, we used the following rule for substitution:

1.	At least as much RAM.
1.	At least as many CPUs.
1.	Lowest interruptions (more on this next).
1.	Lowest price.
This is what our spot profile ended up looking like:

*Spot profile*

|Size	    | OS     | Quantity |
|---------|:------:|---------:|
|t2.micro |	Linux  |   0      |
|t2.small |	Linux  |	 0      |
|t2.medium|	Linux  |   0      |
|t2.large	| Linux  |   0      |
|m3.medium|	Linux  |  22      |
|m3.large	| Linux  |  18      |
|m3.xlarge|	Linux	 |  10      |
|r3.large	| Linux	 |   6      |
|t2.micro	| Windows|   0      |
|t2.small	| Windows|	 0      |
|t2.medium|	Windows|	 0      |
|m3.medium|	Windows|	 4      |
|m3.large	| Windows| 	 5      |
|TOTAL		|        |  65      |


## Spot instance stability
As explained earlier, spot instance price fluctuates based on demand, and when provisioning a spot instance a bid price must be set. As the main goal of our investigation was providing cost reduction across an environment it didn’t make sense to pay more for a spot instance than an on-demand instance.

With this in mind, we looked at the spot price history of all the instances we were interested in provisioning and compared that to the on-demand price of that instance. If the spot price exceeded the on-demand price during business hours, that was classified as an interruption.

We found that the pricing of some spot instances fluctuated much more than others and, with careful selection of instances types, that the spot price did not exceed the on-demand price over the three month history of spot pricing information.

## Obtaining pricing data
Despite the amazing AWS ecosystem, obtaining pricing data is still quite primitive. On-demand pricing must be downloaded in one big chunk which equates to over 70MB of data. Then you need to figure out how to filter out all the data you don’t want. We ended up writing an R script to do this for us quickly and easily, but that’s the topic of another post!

Spot pricing is a little more sophisticated. You can actually specify filtering conditions on a service call to get a subset of data, which is necessary unless you want to deal with gigabytes of text data! The returned data lists the date and time of every change in spot price.

## Spot price per hour
The spot price data isn’t formatted in the way time series data typically is (constant interval), instead it records the time that the price of an instance changed. As data analysis isn’t typically our day jobs, and we were not after precise results, we ignored this and just averaged the price across the three month history, treating each price change as if it occurred at a similar time interval.

Prices that were above the on-demand price were also ignored; we would not bid above the on-demand price.

The prices per instance across spot and on-demand looked like this:

|Type     |	OS     |	$/h on_demand |	$/h spot |
|---------|:------:|---------------:|---------:|
t2.micro |  linux	 |0.02            |0
t2.small |	linux  |0.04            |0
t2.medium|	linux	 |0.08            |0
t2.large |	linux	 |0.16            |0
m3.medium|	linux	 |0.093           |0.011
m3.large |	linux	 |0.186           |0.022
m3.xlarge|	linux	 |0.372           |0.047
r3.large |	linux	 |0.2             |0.02
t2.micro |	windows|0.02            |0
t2.small |	windows|0.05            |0
t2.medium|	windows|0.1             |0
m3.medium|	windows|0.156           |0.072
m3.large |	windows|0.312           |0.142


## Run time per month
As spot instances cannot be paused and restarted (only destroyed) our initial cut of the numbers would look at how much running the environment on spot instances 24x7 would cost.

```
24x7  = number of days in a month * hours per day
      = 30 * 24
      = 720 hours per month
```

As the current on-demand instances were only running during business hours, the hours per month was calculated as:
```
Business hours  = number of work days per month * work hours per day
                = 20 * 12
                = 240 hours per month
```

## Results
Surprisingly, the results came out looking like this:

|On-demand business hours|$1367.04|
|Spot 24x7|$1602.72|

Due to the instance type substitution, and the fact the spot instances would be running much longer each month, they would end up costing more! This finding also ruled out reserved instances as an option. If the cost of spot running 24x7 wasn't favourable, reserved instances would be even worse as the price per hour for reserved is higher.

Naturally, next we looked at the price comparison with the spot instances running only during business hours.

|On-demand business hours|$1367.04|
|Spot business hours|$534.24|

That’s more like it. However due to the constraints of the apps running on the instances, it would require a lot of work to make them tolerant to being destroyed and brought back each night while preserving necessary state.

Finally, we decided to consider what a mixed environment might look like. This would include running some on-demand instances during business hours and running some spot instances 24x7 where it was cheaper to do so.

This would potentially give us the cheapest of both worlds and require no changes to application behaviour.

|On-demand business hours|$1367.04|
|Mixed|$1070.88|

It seems like there are potentially some savings to be had!


## Conclusion
This was a great process to go through, and showed us that initial assumptions (of course spot will be cheaper!) can turn out to be wrong when all factors are taken into consideration.

Even though Andy and I are not data analysts by trade, we managed to gather the raw data, present how we manipulated and what the conclusions were to our client in a fashion they found easy to follow and valuable.

Next time your gut tells you something is right, try gathering the data to prove it and you might be surprised!
