const givingService = require('../services/giving.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const record = asyncHandler(async (req, res) => {
  const giving = await givingService.create(req.body);
  return ApiResponse.created(res, giving, 'Giving recorded successfully');
});

const getAll = asyncHandler(async (req, res) => {
  const result = await givingService.getAll(req.query);
  return ApiResponse.paginated(res, result.data, result.pagination);
});

const getById = asyncHandler(async (req, res) => {
  const giving = await givingService.getById(req.params.id);
  return ApiResponse.success(res, giving);
});

const remove = asyncHandler(async (req, res) => {
  await givingService.delete(req.params.id);
  return ApiResponse.success(res, null, 'Deleted successfully');
});

module.exports = { record, getAll, getById, remove };
