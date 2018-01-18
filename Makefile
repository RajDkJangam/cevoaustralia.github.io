BASE_URL?=http://localhost:1313/
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

npm-install:
	@npm install

npm-build:
	@npm run build

hugo:
	@hugo --baseUrl $(BASE_URL)

build:
	npm install
	npm run build
	hugo --baseUrl $(BASE_URL) ${BUILD_DRAFTS}

default: build

clean:
	npm run clean
	rm -fr ./public

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
