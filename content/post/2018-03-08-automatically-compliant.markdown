---
title: "Automatically Compliant"
date: 2018-03-08T08:07:00+11:00
draft: true
description:
    Wouldn't it be great to not worry about compliance?
categories:
    - automation
tags:
    - compliance
    - devops
author: Henrik Axelsson
excerpt:
    Compliance is a thing. A big thing at most big organisations. Meeting compliance obligations, whether they are based on regulation, code of conduct or risk can be arduous. Fortunately automation can help!
---

While it's possible to argue that automation can be [taken too far]({{< relref "2018-02-08-risk-of-too-much-automation.markdown" >}}) an area where I'm sure a lot of people would appreciate more automation is the area of compliance.

I recently had a great experience working for a client, where the team I'm working in was sent a list of items that auditors would be focusing on for the next audit. I know, I know, how could that be a great experience? The great part was we didn't have to do anything!

The CI/CD pipeline and team practices that we had developed met all of the assessment criteria that were listed.

Here's a list of the criteria (paraphrased slightly) and an explanation of how we were able to meet them using the automated deployment pipeline and team practices developed by the team.

<br>

#### 1. Enforcing a Peer Review process in application development phase.

The development workflow of the team ensures that no code can be committed directly to the master branch. All code must be written in a feature branch, then a pull request created. The pull request must be approved by a different member of the team to the person that raised the request.

<br>

#### 2. Enabling Static Code and Artefact scanning to look for potentially exploitable vulnerabilities.

The team currently has two different static analysis tools incorporated into their pipeline:

a.       PyLint - https://www.pylint.org/

b.       GitSecrets - https://github.com/awslabs/git-secrets

These analysis tools run as part of CI/CD pipeline. If problems are detected, the build will break.

<br>

#### 3. Restrict deployment privileges for controlled environments.

All of the teams software exists in AWS and hence deployment privileges are controlled though the use of AWS roles.

All deployments are conducted using the CI/CD pipeline, no manual deployments occur. The teams CI/CD tools are given the appropriate access to accounts they must deploy to.

All configuration has been stored as code, so manual configuration of controlled environments never occurs.

<br>

#### 4. Regression tests should be created and maintained by the platform team to detect breaking changes in the lower dev and test environments.

As part of the teams CI/CD pipeline, regression testing of all merges to master occurs automatically before they are deployed. The procedure:

- Merging code to master first triggers unit tests.
- If all of the unit tests pass, the application is deployed to a staging environment.
- In the staging environment, both functional and integration tests are run.
- If the all the tests have passed, then the application is deployed to production.

<br>

#### 5. Valid change records have been raised and approved for deploying to controlled environments.

The team uses JIRA to track all work done on applications.

As the team treats configuration as code, our source control systems provide an audit trail of all changes that are done to environments.

<br>

#### 6. Deployed artefacts must be built from code that has been peer reviewed and merged to master/release branch.

All team deployments are done as part of the CI/CD pipeline. For code to be merged to master, it must have been reviewed by another team member though a pull request. Therefore all deployments to production must have been peer reviewed.
