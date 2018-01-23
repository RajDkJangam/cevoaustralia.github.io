---
title:  Sending Watchmen into the Open
description: Our enterprise client's decision to open source code and why we love working on projects that encourage collaboration in the tech community.
date:  2018-01-22
categories:
    - AWS
    - Security
    - Open source
tags:
    - open source
    - compliance
author: Team Cevo
excerpt: It would seem counterintuitive for an organisation to release their code for all to see. However, with the exception of those who sell software as a business, more and more are seeing the benefits of doing so. 
images: blog/opensource-watchmen.png
thumbnail: blog/opensource-watchmen.png
---

Open source software is a decentralised development and distribution model that encourages collaboration in the public domain. Source code and other artefacts of the software development are made available to the public to use, copy and customise in any way to suit business needs. This is in contrast to traditional proprietary software, where software is under restrictive copyright and the source code is usually hidden from the users. 

Open source therefore delivers the distinct benefit of cost-saving to organisations, because the code is in effect, free.  It allows for business agility – the ability to be responsive and quickly develop applications without the burden of licensing costs or restrictions is particularly appealing to businesses who need to react to the market demands as they happen. This, combined with the overarching open source aim of developers working on and improving upon code, to then share it back into the community, creates a continuous improvement cycle. Additional benefits of the open source movement include security, quality, interoperability and the extensive support through online communities and forums. 

It would seem counterintuitive for an organisation to release their code for all to see. However, with the exception of those who sell software as a business, more and more are seeing the benefits of doing so. It’s an ideal opportunity to promote an organisation/brand, create goodwill (whilst potentially ‘showing off’ capability) and, by encouraging more users to create a community around the code, improve and update work faster than doing it solely in-house. Further, it helps attract great talent for an organisation, with developers and software engineers being the greatest advocates for the open source model.

## Watchmen and Citizens 
‘Watchmen’ and ‘Citizens’ are the names created during a project undertaken by Cevo with one of our clients in the Insurance sector, an industry heavily regulated by APRA. 

The project objectives were to automatically and reliably monitor that all applications deployed and run in the cloud are compliant with security controls, and standards set by APRA ([see original Watchmen case study](https://cevo.com.au/case-study/#case-study-6)). The names were given to Amazon Web Services (AWS) accounts based on their functionality; Watchmen is an account that acts as a tool to evaluate compliance of all Citizen accounts in accordance to the policies defined by the organisation. 

***
#### *The Technical Part*
  *  The Citizen accounts uses the AWS Config service to invoke AWS Lambda functions in the Watchmen account. The Lambda functions from Watchmen then scan resources in the Citizen for compliance. Each config rule maps to a different Lambda function.

  *  The Watchmen account contains all of the business logic for the compliance checks, so the Citizen accounts cannot change or tamper with any of the checks. All of the Citizens will have the same checks run against them, so there is no confusion about the meaning of compliance.

  *  The Citizen config rules are configured to run periodically. Depending on the compliance monitoring needs of an organisation this could be set anywhere from running every hour to running every week.

  *  The results of each compliance check are recorded by the AWS Config service in the Citizen account. AWS Config service provides an out-of-box dashboard to see an overview of the resources, rules, and their compliance state.

  *  The Watchmen account has the ability to report on the the results across all Citizen accounts. A Lambda function generates the report which can be customised depending on the organisations needs.
___

## Putting Watchmen into the Open
With so many organisations moving to Cloud, it stands to reason that a proliferation of AWS accounts will follow.  As a result, there is a high possibility of teams not correctly configuring each and every policy across those multiple accounts, which puts the security aspect of AWS resources like S3 buckets, EC2 instances at risk.

To help others in a similar predicament, our client recently made the bold decision to share the [Watchmen code] (https://github.com/iagcl/watchmen) to the open source community.

Having a tool like Watchmen being made available will help organisations focus their time to defining efficient rules and developing high performance systems, whilst being confident that the compliance part of each of those AWS accounts has been taken care of (rather than the teams having to reinvent the wheel in-house). In addition, organisations can be confident they are working with a robust, mature and highly secure code that meets regulatory and industry standards.

>##### “It’s always fantastic to be part of a project that is open sourced. It means that we can share the great work that’s been done in the team over the last six months. For our client it shows they are taking a progressive stance toward open sourcing that’s not commonly seen in enterprise, and at Cevo we are proud to be working on projects that encourage collaboration in the tech community.”
-- <cite>Henrik Axelsson, Business Solutions Consultant, Cevo</cite>

Open sourcing Watchmen also earns the organisation valuable and authentic advocacy, and places them in the list of employers who encourage their teams to contribute to the larger community to deliver a better performing product. 
