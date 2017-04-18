'use strict';

require('fs');

require('path');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _es7Sleep = require('es7-sleep');

var _es7Sleep2 = _interopRequireDefault(_es7Sleep);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _normalizeUrl = require('normalize-url');

var _normalizeUrl2 = _interopRequireDefault(_normalizeUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HTTP = {
  GET: 'GET',
  POST: 'POST'
};

const trace = (0, _debug2.default)('blog');
const argv = (0, _minimist2.default)(process.argv.slice(2));

/**
 *
 * @param endpoint Resource endpoint. (required)
 * @param method   HTTP method.       (optional)
 * @param data     HTTP payload.      (optional)
 * @returns {*}
 */
async function api(endpoint, method, data) {
  const server = 'https://jsonplaceholder.typicode.com/';
  const url = (0, _normalizeUrl2.default)(`${server}${endpoint}`);
  const opt = { method: HTTP.GET };

  if (typeof method === 'string') opt.method = method;

  if (typeof data === 'object') {
    opt.body = JSON.stringify(data);
    opt.headers = { 'content-type': 'application/json' };
  }

  trace(`${url} ${opt.method}`);

  const res = await (0, _nodeFetch2.default)(url, opt).catch(err => console.error(err));
  return await res.json();
}

/**
 * Get user by ID and print out name and email.
 *
 * @param userId The user ID.
 * @returns {user}
 */
async function getUser(userId) {
  const user = await api(`users/${userId}`);

  const msg = `
${user.name} (${user.email})`;

  console.log(msg);
  return user;
}

/**
 * Show a summary of posts, albums, and todos.
 *
 * @param user The {user} object.
 * @returns {posts, albums, todos}
 */
async function showSummary(user) {
  const posts = await api(`posts?userId=${user.id}`);
  const albums = await api(`albums?userId=${user.id}`);
  const todos = await api(`todos?userId=${user.id}`);

  const msg = [`  
@${user.username} has ${posts.length} posts, ${albums.length} albums, and ${todos.length} todos

Posts:`];

  posts.forEach(item => msg.push(`Post ${item.id}: ${item.title}`));

  console.log(msg.join('\n'));

  return { posts: posts, albums: albums, todos: todos };
}

/**
 * Show a post.
 *
 * @param user The {user} object.
 * @param post The {post} object.
 * @returns {comment}
 */
async function showPost(user, post) {
  const comment = await api(`comments?userId=${user.id}&postId=${post.id}`);

  const msg = [`  
Viewing post "${post.title}" which has ${comment.length} comments.  

Comments:`];

  comment.forEach(item => {
    msg.push(`${item.id} [${item.email}]: ${item.name} `);
    msg.push(`${item.body.replace(/\n/g, '')}`);
    msg.push('');
  });

  console.log(msg.join('\n'));

  return comment;
}

/**
 * Add a comment to a post.
 *
 * @param user    The {user} object.
 * @param post    The {post} object.
 * @param comment The comment to post.
 * @returns {comment}
 */
async function addComment(user, post, comment) {
  const data = {
    name: post.title,
    email: user.email,
    body: comment
  };
  const result = await api(`posts/${post.id}/comments?userId=${user.id}`, HTTP.POST, data);
  // const json = await result.json();

  const msg = `
You commented:
${result.body}
`;

  console.log(msg);

  return result;
}

/**
 * Start simulation
 */
/* istanbul ignore next  */
(async function () {
  // Get user by ID
  const user = await getUser(argv.user ? argv.user : 1);

  // Show user summary and posts
  const data = await showSummary(user);

  // Wait 5 secs
  await (0, _es7Sleep2.default)(5000);

  // Show comment
  const post = data.posts[4];
  await showPost(user, post);

  await (0, _es7Sleep2.default)(1000);
  await addComment(user, post, 'Great post!');
})();

//# sourceMappingURL=blog.js.map