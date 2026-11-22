import { test as base } from '@playwright/test';

const API_URL = process.env.API_URL ?? 'https://api.practicesoftwaretesting.com';

export interface TestUser {
  email: string;
  password: string;
}

let counter = 0;

export const test = base.extend<{ registeredUser: TestUser }>({
  // A throwaway account created through the API for each test, so tests never share
  // (or lock) one common demo account.
  registeredUser: async ({ request }, use) => {
    const user: TestUser = {
      email: `student.${Date.now()}.${process.pid}.${counter++}.${Math.floor(Math.random() * 1e4)}@example.com`,
      password: 'Str0ng!Passw0rd#2026',
    };
for (let attempt = 1; attempt <= 4; attempt++) {
  const response = await request.post(`${API_URL}/users/register`, { data: payload });
  if (response.ok()) { lastError = ''; break; }
  lastError = `${response.status()} ${await response.text()}`;
  await new Promise((r) => setTimeout(r, attempt * 1500));
}
if (lastError) throw new Error(`Could not create test user: ${lastError}`);
    await use(user);
  },
});

export { expect } from '@playwright/test';
