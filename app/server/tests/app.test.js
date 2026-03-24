import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('app', () => {
  it('returns health status', async () => {
    const response = await request(createApp()).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('validates register payloads', async () => {
    const response = await request(createApp()).post('/api/auth/register').send({
      email: 'not-an-email',
      password: 'short',
      fullName: ''
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Validation failed');
  });
});
