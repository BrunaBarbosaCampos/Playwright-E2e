import { expect, test } from "@playwright/test";

export class MoviesPage {
  constructor(page) {
    this.page = page;
  }

  async create(title, overview, company, release_year, cover) {
    await this.page.locator('a[href*="register"]').click();
    await this.page.getByLabel("Titulo do filme").fill(title);
    await this.page.locator("#overview").fill(overview);
    await this.page
      .locator("#select_company_id .react-select__indicators")
      .click();
    await this.page
      .locator(".react-select__option", { hasText: company })
      .click();
    await this.page.locator("#select_year").click();
    await this.page.getByText(release_year).click();

    await this.page.setInputFiles("#cover", cover);
    await this.page.locator(".react-switch").click();

    await this.page.getByRole("button", { name: "Cadastrar" }).click();
  }
}
