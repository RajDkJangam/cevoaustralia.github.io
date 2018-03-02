---
title: "Migrating to AWS: Delivering automated infrastructure, self-servicing capabilities & reduced costs"
client: MYOB
clientLink: "#"
cases: devops
img: myob.png
banner: myob-migrate-case-study2.png
anchor: case-study-3

---
### Industry

Accounting Software

### Customer Overview

MYOB is a leading provider of business management solutions in Australia and New Zealand. MYOB helps businesses of all kinds and sizes, delivering software and services that simplify accounting, payroll, client management, websites, and more. With a network of more than 25,000 accountants and other professional partners, MYOB provides the tools and support that help make business life easier.

### Business Challenge

MYOB had a contract with its traditional Australian data centre due for renewal in early 2016. This provided the organisations with an opportunity to innovate and seek out infrastructure improvements to provide delivery teams more control of their environments. The vision was to reduce the cycle time of “concepts to production” through gaining configuration traceability, repeatability through automation and self service to reduce dependency on third parties. This vision ultimately tied into one of MYOB’s core business values to help businesses (their customers) be successful. 
<br><i>“We needed a solution that would enable greater flexibility and visibility in terms of infrastructure configuration, automation and performance” </i> says Grant Tibbey, Infrastructure Lead.</br>
In its current state, MYOB Essentials was running in a third-party data center, utilising SQL Server and a Java front end. The company decided to move its infrastructure to AWS.

### Solution

From the time MYOB decided it wanted more flexibility and more customer benefits from the Essentials infrastructure (until the existing contract expired), it had only approximately three months to complete the cutover.

MYOB formed a team using existing in house DevOps skills but didn’t have enough capacity to meet the aggressive deadlines. MYOB utilises a wide range of technologies, and Cevo were able to offer skills and availability with minimal onboarding requirements. MYOB was looking for experience without having to bring additional people up to speed on tools and techniques that were being applied to automation.

The existing application had some automation around building and deploying to the application servers using Ansible and Gradle. There was however no automation around building MS SQL Server and no automation around building the network infrastructure. Given the time constraints, existing automation was re-used and augmented with additional tools. Chef was chosen because of its ability to configure Windows and Linux servers securely using Secure WinRM and SSH protocols. It also gave the team the ability to unit and integration test components of the server automation as isolated modules and provided rapid feedback to the development processes using KitchenCI (test-kitchen). Unlike other automation technologies code could be developed and tested with the physical server being stubbed. This reduced server development wait-times. CloudFormation was used for network automation and enhanced with complex logic for alarm calculations using ruby code. CloudFormation templates were generated using a ruby gem “cfndsl” to enhance its static nature.

Options for running MS SQL Server in AWS were considered and included RDS, Log Shipping and Always on Availability Groups to achieve High Availability. These options however were discarded due to cost, extended outage and data loss that would have occurred on failure or reconfiguration. Instead, Mirroring was chosen for HA with Log Shipping initially used to keep the data in AWS in sync with the traditional datacenter to within fifteen minutes so that the cutover would cause minimal impact to customers.

The entire process of building the SQL Cluster in AWS was scripted from scratch. This included formatting, moving, labeling disks, moving system databases and logs, creating users, backup jobs, installing certificates to establishing mirroring using partner and witness amongst many other things that would traditionally have been manually done. 
<br><i>“If something didn’t work, we can tear it down and build it again in hours,” says Grant. “Practice also makes perfect. We practiced rebuilding servers, and cutting over the system constantly. Even weeks before the actual cut over took place”.</i> </br>
By the time cutover took place the entire system could be rebuilt with a couple of commands.

Moving forward, the company plans to re-engineer the application from statically deployed to dynamic auto-scaling servers that come and go, and will look at ways to achieve zero downtime deploys to deal with fault tolerance. Through the ongoing use of Chef scripts and development practices applied to Ops, MYOB’s development team can rewrite the application in such a way that it can easily be deployed to AWS.

### Benefits

Benefits of the solution include providing MYOB with:

- A safe, repeatable and easy means to release features to their customers as soon as they are capable of providing benefit.
- The ability to rebuild servers at will or when they fail.
- The ability to reconfigure or change the way the MYOB Essentials app is built; whether it’s to increase performance, reliability or change how they run deployments, infrastructure architecture can be changed and new services added.
- Cost optimisation – with the scalability offered by AWS, MYOB is able to have full visibility of what is running and can start reducing expenditure through ensuring they are not over or under provisioned.
