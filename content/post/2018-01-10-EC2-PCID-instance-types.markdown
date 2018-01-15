---
title:  "Meltdown, Spectre and Linux on AWS: Security vs Performance?"
description: An analysis of some corner-case performance issues with Meltdown patches
twittercreator: nonspecialist
date:  2018-01-10
categories:
    - AWS
    - Security
    - Performance
tags:
    - linux
    - ec2
    - meltdown
    - kernel
    - performance
author: cmp
excerpt: AWS' Shared Responsibility Model means that you are responsible for patching the operating system running on your EC2 instances, and this is where things get ... complicated.
images: blog/meltdown.png
thumbnail: blog/meltdown.png
---

# Meltdown, Spectre and Linux on AWS: Security vs Performance?

The recent announcement of the [Meltdown and Spectre](https://meltdownattack.com) attacks against bugs
in Intel (and other) CPUs has attracted rapid response from many vendors; 
[Amazon Web Services' (AWS) response](https://aws.amazon.com/fr/security/security-bulletins/AWS-2018-013/)
shows that they've already patched and protected _their_ infrastructure but you still have work to do.
[AWS' Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/) means
that you are responsible for patching the operating system running on your EC2 instances, and this is
where things get ... complicated.

## Give it to me straight, Doc

If you want the TL;DR from all this, here are a few general rules to follow:

1. Run your EC2 instances using the most recent AMI that you can which uses the HVM virtualisation mode
1. Patch your operating systems to make sure you have the Meltdown fixes applied
1. Update to more recent EC2 instance families
1. Run the latest Linux kernel you can to ensure you have `PCID` support

## Problems at the lowest level

Let's start off with some basics. The bugs, which exist in all Intel CPUs manufactured since about 2013
(codenamed "Haswell" and later), allow malicious processes to steal information that whould normally be
protected, such as passwords, credit card numbers, and so forth, while that data is being processed by
the CPU. This is due to flaws in the CPU itself, and has nothing to do with Windows, Linux, Mac OSX, 
or any other operating system. The CPU cannot be patched -- it's hardware -- and so we must rely on fixes
to the systems that run on top of those CPUs.

## Fixes applied one level higher

There are generally two classes of system which run directly on a CPU: an operating system, like Linux or
Windows; or a hypervisor, like VMware ESXi, Xen, or Amazon's KVM-based proprietary hypervisor.

If a hypervisor is run on the CPU, it hosts other operating systems (like Linux and Windows).

Applying patches to this first layer can protect against both Spectre and Meltdown attacks, with varying degrees
of performance impact.

Virtual machines running on top of the hypervisor still need to be patched in order to protect processes
running _within_ their operating systems from exploits. These patches will themselves apply potential
performance impacts as well.

## Well-known performance impacts

Intel expects that performance impacts of around 6% will be imposed as a result of fixes for the
vulnerabilities (see References); independent testing on Linux systems has measured 5-30% performance
impacts (depending on the certain workload); Microsoft estimates performance impacts but is being cagey
about actual numbers (see References).

On Linux, patches against Meltdown implement a feature called "Kernel Page Table Isolation" (KPTI), which
impose performance impacts whenever a user-land process executes
a system call, transferring control from the application code into the kernel (for example, whenever data
needs to be read from or written to a disk, or whenever network communication happens).

These performance impacts depend on exactly what _kind_ of work an application does, based on how often these
system calls need to be executed, but in general the performance penalty should be restricted to that
application and not affect other processes on the same system.

Right?

Well, not quite.

## An obscure feature becomes critical

Intel CPUs since 2010 (codename "Westmere") have supported a feature called `PCID` (process context ID) which,
for the past 7 years has been fairly boring and unsupported by Linux kernels, because it didn't really do
anything much for performance or security. Starting with kernel 4.14, it's been supported -- though more from
completeness for a minor capability improvement than as a critical feature.

It turns out that `PCID`is important in alleviating some of the performance impacts of the KPTI patches, and in
preventing one application from killing system performance for all other applications. You see, the kernel maintains
a Translation Lookaside Buffer (TLB), which is kind of like an index for the mappings between kernel and userland
memory pages; when a system call crosses that userland/kernel boundary, kernels running on processors without
`PCID` support must throw away the TLB and start again, increasing the amount of time it takes to execute
frequent operations.

But just because all modern CPUs and Linux kernels support this feature, doesn't mean that you can use it on AWS.

## HVM, PV, and Instance Families, oh my!

AWS' original EC2 instances all ran on top of a hypervisor which provided paravirtualised ("PV") interfaces to the guest
operating systems, which hide some of the features of the underlying CPU, including the `PCID` capability.

More recent instance families (along with some of the older ones) run on a newer hypervisor which exposes more of
the underlying capabilities; this virtualisation mode is called "HVM", which stands for "Hardware Virtual Machine".

Although almost all EC2 instance families (like `t2`, `m3`, `c4`) are available in the HVM mode,
they don't all actually expose the `PCID` feature, which you need in order to avoid the worst performance penalties.

## Help Me, Obi-Wan!

Lucky for you, we've done some research and mapped the EC2 instance families against virtualisation modes and CPU features
to tell which combinations are least-affected. The following table shows what's what:

<img src="/img/blog/pcid.png">

You can see, at a glance, that _no_ PV instance types provide `PCID` -- avoid these, to avoid the worst performance
impacts.

You can also see that even if you choose HVM as your virtualisation type, some instance families still don't
expose the `PCID` feature -- you should avoid these as well.

Frustratingly, the `hs1` (or "high storage") instance type is perhaps worst affected; it's most commonly used for
workloads that need to make a lot of disk I/O system calls, thereby bringing the highest amount of performance
overhead from the Meltdown patches, and it doesn't support PCID, meaning that you're losing out twice over.

## This is all very confusing ...

I've tried to keep a balance between enough technical information and, where possible, useful simplifications.

If you'd like some assistance working through this mess, please [contact us](#contact) and we'd be happy to
see what we can do to help out.

## References

No good article is complete without references, right?

1. [Intel Offers Security Issue Update](https://newsroom.intel.com/news/intel-offers-security-issue-update/)
1. [Understanding the performance impact of Spectre and Meltdown mitigations on Windows Systems](https://cloudblogs.microsoft.com/microsoftsecure/2018/01/09/understanding-the-performance-impact-of-spectre-and-meltdown-mitigations-on-windows-systems/)
1. [Meltdown and Spectre](https://meltdownattack.com/)
1. [Kernel Page-Table Isolation](https://en.wikipedia.org/wiki/Kernel_page-table_isolation)
1. [EC2 instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html)
1. [PCID is now a critical performance/security feature on x86](https://groups.google.com/forum/m/#!topic/mechanical-sympathy/L9mHTbeQLNU)
