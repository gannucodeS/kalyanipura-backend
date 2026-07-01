const contactService = require('../services/contact.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const submit = asyncHandler(async (req, res) => {
  const message = await contactService.create(req.body);
  return ApiResponse.created(res, message, 'Message sent successfully');
});

const getAll = asyncHandler(async (req, res) => {
  const result = await contactService.getAll(req.query);
  return ApiResponse.paginated(res, result.data, result.pagination);
});

const getById = asyncHandler(async (req, res) => {
  const message = await contactService.getById(req.params.id);
  return ApiResponse.success(res, message);
});

const markAsRead = asyncHandler(async (req, res) => {
  const message = await contactService.markAsRead(req.params.id);
  return ApiResponse.success(res, message);
});

const remove = asyncHandler(async (req, res) => {
  await contactService.delete(req.params.id);
  return ApiResponse.success(res, null, 'Deleted successfully');
});

module.exports = { submit, getAll, getById, markAsRead, remove };
