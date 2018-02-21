BASE_URL?=http://localhost:1313/
S3_BUCKET?=cevo-builds
TRAVIS_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)

ifeq ($(TRAVIS_BRANCH),develop)
        BASE_URL=http://beta.cevo.com.au/
        BUILD_DRAFTS="--buildDrafts"
endif

ifeq ($(TRAVIS_BRANCH),master)
        BASE_URL=https://cevo.com.au/
endif

run:
	hugo serve --baseUrl $(BASE_URL) ${BUILD_DRAFTS}

build:
	hugo --baseUrl $(BASE_URL) ${BUILD_DRAFTS}

default: build

clean:
	rm -fr ./public

serverless:
	zip ServerlessContactForm.zip serverless-contact-form.js
	aws cloudformation package --template-file ./serverless-contact-form-template.yaml --s3-bucket $(S3_BUCKET) --output-template-file serverless-contact-form.yaml
	aws cloudformation deploy --template-file ./serverless-contact-form.yaml --stack-name cevo-web-serverless-contact-form --capabilities CAPABILITY_NAMED_IAM

#
# Docker build for TravisCI 
#

docker-image:
	docker build -t hugo:latest .

travis-ci: docker-image
	docker run -v $(PWD):/data -w /data \
		-e BASE_URL=$(BASE_URL) -e BUILD_DRAFTS=$(BUILD_DRAFTS) \
		hugo:latest make build

.PHONY: all clean dev alpha beta prod
