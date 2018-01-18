---
title: Test driven infrastructure with Kitchen and InSpec
author: Steve Mactaggart
twittercreator: stevemac
description: Using Kitchen and InSpec enables you to develop infrastructure faster, more reliably and with greater confidence.
categories:
    - testing
tags:
    - infrastructure-testing
    - kitchen
images: blog/test-driven-infrastructure.png
thumbnail: blog/test-driven-infrastructure.png
date: 2017-07-23
excerpt:
    As the cycle times for providing new servers and services decrease, the demands on infrastructure developers is increasing. To cope with this increased demand, we need new ways to think about building and validating servers.<br />
    <br />
    A powerful combination is to couple <a href="http://kitchen.ci/">Kitchen</a> with <a href="https://www.inspec.io/">InSpec</a>, to provide a modern development approach to both the provisioning of servers and validating their configuration is correct.
url: testing/2017/07/23/test-driven-infrastructure-with-test-kitchen.html
---

For a long time infrastructure was the sort of thing you pulled out of a box, plugged in and then set about configuring and testing.  The cycle between needing new equipment and having it ready was measured in weeks, if not months.

Modern cloud computing and infrastructure as code approaches are becoming the norm, with this cycle times on delivering new infrastructure is now measured in seconds. We can no longer afford lengthy validation and compliance testing cycles.  We need a rapid, repeatable and scalable approach to testing the new infrastructure configuration.

While we can launch new hardware rapidly, there is still a lot of work to be done to complete the installation and configuration of server software and applications.  The great news is that there are a number of different tools already in wide adoption to make this task much easier.

We have seen an evolution of organisations through three phases when adopting an infrastructure as code approach.

**Phase 1 - pre-automation** - This is the phase most, if not all, businesses start in. Even those starting cloud native will most probably launch hardware, and then login to the machine and manually configure the software. You can actually get pretty far in this phase, you can still even use a stateless infrastructure approach by manually taking server images and scaling out your solution.

But this soon becomes tedious, error prone and a constraint on innovation of your solution. You'll bite the bullet (hopefully sooner rather than later) and invest in adopting a server provisioning tool.

**Phase 2 - server automation** - Once you have a non-trivial number of servers, manually creating, patching and operating the systems becomes a complex and expensive task, by this stage you will be looking for a server automation tool - Chef, Ansible, Puppet, SaltStack, etc.

By the time you've automated your first half dozen server images, you'll be looking for a way to ensure that your servers not only work the way you want them, but that they stay working as intended.

While it might seem obvious, we now need a way to test what has been developed.

**Phase 3 - validated server configuration** - It's at this phase that you start to accelerate the confidence of your system.  Not only now do you have a solid approach to provisioning servers, but you have extended your automated quality process to cover your infrastructure provisioning process.

## But how do we do it?

It's all good to say that we want to create repeatable, reliable and consistent server images, but how do we do it?

