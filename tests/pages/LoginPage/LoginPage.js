import { expect } from "@playwright/test";

export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async visit() {
    await this.page.goto("http://localhost:3000/admin/login");
  }

  async ValidatoContentrUrl(content) {
    await this.page.waitForLoadState("networkidle");
    await expect(this.page).toHaveURL(content);
  }

  async SubmitLoginForm(email, password) {
    await this.page.locator("input").nth(0).type(email);
    await this.page.locator("input").nth(1).type(password);
    await this.page.getByRole("button", { name: "Entrar" }).click();
  }

  async ToastHaveMessage(message) {
    await expect(this.page.locator(".toast")).toHaveText(message);
  }

  async EmailHaveAlert(message) {
    await expect(this.page.locator(".email-alert")).toHaveText(message);
  }

  async PasswordlHaveAlert(message) {
    await expect(this.page.locator(".password-alert")).toHaveText(message);
  }
}
