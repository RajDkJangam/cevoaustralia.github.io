---
title: "Get Baking"
date: 2018-04-05T08:07:00+11:00
draft: true
description:
    The second open source project the team I worked with released related to credential management for users in AWS. Read on to find out what it's all about!

categories:
    - cloud
tags:
    - credential management
    - devops
    - open source
author: Henrik Axelsson
excerpt:
  As the number of AWS accounts a team uses increases, so does the headache of access and credential management. Identity accounts can help. We called ours Bakery.
---


## Accounts everywhere

The team I was working with had responsibility for seven AWS accounts. Each account was used for hosting either development, staging and production workloads. Ensuring that each team member had the correct access to the correct environments was not an easy task. Also each team member needed to manage different passwords and multi-factor authentication (MFA) tokens across each account.

AWS have recognised that access management across accounts can be difficult to deal with, so they released an article on how to approach the problem: *AWS LINK HERE*

## Identity Accounts

Identity accounts are one way to solve the problem. An identity account has two main responsibilities:

1. Validate a person is who they say they are (Authentication).
1. Grant a person the correct level of access to the correct resources (Authorisation).

Team members would only need to log into the identity account, and the identity account would take care of granting access to all of the teams other accounts. The implications of this are:

1. Each team member only needs to manage one password and one MFA token.
1. On boarding and off boarding of team members takes far less time.
1. Auditing account access can be done from one place, the identity account.

## Design of the bakery

Cross account roles are used to access the child accounts from the identity account *LINK TO AWS CROSS ACCOUNT ROLE DOCS*.

We decided to name our identity account Bakery and the child accounts Burgers. Everyone knows you go the Bakery to get a role before you grab a Burger. If you go straight to the burger you just end up with a big mess on your hands.

## Role setup

Grouped accounts by:

 1. Environment
 1. Access level

### Environment

1. Development
1. Management
1. Production

### Access level

1. Read only
1. Power user
1. Admin

## Using the bakery

### Console

1. Log into Bakery as an IAM user.
1. Select which role you would like to use.
1. Assume that role in the Burger account.

### Command line

1. Run a bootstrap script
1. Run script
1. Choose role from the list presented


## Rolling it out

Team started using it, found it worked really well.

Demoed it at our showcases and gained interest from other teams around the organisation that were facing similar issues.

Made some changes to the way the cloudformation templates were structured so it was easier for teams to configure to their needs.


## Open sourcing

Due to the positive feedback received from other teams that had adopted Bakery, the decision was made to open source it you can find it here: *LINK TO BAKERY REPO*
