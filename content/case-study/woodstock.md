---
title: "Woodstock: AWS Log Aggregation"
client: "Insurance services"
clientLink: "#"
cases: cloud
img: woodstock-thumb.png
banner: woodstock-banner.png
---
### Industry

Insurance services

### Customer Overview

Our client is the parent company of a general insurance group with controlled operations in Australia, New Zealand, Thailand, Vietnam and Indonesia.

### Business Challenge

As part of our client’s intrusion detection system (IDS), one commonly adopted security pattern is the forwarding of logs of various types into the company’s Security Information and Event Management (SIEM) system. Of particular interest to the SIEM team are the Amazon Web Services (AWS) CloudTrail logs, as they provide information about all AWS API calls that are run on an account, and are a good place to start when trying to detect suspicious activity.

There were several challenges that the client faced when getting CloudTrail logs into SIEM:

- The AWS maturity of teams across the organisation varies greatly. Not all teams were aware of the CloudTrail service and what it does, and this created variation in compliance.

- Each integration into SIEM required several non-trivial steps. Following this, the integration needed to be monitored for a few days to make sure it was working correctly.

- Identifying which teams still needed to complete the integration, and providing the necessary instruction on how to do this, was proving an additional management burden.

### Solution

Working together with Cevo, a solution was devised to address these challenges in the simplest way possible. When broken down, the main goal was to design a process that:

1. Is easy for all AWS account owners to use

2. Only requires one integration with SIEM.

The solution created was entitled ‘Woodstock’ (ie a large pile of logs in one place!) Woodstock stores the CloudTrail logs of each AWS account. Each account writes to a specific directory that only it has access to, and SIEM can then read all of the logs from the one place.

For AWS account owners, a simple CloudFormation template we named Lumberjack was created (because, Lumberjacks send the logs). The template only takes five minutes to download and run and conducts the necessary CloudTrail configuration.

Leveraging other work done previously with our client, a Watchmen rule was added to check that accounts had their CloudTrail configured correctly.

### Benefits

Simplifying the process of forwarding CloudTrail logs into SIEM means that teams are much more likely to undertake the process, thereby increasing compliance and visibility whilst reducing administrative burden on management.

The Woodstock solution also adds another layer of security monitoring to all AWS workloads with no room for human error, as all the configuration for required for an account is executed as code.

As a result of these benefits, the solution has now also been extended to cover logs from other AWS services within the organisation.
