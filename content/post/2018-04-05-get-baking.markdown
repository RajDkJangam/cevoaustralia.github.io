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


### Accounts everywhere

The team I was working with had responsibility for seven AWS accounts. Some accounts hosted production workloads, some were used for development and staging. There were several painful problems we encountered.

1. **On boarding team members**  
When a new team member started, we had to create IAM users in every account they required access to. In most cases was all of them.

1. **Managing passwords**  
Having to manage seven different passwords in your password manager to log into AWS console is not fun. Managing seven different MFA tokens is even worse.

1. **Managing access keys**  
Similar to passwords, having lots of different sets of access keys makes it hard to ensure they are tracked and secured appropriately.

1. **Auditing access**  
As an APRA regulated entity, my client had to follow APRA risk management guidelines. One of which relates to reviewing who has access to which environments. With IAM users spread across lots of accounts, this was not an easy task.

### Identity Accounts to the rescue

None of these problems are new. AWS know this and have published an article on how to approach various problems with using multiple AWS accounts: https://aws.amazon.com/answers/account-management/aws-multi-account-security-strategy/

The section of interest for this discussion relates to _identity accounts_.

An identity account manages all of the authentication and authorisation for users, so the other AWS accounts don't have to. This means team members would only need to log into the identity account, and the identity account would take care of granting access to all of the teams other accounts. The implications of this are:

1. Each team member only needs to manage one password and one MFA token.
1. On boarding and off boarding of team members takes far less time and is less error prone.
1. Auditing account access can be done from one place, the identity account.

### Design of the bakery

I won't delve too far into the implementation and design of our identity account solution here, but I do think it's worth mentioning how we arrived at the name "Bakery" for the identity account we built, and "Burgers" for the accounts you are granted access to.

For a person to access an AWS account, they first log into Bakery. Then they must choose which cross-account role to assume. Once the role has been assumed, they are able to access the Burger account. You can't go straight to the Burger without first grabbing a role.

### How many roles?

How many cross-account roles are used is completely up to the needs of the team. To begin with, we tried to keep things simple an minimise the amount of roles.

Our roles were broken down according to the following attributes:

 1. The environment of the accounts the role grants access to.
 1. The access level the role gives to that account.

Our environment breakdown looked like this:

1. **Development** - accounts that were used for development.
1. **Management** - accounts that hosted production tooling such as build pipelines.
1. **Production** - accounts that hosted production workloads used by customers.

On the access level side:

1. **Read only** - cannot change any aspects of the account.
1. **Power user** - can modify and create resources in the account.
1. **Admin** - can modify and create resources as well as modify account permissions.

The combination of roles and access levels gave us nine roles to use for controlling a users account access.

### Using the bakery

Assuming the roles can be done via the console or command line. For command line access, the team created a script that when run, would list all the roles you had access to. Then assuming a role was as simple as selecting one from the list.

The Bakery was demoed to other teams during a weekly showcase. We received really positive feedback on it, and other teams were keen to spin up their own Bakery.

### Open sourcing

After successfully guiding other teams though adopting their own Bakery, making the Bakery goodness available outside the organisation seemed like a good idea. So we did!

If you are eager to grab some roles from the Bakery take a look here: https://github.com/iagcl/bakery

It's all open sourced, so won't cost you any dough.
