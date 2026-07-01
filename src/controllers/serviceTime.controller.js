const serviceTimeService = require('../services/serviceTime.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const result = await serviceTimeService.getAll(req.query);
  return ApiResponse.paginated(res, result.data, result.pagination);
});

const getById = asyncHandler(async (req, res) => {
  const serviceTime = await serviceTimeService.getById(req.params.id);
  return ApiResponse.success(res, serviceTime);
});

const create = asyncHandler(async (req, res) => {
  const serviceTime = await serviceTimeService.create(req.body);
  return ApiResponse.created(res, serviceTime);
});

const update = asyncHandler(async (req, res) => {
  const serviceTime = await serviceTimeService.update(req.params.id, req.body);
  return ApiResponse.success(res, serviceTime, 'Updated successfully');
});

const remove = asyncHandler(async (req, res) => {
  await serviceTimeService.delete(req.params.id);
  return ApiResponse.success(res, null, 'Deleted successfully');
});

module.exports = { getAll, getById, create, update, remove };
