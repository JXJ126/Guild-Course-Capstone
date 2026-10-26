const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  return db("movies").select("*").where({ movie_id }).first();
}

async function readTheaters(movie_id) {
  return db("theaters")
          .join(
            "movies_theaters",
            "theaters.theater_id",
            "movies_theaters.theater_id"
          )
          .select("theaters.*")
          .where({ "movies_theaters.movie_id": movie_id })
          .groupBy("theaters.theater_id");
}

async function readReviews(movie_id) {
  const reviews = await db("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select(
      "reviews.*",
      "critics.preferred_name",
      "critics.surname",
      "critics.organization_name"
    )
    .where({ "reviews.movie_id": movie_id });

  return reviews.map(
    ({ preferred_name, surname, organization_name, ...review }) => ({
      ...review,
      critic: {
        critic_id: review.critic_id,
        preferred_name,
        surname,
        organization_name,
      },
    })
  );
}


module.exports = {
  list,
  read,
  readTheaters,
  readReviews,
};
