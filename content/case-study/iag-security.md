---
title: "Watchmen: Collaborating with Security and APRA to migrate applications to AWS"
client: IAG
clientLink: "#"
cases: cloud
img: iag-thumb.png
banner: iag-banner.png
imgold: iag.png
bannerold: IAG-Watchmen.png
anchor: case-study-6
---
### Industry

Insurance services

### Customer Overview

IAG sell insurance under many leading brands including NRMA Insurance, CGU, SGIO, SGIC, Swann Insurance and WFI (Australia); NZI, State, AMI and Lumley Insurance (New Zealand); Safety and NZI (Thailand); AAA Assurance (Vietnam); and Asuransi Parolamas (Indonesia).

### Business Challenge

IAG had approximately 100 applications sitting on physical servers with a strategic direction to migrate to Amazon Web Services (AWS). Before this could begin, they needed to ensure that all environments met APRA regulations. Of the tools available at the time, none were suitable to fully achieve these objectives.

### Solution

IAG and Cevo worked with APRA to clarify and document a list of compliance requirements. The team then wrote a tool called 'Watchmen' that was governed by 40 unique security policies that would scan each environment (called 'Citizens') and report on compliance with these policies. Where an environment did not conform to the security policies, the tool would report this exception and where the exception occurred.

#### Features of Watchmen:

1. **Isolated rule logic**  
    The logic used for determining compliance to each rule sits in an isolated account that non of the monitored (Citizen) accounts can access. This ensures that there is no tampering with the rule logic, and a result of ‘Compliant’ means what we think it means.  

1. **Serverless**  
    Watchmen runs on AWS serverless infrastructure. All of the rule logic exists in Lambda functions, while the compliance scans themselves are managed by AWS config. This means the ongoing maintenance and support required for Watchmen is very low.  

1. **Auto updating**  
    When new rules are added to Watchmen, the Citizens are able to be automatically updated though the use of SNS topics and Lambda. So once the Citizen CloudFormation stack has been installed on a Citizen account, the account owner never needs to touch it again.  

1. **Easy to extend**  
    As the rule logic sits in Lambda functions, you are able to write new rules in any Lambda supported function. The deployment pipeline created for Watchmen will pick up new rules and incorporate them into the deployment.  


# Benefits

Prior to this project, the migration had been delayed because of the time it would take for the security team to manually check the compliance of any given AWS account. Watchmen has allowed IAG to confidently approve the migration of applications to pre-authorised environments. Now IAG can move forward with their AWS migration knowing that Watchmen automatically checks the environments daily ensuring continual compliance with security procedures and APRA.

Both IAG and Cevo hope to open-source Watchmen over the coming weeks and are working towards that end.
