(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SimpleLoader"] = factory();
	else
		root["SimpleLoader"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "define", function() { return addModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "require", function() { return getModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "purge", function() { return purge; });

const modules = {};

/**
 * Add a module factory to the cache.
 *
 * @param name    Module name.
 * @param factory Function to create an instance of the module.
 *
 * @throws Will throw error if name is not a valid module name.
 * @throws Will throw error if module already exists.
 * @throws Will throw error if module factory is not typeof Function.
 */
function addModule(name, factory) {

  if (name === null || typeof(name) === 'undefined')
    throw new Error('module name is required');

  if (typeof(name) !== 'string' || name === '')
    throw new Error('module name is not valid');

  if (modules[name])
    throw new Error(`${name} module is already defined`);

  if (typeof(factory) !== 'function')
    throw new Error(`${name} module factory argument must be typeof function`);

  modules[name] = factory;
}

/**
 * Get an instance of the module by name.
 *
 * @param name Module name.
 *
 * @throws Will throw error if module does not exists.
 */
function getModule(name) {

  const target = modules[name];

  if (typeof(target) !== 'function')
    throw new Error(`${name} module is not defined`);

  return target;
}

/**
 * Remove all modules
 */
function purge() {
  Object.keys(modules).forEach(function(key) { delete modules[key]; });
}




/***/ })
/******/ ]);
});
//# sourceMappingURL=simple-loader.js.map