import { test, expect } from '@playwright/test';

test.describe('API Testing — JSONPlaceholder', () => {
  test.setTimeout(30000);

  test('GET — fetch single user', async ({ request }) => {

    const response = await request.get(
      'https://jsonplaceholder.typicode.com/users/1'
    );

    expect(response.status()).toBe(200);
    console.log(`✅ Status: ${response.status()}`);

    const body = await response.json();
    console.log('Response:', body);

    expect(body.id).toBe(1);
    expect(body.email).toContain('@');
    expect(body.name).toBeTruthy();

    console.log(`✅ User: ${body.name}`);
    console.log(`✅ Email: ${body.email}`);
  });

  test('GET — fetch all users', async ({ request }) => {

    const response = await request.get(
      'https://jsonplaceholder.typicode.com/users'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    console.log(`✅ Total users: ${body.length}`);
    console.log(`✅ First user: ${body[0].name}`);
  });

  test('POST — create post', async ({ request }) => {

    const response = await request.post(
      'https://jsonplaceholder.typicode.com/posts',
      {
        data: {
          title: 'QA Engineer Post',
          body: 'Learning API Testing with Playwright',
          userId: 1
        }
      }
    );

    expect(response.status()).toBe(201);
    console.log(`✅ Status: ${response.status()}`);

    const body = await response.json();
    console.log('Created:', body);

    expect(body.title).toBe('QA Engineer Post');
    expect(body.body).toBe('Learning API Testing with Playwright');
    expect(body.id).toBeTruthy();

    console.log(`✅ Created post ID: ${body.id}`);
  });

  test('GET — fetch single post', async ({ request }) => {

    const response = await request.get(
      'https://jsonplaceholder.typicode.com/posts/1'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(1);
    expect(body.title).toBeTruthy();
    expect(body.userId).toBeTruthy();

    console.log(`✅ Post title: ${body.title}`);
    console.log(`✅ User ID: ${body.userId}`);
  });

});