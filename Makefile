# Prologue
# ------------------------------------------------------------------------------

MAKE  := /usr/bin/make
SHELL := /bin/bash

MAKEFLAGS += --warn-undefined-variables

.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := all
.SUFFIXES:
.DELETE_ON_ERROR:

# Allow % to match multiple directories.
percent_subdirs := 1


# Variables
# ------------------------------------------------------------------------------
MKFILE_PATH := $(abspath $(firstword $(MAKEFILE_LIST)))
CURRENT_DIR := $(notdir $(patsubst %/,%,$(dir $(MKFILE_PATH))))
WORKING_DIR := $(abspath $(dir $(MKFILE_PATH)))
PROJECT_DIR := $(WORKING_DIR)

P := "\\033[34m[+]\\033[0m"

PREFIX       ?= /usr/local/bin
NODE         ?= $(PREFIX)/node
NPM          ?= $(PREFIX)/npm
YARN         ?= $(PREFIX)/yarn

NODE_MODULES ?= ./node_modules
BIN_DIR      ?= $(NODE_MODULES)/.bin
BABEL        ?= $(firstword $(wildcard $(BIN_DIR)/babel) babel)
ESLINT       ?= $(firstword $(wildcard $(BIN_DIR)/eslint) eslint)
NCU          ?= $(firstword $(wildcard $(BIN_DIR)/ncu) ncu)
JEST         ?= $(firstword $(wildcard $(BIN_DIR)/jest) jest)
WEBPACK      ?= $(firstword $(wildcard $(BIN_DIR)/webpack) webpack)


TEST   ?= test/*.spec.js
DEPS   ?= $(SRC) package.json .babelrc

# ------------------------------------------------------------------------------
.PHONY: install

yarn.lock: package.json
	$(YARN) install

install: yarn.lock


# ------------------------------------------------------------------------------
.PHONY: build clean

lib/%.js: COMPILE_ARGS ?= --source-maps
lib/%.js: src/%.js
	@echo -e "$(P) compiling $< to $@"
	$(BABEL) $< --out-file $@ $(COMPILE_ARGS)


clean:
	@rm -fv lib/*
	@rm -fr coverage/*


# ------------------------------------------------------------------------------
.PHONY: lint outdated upgrade test

lint:
	$(ESLINT) src

outdated:
	$(NCU)

upgrade:
	$(NCU) -a

test: build
test:
	$(JEST) $(TEST)

# ------------------------------------------------------------------------------
.PHONY: all

all: install
#all: lint
all: clean
all: lib/blog.js
all: lib/loader.js

# ------------------------------------------------------------------------------
.PHONY: blog loader dist

blog: lib/blog.js

loader: lib/loader.js
loader:
	@echo -e "$(P) bulding loader"
	$(JEST) test/$@.spec.js
	@echo
	$(WEBPACK)
	@echo
	cp -fv template/*.html dist/
	@echo -e "$(P) Done."
