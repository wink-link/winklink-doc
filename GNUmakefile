IMAGE_NAME := winklink-doc
TAG ?= $(shell date +"%Y.%m.%d")-$(shell git rev-parse --short HEAD)
PLATFORM ?= linux/amd64    # default amd64，and you can make PLATFORM=linux/arm64

.PHONY: docker
docker:
	@echo "👉 Building $(IMAGE_NAME):$(TAG) for $(PLATFORM)"
	docker buildx build \
		--platform $(PLATFORM) \
		-t $(IMAGE_NAME):$(TAG) \
		.
