const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(request, response) {
  await service.list()
    .then(data => response.json({data: data}))
}

module.exports = {
  list: asyncErrorBoundary(list),
};
