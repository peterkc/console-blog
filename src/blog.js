import 'fs';
import 'path';

import debug from 'debug';
import fetch from 'node-fetch';
import sleep from 'es7-sleep';
import minimist from 'minimist';
import URL from 'normalize-url';

const HTTP = {
  GET: 'GET',
  POST: 'POST'
};

const trace = debug('blog');
const argv = minimist(process.argv.slice(2));

/**
 *
 * @param endpoint Resource endpoint. (required)
 * @param method   HTTP method.       (optional)
 * @param data     HTTP payload.      (optional)
 * @returns {*}
 */
async function api(endpoint, method, data) {
  const server = 'https://jsonplaceholder.typicode.com/';
  const url    = URL(`${server}${endpoint}`);
  const opt    = { method: HTTP.GET };

  if (typeof(method) === 'string')
    opt.method = method;

  if (typeof(data) === 'object') {
    opt.body = JSON.stringify(data);
    opt.headers = { 'content-type': 'application/json' }
  }

  trace(`${url} ${opt.method}`);

  const res    = await fetch(url, opt).catch(err => console.error(err));
  return await res.json();
}


/**
 * Get user by ID and print out name and email.
 *
 * @param userId The user ID.
 * @returns {user}
 */
async function getUser(userId) {
  const user  = await api(`users/${userId}`);

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
  const posts  = await api(`posts?userId=${user.id}`);
  const albums = await api(`albums?userId=${user.id}`);
  const todos  = await api(`todos?userId=${user.id}`);

  const msg = [`  
@${user.username} has ${posts.length} posts, ${albums.length} albums, and ${todos.length} todos

Posts:`];

  posts.forEach( (item) => msg.push(`Post ${item.id}: ${item.title}`) );

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

  comment.forEach( (item) => {
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
  await sleep(5000);

  // Show comment
  const post = data.posts[4];
  await showPost(user, post);

  await sleep(1000);
  await addComment(user, post, 'Great post!');
})();
