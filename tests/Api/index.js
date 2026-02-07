import { expect } from "@playwright/test";
import fs from "fs";

export class Api {
  constructor(request) {
    this.request = request;
  }

  async tokenSession(emailtoken, passwordtoken) {
    const newSession = await this.request.post(
      "http://localhost:3333/sessions",
      {
        data: {
          email: emailtoken,
          password: passwordtoken,
        },
      }
    );

    await expect(newSession.ok()).toBeTruthy();
    const body = await newSession.json();

    return body.token;
  }

  async postMovie(token, movie) {
    const newMovie = await this.request.post("http://localhost:3333/movies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      multipart: {
        cover: fs.createReadStream(movie.cover),
        title: movie.title,
        overview: movie.overview,
        company_id: movie.company_id,
        release_year: movie.release_year,
        featured: movie.featured,
      },
    });

    await expect(newMovie.ok()).toBeTruthy();
  }
}
