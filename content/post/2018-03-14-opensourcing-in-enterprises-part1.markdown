---
title: "Open sourcing in Enterprises"
date: 2018-03-14T11:00:00+11:00
draft: true
description:
    Simple solution to the challenges in open sourcing enterprise applications.
categories:
    - open sourcing
tags:
    - open source
    - git subtree
    - git submodule
author: Bhushan Manekar
excerpt: 
    Open sourcing applications in enterprises have many challenges. Publishing updates to the open source repository can be very complicated
---

The concept of Open Sourcing the software is not new. We have seen giant organizations like Google and Amazon are actively contributing to the open source communities since many years. Probably you have also seen tons of open source repositories on GitHub.com which is a well known distributed version controlling platform.

The process of open sourcing can be very simple as well as difficult at times. It simply depends on the nature of your application. Some applications like 'website themes' usually does not require users to write their own config or link it to a database engine; hence they can be open sourced as is. But large enterprises does not deal with such applications. They often develop an application specific to their needs. So, they need to remove any organisation specific data from their code before open sourcing.

We have recently helped one of our clients to open source an application which we also helped them to build. Here is a link to their public repository [https://github.com/iagcl/watchmen](https://github.com/iagcl/watchmen). We had seen many challenges during the process of publishing updates to the repo. Let's see what are those and how we have successfully solved them.

## Challenges in open sourcing enterprise applications

- Removal of organisation specific config or data from the code before open sourcing.
- Adding some dummy config/data as an example for open source community.
- No auditability of above changes.
- In order to hide sensitive data in commit history, the development has to be done in private git repo.
- Since above process couldn't be automated, an impact of human error is very significant.
- Automated testing couldn't be done after updating code with dummy data.
- Pulling content from open source to private repo involves reversing above changes.

Due to above challenges, the process of open sourcing new updates could be time consuming and also error-prone.

## The solution

You might have noticed the root cause of above issues is having to maintain two Git repos (public and private) with same code-base but with different set of configurations. The technique that we implemented for our client is **separating the configuration/sensitive-data from rest of the application code that can be open sourced**. This process involves restructuring few components of the application. However, once the functional code is separated from the config data, it can be published to the public git repository with dummy config. Also, the private repository can be used for storing config data.

### Example

Let's say this is the entire code-base of your application.

![original project data](/img/blog/bm-opensourcing-in-enterprises/original-project-files.png)

We identified that the below files cannot be open sourced, or needs to be modified before open sourcing. So, we store them in a private repo.

![private repo](/img/blog/bm-opensourcing-in-enterprises/private-repo.png)

And here is the rest of the content of our application which can be open sourced, and hence stored in public repo.

*You might notice that there are few files duplicated in private as well as public repo. These are the config files which contains sample data in public repo.*

![public repo](/img/blog/bm-opensourcing-in-enterprises/public-repo.png)

Not to forget, the content from both repositories needs to be downloaded in one place to make it useful. To achieve this, there are various tools available in Git like 'Submodules' and 'Subtrees' which can allow us to use both components together yet stored in separate repos.

This means that majority of development will be done in your open-sourced repository which can be used along with private repository as a Git Submodule or Subtree to feed necessary config data.

So, the local copy of our entire application (including private & public repo) should look like this.

![live project](/img/blog/bm-opensourcing-in-enterprises/folder-structure-live-local-copy.png)

Where, the contents of sub-folder `core_components` co,es from public repository, and everything else from private repository.

## Implementation

The technique for implementing above solution really depends on the type of your application. If we take an example of above application i.e. [Watchmen](https://github.com/iagcl/watchmen), the implementation can be as simple as setting up an environment variable in 'Makefile' and using them in rest of the code. I would highly encourage to check out [Watchmen](https://github.com/iagcl/watchmen) repository and have a look at the usage of an environment variable called `watchmen_core`.

In my next article, I will go through some basics regarding implementation of sub-module and sub-tree, and which technique should you use for structuring your code for open-sourcing benefits. We will also look at detailed instructions on implementing these techniques.