Enter [Kitchen](http://kitchen.ci/) as a test harness to validate the results of your infrastructure code on one or more platforms in isolation.

By introducing Kitchen to your tool chain you get benefits in two ways:

1. **ensure the validity of any server image and**
2. **speed up the development of the infrastructure code** - *this will be expanded in a future article*

Kitchen itself does not actually perform any tests, it is the test harness which ensures the tests have access to the server, are able to be run and reports back on the status of the test cases.

A powerful combination is to couple Kitchen with [InSpec](https://www.inspec.io/), while both of these tools find their genesis from the Chef provisioning tool chain, there is nothing restricting the use alongside other tools.

One awesome feature of InSpec is the ability to create re-usable test suites (called [Profiles](https://www.inspec.io/docs/reference/profiles/)) which allow you to adopt the DRY principal by re-using existing test profiles across your different server images.

A great starting point for your [InSpec Profiles](https://www.inspec.io/docs/reference/profiles/) is to look at the existing [dev-sec profiles](http://dev-sec.io/) [available on github](https://github.com/dev-sec/linux-baseline). The dev-sec team has put together a number of generic profiles that looks for common server hardening and patching issues.

## A working Kitchen and InSpec example

Using the example scripts below you will be able to run Kitchen against any AWS AMI.

If you have issues getting this example working, you may need to review your network or security group configuration, see the documentation for the [kitchen-ec2 driver](https://github.com/test-kitchen/kitchen-ec2) for more details.

### Steps

1. Create a `Gemfile` (content below)
2. Execute `bundle install`
3. Create the `.kitchen.yml` file (content below)
4. Install the dependencies with `bundle install`
5. Setup your environment
    * `KITCHEN_SSH_KEY_NAME` should point to a valid EC2 SSH key
    * `KITCHEN_SSH_KEY_PEM` should be the path to your local SSH private key for the above
    * (optional) `SERVER_IMAGE_ID` to specify the EC2 AMI to test
        * Otherwise will launch a **Red Hat Enterprise Linux 7.4** server
6. Run a full test with `bundle exec kitchen test`

**Gemfile**

``` ruby
source "https://rubygems.org"

gem "rake"
gem "serverspec"
gem "test-kitchen"
gem "kitchen-ec2"
gem "kitchen-inspec"
```

**.kitchen.yml**

```yaml
---
driver:
  name: ec2
  aws_ssh_key_id: <%= ENV['KITCHEN_SSH_KEY_NAME'] || "development" %>
  region: ap-southeast-2
  instance_type: m3.medium
  associate_public_ip: true

transport:
  ssh_key:  <%= ENV['KITCHEN_SSH_KEY_PEM'] || "~/.ssh/development.pem" %>
  connection_timeout: 10
  connection_retries: 5
  username: ec2-user

# Busser runs the tests, and assumes that the ChefDK is installed by default.
# Because we are not using Chef, we need to tell it to use the system Ruby.
#  (see: https://github.com/test-kitchen/test-kitchen/issues/347)
busser:
  ruby_bindir: /usr/bin

provisioner:
  name: shell

platforms:
  - name: rhel-7
    driver:
      image_id: <%= ENV['SERVER_IMAGE_ID'] || "ami-c92b3eaa" %>

suites:
  - name: default
    verifier:
        inspec_tests:
            - name: dev-sec/linux-baseline
            - name: dev-sec/ssh-baseline
```

After running `bundle exec kitchen test` you should see kitchen launch your image and run the tests. If all of the tests pass the program will exit with success, otherwise you might see something like


```text
Profile Summary: 32 successful, 88 failures, 1 skipped
Test Summary: 112 successful, 110 failures, 1 skipped
>>>>>> ------Exception-------
>>>>>> Class: Kitchen::ActionFailed
>>>>>> Message: 1 actions failed.
>>>>>>     Verify failed on instance <default-rhel-7>.  Please see .kitchen/logs/default-rhel-7.log for more details
>>>>>> ----------------------
>>>>>> Please see .kitchen/logs/kitchen.log for more details
>>>>>> Also try running `kitchen diagnose --all` for configuration
```

What this is telling you is that your image has failed tests, and you can now work to resolve them.

### Kitchen workflow

When you run the `test` mode of Kitchen, it actually runs multiple steps.

* create
* converge
* setup
* verify
* destroy

These multiple steps help you with the development phase of your server provisioning and validation code.

A simple workflow is to run:

* `bundle exec kitchen setup` - to create your EC2 instances and have it ready to run your tests
* the machine will continue to run, allowing you to develop your tests
* when ready you can run `bundle exec kitchen verify` to execute the tests against the running server
* you can continue this loop as often as you need before finally
* executing `bundle exec kitchen destroy` will shutdown and cleanup any EC2 resources you were using.

This article is focused on validating server images, but the approach works just as well to help you develop your infrastructure provisioning code, be it puppet, chef, ansible, etc.

## Using in a Continuous Integration process

While it's great that tools like Kitchen make development and manual validation tasks easier to do, you don't get the full benefit of these tools until they are integrated with your Continuous Integration server.

### Test visibility

Another benefit of integrating with CI for your infrastructure testing allows a central place people can review to see what tests are passing or failing.  Again, Kitchen in it's default configuration will output the status of the tests to the console, meaning users need to scroll through console logs to find the test status.

Again, you can configure the verifiers to output the test results in JUnit XML format, and then process these results into your CI server.

```yaml
verifier:
  name: inspec
  format: junit
  output: ./results/%{platform}_%{suite}_inspec.xml
```

### Testing a freshly built image

Now that you have the ability to execute as set of InSpec tests on a stock AWS image, you need to update your configuration so that it tests your candidate AMI's.

Kitchen supports injection of environment variables into the yaml files, this allows you to create a common kitchen file, but alter the AMI that is under test.

By adding a platform as follows, you can export the AMI id to a `SERVER_IMAGE_ID` environment variable, and execute your `kitchen test` command without the need to alter the test scripts.

```yaml
platforms:
  - name: custom-image
    driver:
        image_id: <%= ENV['SERVER_IMAGE_ID'] || "ami-abcd1234" %>
```

### Don't forget to clean up

Kitchen in its default configuration will leave servers running when tests fail.  This may be a useful feature for you when you are running the tool yourself, as you have a running server that you can poke around on to see what happened.  But this is a really bad pattern when run by CI.  Every time a test failure occurred from your CI server, you will have test servers sitting around, costing money with no process to clean them up.

Kitchen supports altering from the default behaviours by appending `--destroy=always` to your test run.  In this mode Kitchen will destroy all instances it creates on every test run.

## Conclusion

As demands the on teams to deliver increase, and systems grow in size and complexity, ensuring we have a way to scale out our approach to quality and validation is critical.  

Through introducing [Kitchen](http://kitchen.ci/) and [InSpec](https://www.inspec.io/) to your toolkit you will be well positioned to have confidence that the systems you build work to specification, and continue to align with these requirements as time goes by.

A new post discuses extending this approach to [replace packer entirely](/post/2017-11-22-replacing-packer-with-kitchen-and-a-rakefile/) 
