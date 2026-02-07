// @ts-check
import { test } from "@playwright/test";
import { LoginPage } from "../actions/LoginPage/LoginPage";

let loginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
});

test("Login com user adm", async ({ page }) => {
  await loginPage.visit();
  await loginPage.ValidatoContentrUrl(/admin\/login/);
  await loginPage.SubmitLoginForm("admin@zombieplus.com", "pwd123");
  await loginPage.ValidatoContentrUrl(/admin\/movies/);
});

test("Login com e-mail incorreto", async ({ page }) => {
  await loginPage.visit();
  await loginPage.ValidatoContentrUrl(/admin\/login/);
  await loginPage.SubmitLoginForm("admin@zombieplus123.com", "pwd123");
  await loginPage.ToastHaveMessage(
    "Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente."
  );
});

test("Login com senha incorreta", async ({ page }) => {
  await loginPage.visit();
  await loginPage.ValidatoContentrUrl(/admin\/login/);
  await loginPage.SubmitLoginForm("admin@zombieplus.com", "pwd456");
  await loginPage.ToastHaveMessage(
    "Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente."
  );
});

test("Login sem preencher os campos e-mail e senha", async ({ page }) => {
  await loginPage.visit();
  await loginPage.ValidatoContentrUrl(/admin\/login/);
  await loginPage.SubmitLoginForm("", "");
  await loginPage.EmailHaveAlert("Campo obrigatório");
  await loginPage.PasswordlHaveAlert("Campo obrigatório");
});

test("Login com e-mail inválido", async ({ page }) => {
  await loginPage.visit();
  await loginPage.ValidatoContentrUrl(/admin\/login/);
  await loginPage.SubmitLoginForm("adminzombieplus123.com", "pwd123");
  await loginPage.EmailHaveAlert("Email incorreto");
});
