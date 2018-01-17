Packer ---
title: "Replacing Packer With KitchenCI and a Rakefile"
date: 2018-01-17T08:09:14+11:00
description: An introduction to creating validated AMIs without using Packer.
categories:
    - devops
tags:
    - devops
    - development
    - iaas
    - kitchen
    - InSpec
    - packer
author: Steve Mactaggart
excerpt:
    <p>Don't get me wrong, I love the HashiCorp products, I've been a Vagrant user since way back in my BC (Before cloud) days and have continued a strong run of success backing the HashiCorp team. But the biggest issue I have is ensuring that the images created through Packer are worthy of being promoted along a delivery pipeline.</p>

    <p>This post is about using KitchenCI, InSpec and a small Rakefile to create an enhanced AWS Machine Image (AMI) creation and validation workflow.</p>

---

Don't get me wrong, I love the HashiCorp products, I've been a Vagrant user since way back in my BC (Before cloud) days and have continued a strong run of success backing the use of HashiCorp product. But the biggest issue I have is ensuring that the images created through Packer are worthy of being promoted along a delivery pipeline.

This post is about using [KitchenCI](http://kitchen.ci/), [InSpec](https://www.inspec.io/) and a small Rakefile to create an enhanced AWS Machine Image (AMI) creation and validation workflow.


## Ensuring valid AMIs

In my [previous post](/testing/2017/07/23/test-driven-infrastructure-with-test-kitchen.html), I talked about using KitchenCI and InSpec as a way to validate the output of a Packer build by launching the image and running some tests.  This works really well as a first step into validated images, but has a clunky workflow that requires the launch of 2 different EC2 instances. It also creates the AMI before it is actually validated.

While this might not seem like a big issue, this violates the concept of having potentially invalid images - an artifact should not be created and available un`less it is known good. With the current Packer-based workflow we have an AMI that is not confirmed as good and no controls in place to ensure that it is not used until known good.

## Rethinking our use of Packer

Removing Packer from the tool-chain is not a decision taken lightly, it does such a good job in easily defining details of the host images, run the provisioner, create the AMI, and even which accounts and regions the AMI is shared with - it just fails on the validation activity.

**How can we work with Packer to achieve a confirmed quality outcome?**

One option is to have a separate AWS account that AMIs are built in. We could build an AMI using Packer, fire it up using KitchenCI and run InSpec tests to validate.  If the tests failed we could simply delete.

This is the workflow we covered in the previous post, but then introduces the issue of not being able to use Packer's built in tooling to do sharing.  We need to restrict the sharing of the image to other accounts and regions until __after__ the image has been verified.

That can be fixed too, sharing the image between regions and accounts is only a couple of API calls, so a simple Rakefile as such could get the job done easily.

**Rakefile to build and deploy AMI**

```
require 'parallel'
require 'aws-sdk'
require 'pry'
require 'retryable'

task :deploy, [:image_id, :src_region, :dst_region, :account_ids] do |_t, args|
  Retryable.retryable(tries: 5,
                      on: Aws::EC2::Errors::RequestLimitExceeded,
                      sleep: 60) do

    src_region = args[:src_region]
    dst_region = args[:dst_region]
    account_ids = args[:account_ids].split(' ')

    client = Aws::EC2::Client.new(region: dst_region)
    target_resource = Aws::EC2::Resource.new(client: client)

    source_resource = Aws::EC2::Resource.new(client: Aws::EC2::Client.new(region: src_region))
    source_image = source_resource.image(args[:image_id])

    puts "Copying #{source_image.image_id} to #{dst_region}"
    resp = client.copy_image(
      name: source_image.name,
      source_image_id: source_image.image_id,
      source_region: src_region
    )
    new_image = target_resource.image(resp.image_id)

    puts "Waiting for #{resp.image_id} (#{dst_region}) to become available"
    new_image.wait_until(max_attempts: 60, delay: 90) do |im|
      im.state == 'available'
    end

    puts "Applying tags to new image #{new_image.image_id} (#{dst_region})"
    new_image.create_tags(tags: source_image.tags)

    puts "Sharing #{new_image.image_id} (#{dst_region}) with #{account_ids}"
    client.modify_image_attribute(
      attribute: 'launchPermission',
      user_ids: account_ids,
      operation_type: 'add',
      image_id: new_image.image_id
    )
  end
end
```

Our workflow would now look like:

1. `packer` to launch the EC2 instance, connect to and provision the server
1. `packer` to create an AMI from the EC2 instance
1. `packer` to shutdown the EC2 instance and cleanup
1. `kitchen` to launch the EC2 instance from the AMI
1. `kitchen` to launch `inspec` to validate the image
1. `kitchen` to shutdown the test EC2 instance and cleanup
1. `rake` copies the image between regions and accounts

Nice and neat - we only need 3 configuration files, one for Packer, one of KitchenCI and the Rakefile.

## Replacing Packer with Kitchen

If we look at the difference between KitchenCI and Packer in this workflow, they are basically doing the same thing, and while KitchenCI can run a provisioner and tests, Packer can only run a provisioner.

By using the provisioning capability of KitchenCI the only activity we are left with is the creation of the AMI, and because KitchenCI has multiple stages in its workflow we can drive it in a way that means we only get an AMI if the tests have passed.

Adding another task to our Rakefile will extend the current KitchenCI workflow to add in conditional creation of an AMI on success.


**Rakefile with new `build` target**

```

task :build, [:os_label] do |_t, args|
  loader = Kitchen::Loader::YAML.new(local_config: '.kitchen.yml')
  instances = Kitchen::Config.new(loader: loader)
                             .instances
                             .get_all(/#{args[:os_label]}/)
  client = Aws::EC2::Client.new(region: 'ap-southeast-2')
  resource = Aws::EC2::Resource.new(client: client)

  instances.each do |instance|
    at_exit { instance.destroy }
    begin
      Retryable.retryable(tries: 5,
                          on: Aws::EC2::Errors::RequestLimitExceeded,
                          sleep: 60) do
        instance.destroy
        instance.create
        instance.converge
        instance.setup
        instance.verify
        ec2_instance = resource.instance(instance.diagnose[:state_file][:server_id])
        instance_name = "kitchen-#{args[:os_label]}-secure-#{Time.now.to_i}"

        puts "Creating #{instance_name} from #{ec2_instance.instance_id}"
        image = ec2_instance.create_image(name: instance_name)

        image.wait_until(max_attempts: 60, delay: 90) do |im|
          im.state == 'available'
        end

        image.create_tags(tags: ec2_instance.tags)

        File.write('env.properties', "IMAGE_ID=#{image.image_id}")
      end
    rescue Kitchen::InstanceFailure
      abort('The image failed verification')
    rescue Aws::Waiters::Errors::TooManyAttemptsError
      abort('Timed out waiting for image')
    end
  end
end
```

We can now use the KitchenCI development workflow to develop our server provisioning code, ensuring we provide sufficient testing along the way, and easily use that same codebase in our CI process to generate, validate and publish images between our accounts.

With this workflow you can maintain a single `kitchen.yml` file which contains the definitions for the provisioner and validation stages of image creation - and a simple and reusable `Rakefile` which can be wired into an CI/CD pipeline for reuse.

By replacing our Packer workflow with KitchenCI and a Rakefile our workflow would now look like:

1. `kitchen` to launch the EC2 instance
1. `kitchen` to connect to and provision the server
1. `kitchen` to launch `inspec` to validate the image
1. `rake` creates and AMI from the running server
1. `rake` copies the image between regions and accounts
1. `kitchen` to shutdown the EC2 instance and cleanup

Importantly we only get an AMI if the provisioning succeeds AND the spec tests are successfully executed.

**Example kitchen.yml file**

```
---
driver:
  name: ec2
  aws_ssh_key_id: <%= ENV['KITCHEN_SSH_KEY_NAME'] %>
  associate_public_ip: true
  retryable_tries: 10
  retryable_sleep: 60
  instance_initiated_shutdown_behavior: terminate

transport:
  ssh_key: <%= ENV['KITCHEN_SSH_KEY_PEM'] %>

provisioner:
  name: ansible_playbook
  roles_path: ansible/roles
  playbook: ansible/playbook.yaml
  retry_on_exit_code:
  - 3
  max_retries: 3

verifier:
  name: inspec

platforms:
  - name: centos6
    provisioner:
      hosts: centos6
    driver:
      tags:
        Name: centos6-secure
        created_by: test-kitchen
      image_search:
        owner-id: "679593333241"
        name: CentOS Linux 6 x86_64 HVM EBS 1704*
  - name: centos7
    provisioner:
      hosts: centos7
    driver:
      tags:
        Name: centos7-secure
        created_by: test-kitchen
      image_search:
        owner-id: "679593333241"
        name: CentOS Linux 7 x86_64 HVM EBS 1704*

  - name: dev-sec
    verifier:
      inspec_tests:
        - inspec/security
```

Once you have this KitchenCI file in place you can build the different platform targets as below:

```
bundle exec rake build[centos7]
```

While this process looks a little more complex than using Packer alone, you gain a number of new capabilities that are worth the extra complexity:

1. A solid workflow that only allows **VALID** images to be created
2. A single approach to build multiple operating system images
3. Composable validation rules through the use of InSpec
4. Feature compatible process that supports cross account and region Sharing

It would be great if the KitchenCI team took on the challenge to add the AMI/Sharing steps into their tool, their current position is that this requirement is beyond the scope of their tool.  

**Thats ok, for the rest of us we can use the simple Rakefile to extend Kitchen.**
