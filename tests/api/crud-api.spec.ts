import { test, expect } from '@playwright/test';

test.describe('CRUD API — JSONPlaceholder', () => {
  test.setTimeout(30000);

  test('GET — read post', async ({ request }) => {
    const response = await request.get(
      'https://jsonplaceholder.typicode.com/posts/1'
    );

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.id).toBe(1);
    expect(body.title).toBeTruthy();
    console.log(`✅ GET: Found post: ${body.title}`);
  });

  test('POST — create post', async ({ request }) => {
    const response = await request.post(
      'https://jsonplaceholder.typicode.com/posts',
      {
        data: {
          title: 'Brand New Post',
          body: 'Created with POST',
          userId: 1
        }
      }
    );

    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body.title).toBe('Brand New Post');
    expect(body.id).toBeTruthy();
    console.log(`✅ POST: Created with ID: ${body.id}`);
  });

  test('PUT — full update', async ({ request }) => {
    const response = await request.put(
      'https://jsonplaceholder.typicode.com/posts/1',
      {
        data: {
          id: 1,
          title: 'PUT Updated Title',
          body: 'PUT Updated body',
          userId: 1
        }
      }
    );

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.title).toBe('PUT Updated Title');
    expect(body.body).toBe('PUT Updated body');
    console.log(`✅ PUT: Full update done: ${body.title}`);
  });

  test('PATCH — partial update', async ({ request }) => {
    const response = await request.patch(
      'https://jsonplaceholder.typicode.com/posts/1',
      {
        data: {
          title: 'PATCH Only Title'
        }
      }
    );

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.title).toBe('PATCH Only Title');
    console.log(`✅ PATCH: Only title updated: ${body.title}`);
  });

  test('DELETE — remove post', async ({ request }) => {
    const response = await request.delete(
      'https://jsonplaceholder.typicode.com/posts/1'
    );

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toEqual({});
    console.log('✅ DELETE: Post removed successfully!');
  });

});