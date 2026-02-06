import { expect } from "@playwright/test";

export class LandingPage {
  constructor(page) {
    this.page = page;
  }

  async visit() {
    await this.page.goto("http://localhost:3000/");
    await this.page.click(".sc-dSCufp.ldCMbv.full.purple");
  }

  async OpenLeadModal() {
    await expect(
      this.page.getByTestId("modal").getByRole("heading")
    ).toHaveText("Fila de espera");
  }

  async SubimtLeadForm(name, email) {
    await this.page.locator("#name").type(name);
    await this.page.locator("#email").type(email);
    await this.page
      .getByRole("button", { name: "Quero entrar na fila!" })
      .click();
  }

  async ToastHaveText(message) {
    await expect(this.page.locator(".toast")).toHaveText(message);

    await expect(this.page.locator(".toast")).toBeHidden({ timeout: 6000 });
  }
}
