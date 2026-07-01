const ministryService = require('../services/ministry.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const result = await ministryService.getAll(req.query);
  return ApiResponse.paginated(res, result.data, result.pagination);
});

const getById = asyncHandler(async (req, res) => {
  const ministry = await ministryService.getById(req.params.id);
  return ApiResponse.success(res, ministry);
});

const create = asyncHandler(async (req, res) => {
  const ministry = await ministryService.create(req.body);
  return ApiResponse.created(res, ministry);
});

const update = asyncHandler(async (req, res) => {
  const ministry = await ministryService.update(req.params.id, req.body);
  return ApiResponse.success(res, ministry, 'Updated successfully');
});

const remove = asyncHandler(async (req, res) => {
  await ministryService.delete(req.params.id);
  return ApiResponse.success(res, null, 'Deleted successfully');
});

module.exports = { getAll, getById, create, update, remove };
