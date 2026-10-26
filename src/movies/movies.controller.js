const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  await service
    .read(request.params.movieId).then((movie) => {
      if (movie) {
        response.locals.movie = movie;
        return next();
      }
      next({ status: 404, message: `Movie cannot be found.` });
    }) 
  .catch(next);
}

async function read(request, response) {
  await service
    .read(request.params.movieId)
    .then(data => response.json({ data: data }));
}

async function list(request, response) {
  const { is_showing } = request.query;
  await service.list(is_showing).then(data => response.json({ data: data }));
}

async function readTheaters(request, response) {
  await service
    .readTheaters(request.params.movieId)
    .then(data => response.json({ data: data }));
}

async function readReviews(request, response) {
  await service
    .readReviews(request.params.movieId)
    .then(data => response.json({ data: data }));
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  readTheaters: [asyncErrorBoundary(movieExists), readTheaters],
  readReviews: [asyncErrorBoundary(movieExists), readReviews],
};
