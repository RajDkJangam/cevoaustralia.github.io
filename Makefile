BASE_URL?=http://localhost:1313/
TRAVIS_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)

ifeq ($(TRAVIS_BRANCH),develop)
        BASE_URL=http://beta.cevo.com.au/
endif

ifeq ($(TRAVIS_BRANCH),master)
        BASE_URL=https://cevo.com.au/
endif

run:
	@hugo serve --baseUrl $(BASE_URL)

npm-install:
	@npm install

npm-build:
	@npm run build

hugo:
	@hugo --baseUrl $(BASE_URL)

build:
	@npm install
	@npm run build
	@hugo --baseUrl $(BASE_URL)

default: build

clean:
	rm -fr ./public

#
# Docker build for TravisCI 
#

docker-image:
	docker build -t hugo:latest .

travis-ci: docker-image
	docker run -v $(PWD):/data -w /data \
		-e BASE_URL=$(BASE_URL) \
		hugo:latest make build

.PHONY: all clean dev alpha beta prod
