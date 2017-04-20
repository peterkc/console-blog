import * as blog from '../blog';


beforeAll(() => {
});


it('expect to have accessible function', () => {
  ['api', 'print', 'getUser', 'showSummary', 'showPost', 'addComment']
    .forEach( (item) =>
      expect(blog).toHaveProperty(item));
});


it('expect api() response to be valid', async () => {
  const data  = { a: 1 };
  const user  = await blog.api('users/1', 'GET', data);
  const json  = user.json;

  expect(typeof(user)).toBe('object');
  expect(typeof(json)).toBe('object');

  expect(user.option.method).toBe('GET');
  expect(user.option.body).toBe(JSON.stringify(data));
  expect(user.option.headers['content-type']).toBe('application/json');
});

it('expect api() to contain an error', async () => {
  const user = await blog.api('null/1');

  expect(typeof(user)).toBe('object');
  expect(typeof(user.json)).toBe('object');

  console.error(user);
  expect(typeof(user.error)).toBe('string');
});

it('expect getUser() to return a {user} object', async () => {
  const user  = await blog.getUser(1);

  expect(typeof(user)).toBe('object');
  expect(user.id).toBe(1);
});

it('expect showSummary() to return a {summary} object', async () => {
  const user    = await blog.getUser(1);
  const summary = await blog.showSummary(user);

  expect(typeof(summary)).toBe('object');

  expect(Array.isArray(summary.posts)).toBeTruthy();
  expect(Array.isArray(summary.albums)).toBeTruthy();
  expect(Array.isArray(summary.todos)).toBeTruthy();
});

it('expect showPost() to return a [comments] object', async () => {
  const user     = await blog.getUser(1);
  const summary  = await blog.showSummary(user);
  const comments = await blog.showPost(user, summary.posts[1]);

  expect(typeof(comments)).toBe('object');
});

it('expect addComment() to return a Comment object', async () => {
  const user     = await blog.getUser(1);
  const summary  = await blog.showSummary(user);
  const comments = await blog.showPost(user, summary.posts[1]);
  const comment  = await blog.addComment(user, comments[1], 'Good post!');

  expect(typeof(comment)).toBe('object');
});
