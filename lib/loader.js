'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

  if (name === null || typeof name === 'undefined') throw new Error('module name is required');

  if (typeof name !== 'string' || name === '') throw new Error('module name is not valid');

  if (modules[name]) throw new Error(`${name} module is already defined`);

  if (typeof factory !== 'function') throw new Error(`${name} module factory argument must be typeof function`);

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

  if (typeof target !== 'function') throw new Error(`${name} module is not defined`);

  return target;
}

/**
 * Remove all modules
 */
function purge() {
  Object.keys(modules).forEach(function (key) {
    delete modules[key];
  });
}

exports.define = addModule;
exports.require = getModule;
exports.purge = purge;

//# sourceMappingURL=loader.js.map