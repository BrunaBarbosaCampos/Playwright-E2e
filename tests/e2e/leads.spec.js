// @ts-check
import { test, expect } from "@playwright/test";
import { LandingPage } from "../actions/LandiPage/LandingPage";
import { faker } from "@faker-js/faker";

let landingPage;

const NameLead = faker.person.fullName();
const EmailLead = faker.internet.email();

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
});

test("Deve cadastrar um lead na fila de espera", async ({ page }) => {
  await landingPage.visit();
  await landingPage.OpenLeadModal();
  await landingPage.SubimtLeadForm(NameLead, EmailLead);
  await landingPage.ToastHaveText(
    "Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!"
  );
});

test("Não deve cadastrar quando um e-mail já existe ", async ({
  page,
  request,
}) => {
  // Preparando o pre-cadastro através do front-end para a realização do caso de teste
  // await landingPage.visit();
  // await landingPage.OpenLeadModal();
  // await landingPage.SubimtLeadForm(NameLead, EmailLead);

  // Preparando o pre-cadastro através da API para a realização do caso de teste

  const newLead = await request.post("http://localhost:3333/leads", {
    data: {
      name: NameLead,
      email: EmailLead,
    },
  });

  await expect(newLead.ok()).toBeTruthy;

  await landingPage.visit();
  await landingPage.OpenLeadModal();
  await landingPage.SubimtLeadForm(NameLead, EmailLead);

  await landingPage.ToastHaveText(
    "O endereço de e-mail fornecido já está registrado em nossa fila de espera."
  );
});

test("Cadastro com e-mail incorreto", async ({ page }) => {
  await page.goto("http:localhost:3000/");
  await page.click(".sc-dSCufp.ldCMbv.full.purple");

  // valida se é aberto o modal correto ao clicar no botão de lead
  await expect(page.getByTestId("modal").getByRole("heading")).toHaveText(
    "Fila de espera"
  );

  await page.locator("#name").type(NameLead);
  await page.locator("#email").type("teste com e-mail errado");
  await page.getByRole("button", { name: "Quero entrar na fila!" }).click();

  await expect(
    page.locator("#email").locator("..").locator(".alert")
  ).toHaveText("Email incorreto");
});

test("Obrigatoridade do campo nome", async ({ page }) => {
  await page.goto("http:localhost:3000/");
  await page.click(".sc-dSCufp.ldCMbv.full.purple");

  // valida se é aberto o modal correto ao clicar no botão de lead
  await expect(page.getByTestId("modal").getByRole("heading")).toHaveText(
    "Fila de espera"
  );

  await page.locator("#email").type(EmailLead);
  await page.getByRole("button", { name: "Quero entrar na fila!" }).click();

  await expect(
    page.locator("#name").locator("..").locator(".alert")
  ).toHaveText("Campo obrigatório");
});

test("Obrigatoridade do campo e-mail", async ({ page }) => {
  await page.goto("http:localhost:3000/");
  await page.click(".sc-dSCufp.ldCMbv.full.purple");

  // valida se é aberto o modal correto ao clicar no botão de lead
  await expect(page.getByTestId("modal").getByRole("heading")).toHaveText(
    "Fila de espera"
  );

  await page.locator("#name").type(NameLead);
  await page.getByRole("button", { name: "Quero entrar na fila!" }).click();

  await expect(
    page.locator("#email").locator("..").locator(".alert")
  ).toHaveText("Campo obrigatório");
});

test("Obrigatoridade do campo nome e e-mail", async ({ page }) => {
  await page.goto("http:localhost:3000/");
  await page.click(".sc-dSCufp.ldCMbv.full.purple");

  // valida se é aberto o modal correto ao clicar no botão de lead
  await expect(page.getByTestId("modal").getByRole("heading")).toHaveText(
    "Fila de espera"
  );

  await page.getByRole("button", { name: "Quero entrar na fila!" }).click();

  //validação de obrigatoriedade do campos
  await expect(
    page.locator("#name").locator("..").locator(".alert")
  ).toHaveText("Campo obrigatório");

  // validação de obrigatoriedade di campo e-mail
  await expect(
    page.locator("#email").locator("..").locator(".alert")
  ).toHaveText("Campo obrigatório");
});
