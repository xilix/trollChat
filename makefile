.PHONY: all 
.DEFAULT: all

all: docs
docs: set
		NODE_PATH=. ./node_modules/mocha/bin/mocha --reporter doc tests/*js > docs/index.htm
set: clean
		mkdir -p docs
clean:
		rm -rf docs/index.htm
specTest:
		NODE_PATH=. ./node_modules/mocha/bin/mocha --reporter spec tests/index.js
test:
		NODE_PATH=. ./node_modules/mocha/bin/mocha --reporter nyan tests/index.js
debug: 
		NODE_PATH=. ./node_modules/mocha/bin/mocha --debug-brk --reporter nyan tests/index.js
spec: specTest

