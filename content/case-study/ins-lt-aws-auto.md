---
title: "AWS Account Provisioning Automation: Improving lead time, efficiency and accuracy "
client: "Insurance services"
clientLink: "#"
cases: cloud
img: ins-lt-thumb.png
banner: ins-lt-banner.png
---
### Industry

Insurance services

### Customer Overview

Our client is the parent company of a general insurance group with controlled operations in Australia, New Zealand, Thailand, Vietnam and Indonesia.

### Business Challenge

As the move to the cloud started to pick up pace across the organisation, the demand for new Amazon Web Services (AWS) accounts increased. There was a manual process in place for provisioning new accounts, but the effort involved was quite high. For each new account the following activities had to be performed:

1. Validate the cost centre provided.
2. Create a new shared mailbox to register the account.
3. Create the account under the AWS organisation.
4. Add the account to Watchmen and install the Citizen CloudFormation stack on the new account. (See [previous case study] (https://cevo.com.au/case-study/#case-study-6) for an overview of Watchmen)
5. Add the account to Woodstock and install the Lumberjack CloudFormation stack on the new account. (See [previous case study] (https://cevo.com.au/case-study/#case-study-woodstock-aws-log-aggregation) for an overview of Woodstock)
6. Email the account requestor that the account was now ready for use.

These steps took some time for the team to complete, and they were also error prone.

### Solution

The key considerations for building a solution to this problem were:

1. Reducing the potential for manual error.

2. Minimising the lead time; that is the time between the account being requested and the account details being sent to the requestor.

There were two major sources of manual error that were identified in the current account provisioning process:

1. Accuracy of data entry.

2. Missing process steps.

Working with our client we concluded that if most of the account provisioning process could be automated both of these issues would be addressed. Automation would also decrease the process lead time, and if the process was easy to execute then the team would be more willing to do so when the request came through, rather than delay until later.

The solution ended up being a Bamboo pipeline, with each of the tasks being a separate step in the pipeline. To remove the data entry errors, a simple account request form was created with several fields to complete. Someone in the team would review the form to see that all the required information had been provided, then the file would get checked into source control. The check-in would trigger the account creation pipeline to start.

The installation of the Citizen and Lumberjack CloudFormation stacks still requires manual intervention, we are working toward removing those manual touch points as well.

### Benefits

Teams can now request an account and have it created in less than an hour, which is a great result for an enterprise organisation the size of our client. 

The solution improves team efficiency, reducing the laborious process for those responsible for creating new accounts as well as the lead time for those waiting for access. The new account is provisioned with the necessary compliance tools, [Watchmen] (https://cevo.com.au/case-study/#case-study-6) and [Woodstock] (https://cevo.com.au/case-study/#case-study-woodstock-aws-log-aggregation), as well as having a valid cost centre associated with it. The accuracy of the process is now also very high, with little chance of manual mistakes being made.

The solution also allowed for future-proofing, so if more steps need to be taken when provisioning an account, the pipeline can be easily extended.
