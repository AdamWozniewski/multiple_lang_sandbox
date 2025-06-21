import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';

test.describe('Login - E2E', () => {
  let login: LoginPage;

  test.beforeEach(({ page }) => {
    login = new LoginPage(page);
  });

  test('validation of an empty form', async () => {
    await login.goto();
    await login.submit();
    await login.expectFieldValidation('email');
    await login.expectFieldValidation('password');
  });

  test('incorrect login details', async () => {
    await login.goto();
    await login.fillForm('foo@bar.com', 'badpass');
    await login.submit();
    await login.expectError('Błędny login lub hasło');
  });

  test('correct login redirects', async () => {
    await login.goto();
    await login.fillForm('test@example.com', 'password123');
    await login.submit();
    await login.expectRedirect('/pl/');
  });
});