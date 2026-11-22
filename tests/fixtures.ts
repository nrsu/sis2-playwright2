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
    const response = await request.post(`${API_URL}/users/register`, {
      data: {
        first_name: 'Test',
        last_name: 'Student',
        dob: '1999-05-17',
        phone: '5551234567',
        email: user.email,
        password: user.password,
        address: {
          street: 'Test Street 12',
          city: 'New York',
          state: 'NY',
          country: 'US',
          postal_code: '10001',
        },
      },
    });
    if (!response.ok()) {
      throw new Error(`Could not create test user: ${response.status()} ${await response.text()}`);
    }
    await use(user);
  },
});

export { expect } from '@playwright/test';
