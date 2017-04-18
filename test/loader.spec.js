import * as loader from '../src/loader';


beforeEach(() => {
  loader.purge();
});



// purge
// ------------------------------------
it('expect purge to be a function', () => {
  expect(typeof(loader.purge)).toBe('function');
});




// define
// ------------------------------------
it('expect define to be a function', () => {
  expect(typeof(loader.define)).toBe('function');
});


it('expect define to throw when name is null or undefined', () => {
  [null, undefined]
    .forEach( (item) =>
      expect( () => loader.define(item, () => true ) ).toThrowError() );
});

it('expect define to throw when name is not a string', () => {
  [1, {}, true]
    .forEach( (item) =>
      expect( () => loader.define(item, () => true ) ).toThrowError() );
});

it('expect define to throw when name is an empty string', () => {
  expect( () => loader.define('', () => true ) ).toThrowError();
});

it('expect define to throw when module exists', () => {

  const sum = () => { return 1 };

  loader.define('sum', sum);

  expect( () => loader.define('sum', sum ) ).toThrowError('module is already defined');
});

it('expect define to throw when name is not a string', () => {

  [1, {}, true]
    .forEach( (item) =>
      expect( () => loader.define(typeof(item), item ) )
        .toThrowError('module factory argument must be typeof function') );
});



// require
// ------------------------------------
it('expect require to be a function', () => {
  expect(typeof(loader.require)).toBe('function');
});

it('expect require to throw if module does not exists', () => {
  expect( () => loader.require('sum') ).toThrowError('module is not defined');
});

it('expect require to be return a function', () => {

  loader.define('sum', (a, b) => a + b);

  expect(typeof(loader.require('sum'))).toBe('function');

  const sum = loader.require('sum');
  expect( sum(2,2) ).toBe(4);
});
