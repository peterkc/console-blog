import debug from 'debug';

const trace  = debug('blog');
const stubs = {
  albums  : require('./node-fetch/albums.json'),
  comments: require('./node-fetch/comments.json'),
  posts   : require('./node-fetch/posts.json'),
  todos   : require('./node-fetch/todos.json'),
  users   : require('./node-fetch/user.json')
};

/*istanbul ignore next*/
async function fetch(url, opts) {

  const obj = {};

  obj.json = () => {
    let stub = {};

    Object.keys(stubs).forEach((key) => {
      if (url.indexOf(`/${key}`) > 0) return stub = stubs[key];
    });

    return stub;
  };

  return new Promise( (resolve, reject) => {

    if (url.indexOf('/null/') > 0)
      throw new Error('Invalid Resource');

    if (url.indexOf('/reject/') > 0)
      reject(new Error('Invalid Resource'));
    else
      resolve(obj);
  });
}

module.exports = fetch;
