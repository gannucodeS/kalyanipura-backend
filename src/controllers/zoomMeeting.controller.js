const zoomMeetingService = require('../services/zoomMeeting.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getPublic = asyncHandler(async (req, res) => {
  const meeting = await zoomMeetingService.getPublic();
  return ApiResponse.success(res, meeting || null);
});

module.exports = { getPublic };