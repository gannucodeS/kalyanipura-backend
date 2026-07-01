const galleryService = require('../services/gallery.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const result = await galleryService.getAll(req.query);
  return ApiResponse.paginated(res, result.data, result.pagination);
});

const getById = asyncHandler(async (req, res) => {
  const item = await galleryService.getById(req.params.id);
  return ApiResponse.success(res, item);
});

const create = asyncHandler(async (req, res) => {
  const item = await galleryService.create(req.body);
  return ApiResponse.created(res, item);
});

const update = asyncHandler(async (req, res) => {
  const item = await galleryService.update(req.params.id, req.body);
  return ApiResponse.success(res, item, 'Updated successfully');
});

const remove = asyncHandler(async (req, res) => {
  await galleryService.delete(req.params.id);
  return ApiResponse.success(res, null, 'Deleted successfully');
});

module.exports = { getAll, getById, create, update, remove };
