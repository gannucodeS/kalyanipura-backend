const streamSettingService = require('../services/streamSetting.service');
const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getPublic = asyncHandler(async (req, res) => {
  const setting = await streamSettingService.getPublic();
  return ApiResponse.success(res, setting || null);
});

module.exports = { getPublic };