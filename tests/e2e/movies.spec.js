// @ts-check
import { test, expect } from "@playwright/test";
import { LoginPage } from "../actions/LoginPage/LoginPage";
import { MoviesPage } from "../actions/MoviesPage/MoviesPage";
import { executeSQL } from "../support/database";
import { Api } from "../Api/index";
import movies from "../support/fixtures/movies.json" assert { type: "json" };

let loginPage;
let moviesPage;
let api;

test.beforeEach(async ({ page, request }) => {
  loginPage = new LoginPage(page);
  moviesPage = new MoviesPage(page);
  api = new Api(request);
});

test("Deve ser possível cadastrar um novo filme", async ({ page }) => {
  const movie = movies.guerra_mundial_z;

  await executeSQL(`DELETE FROM public.movies WHERE title = '${movie.title}';`);

  // é importante estar logado
  await loginPage.visit();
  await loginPage.ValidatoContentrUrl(/admin\/login/);
  await loginPage.SubmitLoginForm("admin@zombieplus.com", "pwd123");
  await loginPage.ValidatoContentrUrl(/admin\/movies/);

  await moviesPage.create(
    movie.title,
    movie.overview,
    movie.company_name,
    movie.release_year,
    movie.cover
  );

  await loginPage.ToastHaveMessage("UhullCadastro realizado com sucesso!");
});

test("Não deve cadastrar um filme duplicado", async ({ page, request }) => {
  const movie = movies.resident_evil_o_hospedeiro;
  await executeSQL(`DELETE FROM public.movies WHERE title = '${movie.title}';`);

  const token = await api.tokenSession("admin@zombieplus.com", "pwd123");
  await api.postMovie(token, movie);

  await loginPage.visit();
  await loginPage.ValidatoContentrUrl(/admin\/login/);
  await loginPage.SubmitLoginForm("admin@zombieplus.com", "pwd123");
  await loginPage.ValidatoContentrUrl(/admin\/movies/);

  await moviesPage.create(
    movie.title,
    movie.overview,
    movie.company_name,
    movie.release_year,
    movie.cover
  );

  await page.waitForTimeout(4000);

  await loginPage.ToastHaveMessage(
    "Oops!Este conteúdo já encontra-se cadastrado no catálogo"
  );
});
