const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  await service
    .read(request.params.reviewId)
    .then((review) => {
      if (review) {
        response.locals.review = review;
        return next();
      }
      next({ status: 404, message: `Review cannot be found.` });
    })
    .catch(next);
}

async function destroy(request, response) {
  await service
    .destroy(response.locals.review.review_id)
    .then(() => response.sendStatus(204));
}

async function list(request, response) {
  await service.list().then(data => response.json({ data: data }))
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  const updatedReview = {
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  await service
    .update(updatedReview)
    .then((data) => response.json({ data }));
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
