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
1) Run `make serverless`, this will zip the lambda code, upload it to the _cevo-builds_ s3 bucket, update the cloudformation template, and deploy the template. 
2) Login to the AWS Console and verify the e-mail address in the correct SES region (unless you've changed the lambda function this should be us-west-2)
3) Update the contact postURL parameters in the config.yaml with the ApiUrl output from the cloudformation stack.
4) Redeploy the website.
