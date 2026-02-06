// @ts-check
import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { MoviesPage } from "../pages/MoviesPage/MoviesPage";
import { executeSQL } from "../support/database";
import movies from "../support/fixtures/movies.json" assert { type: "json" };

let loginPage;
let moviesPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  moviesPage = new MoviesPage(page);
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
    movie.company,
    movie.release_year,
    movie.cover
  );

  await loginPage.ToastHaveMessage("UhullCadastro realizado com sucesso!");
});
