# Coding Challenge

## Requirements
 
* [Node v6.9+][node]
* [Homebrew][brew]

``` 
> /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
> brew install node
```


### CLI Blog Simulator

```
> make blog

```

This `make` target will transpile related ES6 files and generate a CommonJS module. To run the cli, use the following command.

```
> node lib/blog.js
> node lib/blog.js --user=2
```


### Simple Loader

```
> make loader

```

This `make` target will transpile related ES6 files and use webpack to generate a compatible file for use in a browser.


### Tests

```
> make test
```


[node]: http://slashdot.org
[brew]: https://brew.sh/

