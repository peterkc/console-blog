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

const trace  = debug('blog');
const argv   = minimist(process.argv.slice(2));

/* istanbul ignore next  */
const silent = __SILENT__? true : !!argv.silent;

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

  const res = await fetch(url, opt)
    .catch( (err) => {
      const msg = `Error fetching [${url}]: \nReason: ${err.message}`;
      /* istanbul ignore next  */
      if (!silent) console.log(msg);

      return { json: {}, error: msg }
    });

  const json   = typeof(res.json) === 'function' ? (await res.json()) : res.json;

  return {
    endpoint: endpoint,
    method  : method,
    option  : opt,
    response: res,
    json    : json,
    error   : res.error
  };
}

/**
 * Console log message
 *
 * @param msg The string to output.
 */
/* istanbul ignore next  */
function print(msg) {
  if (!silent) console.log(msg);
}


/**
 * Get user by ID and print out name and email.
 *
 * @param userId The user ID.
 * @returns {user}
 */
async function getUser(userId) {
  const user  = await api(`users/${userId}`);
  const json  = user.json;

  const msg = `
${json.name} (${json.email})`;

  print(msg);
  return json;
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
@${user.username} has ${posts.json.length} posts, ${albums.json.length} albums, and ${todos.json.length} todos

Posts:`];

  // posts.json.forEach( (item) => msg.push(`Post ${item.id}: ${item.title}`) );

  print(msg.join('\n'));

  return { posts: posts.json, albums: albums.json, todos: todos.json };
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
  const json    = comment.json;

  const msg = [`
Viewing post "${post.title}" which has ${json.length} comments.

Comments:`];

  json.forEach( (item) => {
    msg.push(`${item.id} [${item.email}]: ${item.name} `);
    msg.push(`${item.body.replace(/\n/g, '')}`);
    msg.push('');
  });

  print(msg.join('\n'));

  return json;
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
    name : post.title,
    email: user.email,
    body : comment
  };
  const result = await api(`posts/${post.id}/comments?userId=${user.id}`, HTTP.POST, data);
  const json = result.json;

  const msg = `
You commented:
${json.body}
`;

  print(msg);

  return json;
}

/* istanbul ignore next  */
export {
  api,
  print,
  getUser,
  showSummary,
  showPost,
  addComment
}


/**
 * Start simulation
 */
/* istanbul ignore next  */
if (require.main === module) {
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
}
