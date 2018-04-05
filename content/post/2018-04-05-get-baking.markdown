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

Grouped accounts by:

 1. Environment
 1. Access level

**Environment**

1. Development
1. Management
1. Production

**Access level**

1. Read only
1. Power user
1. Admin

### Using the bakery

#### Console

1. Log into Bakery as an IAM user.
1. Select which role you would like to use.
1. Assume that role in the Burger account.

#### Command line

1. Run a bootstrap script
1. Run script
1. Choose role from the list presented


### Rolling it out

Team started using it, found it worked really well.

Demoed it at our showcases and gained interest from other teams around the organisation that were facing similar issues.

Made some changes to the way the cloudformation templates were structured so it was easier for teams to configure to their needs.


### Open sourcing

Due to the positive feedback received from other teams that had adopted Bakery, the decision was made to open source it you can find it here: *LINK TO BAKERY REPO*
