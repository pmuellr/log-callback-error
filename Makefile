#-----------------------------------------------------------------------------
# The MIT License
#
# Copyright (c) 2011 Patrick Mueller
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#-----------------------------------------------------------------------------

all: help

#-------------------------------------------------------------------------------
build:
	node node_modules/.bin/coffee -c -o . src/log-callback-error.coffee

#-------------------------------------------------------------------------------
watch:
	python vendor/run-when-changed.py "make build" *

#-------------------------------------------------------------------------------
get-vendor:
	npm install coffee-script@1.1.2
	curl https://raw.github.com/gist/240922/0f5bedfc42b3422d0dee81fb794afde9f58ed1a6/run-when-changed.py > vendor/run-when-changed.py

#-------------------------------------------------------------------------------
clean:
	-rm -rf node_modules/* node_modules/.bin vendor/*

#-------------------------------------------------------------------------------
help:
	@echo make targets available:
	@echo "  help       - print this help"
	@echo "  build      - build the stuff"
	@echo "  watch      - run the build continuously"
	@echo "  get-vendor - get 3rd party pre-reqs"
	@echo "  test       - run the tests against the build"
	@echo "  clean      - clear out old build stuff"
