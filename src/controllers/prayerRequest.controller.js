const prayerRequestService = require('../services/prayerRequest.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const result = await prayerRequestService.getPublic(req.query);
  return ApiResponse.paginated(res, result.data, result.pagination);
});

const getById = asyncHandler(async (req, res) => {
  const request = await prayerRequestService.getById(req.params.id);
  return ApiResponse.success(res, request);
});

const submit = asyncHandler(async (req, res) => {
  const request = await prayerRequestService.submit(req.body);
  return ApiResponse.created(res, request, 'Prayer request submitted');
});

const pray = asyncHandler(async (req, res) => {
  const request = await prayerRequestService.pray(req.params.id);
  return ApiResponse.success(res, request);
});

const approve = asyncHandler(async (req, res) => {
  const request = await prayerRequestService.approve(req.params.id);
  return ApiResponse.success(res, request, 'Prayer request approved');
});

const remove = asyncHandler(async (req, res) => {
  await prayerRequestService.delete(req.params.id);
  return ApiResponse.success(res, null, 'Deleted successfully');
});

module.exports = { getAll, getById, submit, pray, approve, remove };
