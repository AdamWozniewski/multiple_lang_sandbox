import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/login");
  }

  async fillForm(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
  }

  async submit() {
    await this.page.click('button[type="submit"]');
  }

  async expectFieldValidation(field: "email" | "password") {
    const msg = await this.page.$eval(
      `input[name="${field}"]`,
      (el: HTMLInputElement) => el.validationMessage,
    );
    expect(msg.length).toBeGreaterThan(0);
  }

  async expectError(expectedText?: string) {
    const alert = this.page.locator("div.alert.alert-danger");
    await expect(alert).toBeVisible({ timeout: 10_000 });
    if (expectedText) {
      await expect(alert).toContainText(expectedText, { timeout: 10_000 });
    }
  }

  async expectRedirect(path: string) {
    await expect(this.page).toHaveURL(new RegExp(path));
  }
}
