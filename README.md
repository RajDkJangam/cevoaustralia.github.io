# Cevo Website port to hugo

[Hugo](http://gohugo.io/getting-started/quick-start/) is static website generator.
`Dockerfile` produces build environment with `hugo` and `pygments` installed.

# How to develop?

* [Install Hugo](http://gohugo.io/getting-started/installing/) locally

* Clone this repository
  
  `git clone git@github.com:cevoaustralia/cevoaustralia.github.io.git`

* Install submodules (theme)
  
  `cd cevoaustralia.github.io`
  
  `git submodule update --init --recursive`

* Run the site locally on [http://localhost:1313](http://localhost:1313)
  
  `hugo serve` or use `make`

## Local development with docker

* `docker-compose build dev`
* `docker-compose up dev`

## Build static html 

* `make travis-ci`

  This will build in html like in CI based on your branch name. 

* `hugo --baseUrl http://localhost:1313`

  Output static html to `public` folder.

## The Serverless Contact Form
In order to use the serverless contact form we need to do a number of things:
1) Make sure the ServerlessContactForm.zip in the /static/ directory has the latest copy of the serverless-contact-form.js code.
2) Commit this to git, the TravisCI build process should then upload this Zip file to the S3 bucket/Website.
3) Make sure the serverless-contact-form.yaml cloudformation template is referencing the zip file correctly and has the correct e-mail addresses in the SENDER and RECEIVER environment variables.
4) Deploy the serverless-contact-form.yaml cloudformation template. This will setup the Lambda function and API gateway bits but WILL NOT verify the e-mails in SES.
5) Login to the AWS Console and verify the e-mail address in the correct SES region (unless you've changed the lambda function this should be us-west-2)
6) Update the contact postURL parameters in the config.yaml with the ApiUrl output from the cloudformation stack.
7) Redeploy the website.