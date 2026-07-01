const eventService = require('../services/event.service');
const eventRsvpService = require('../services/eventRsvp.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const result = await eventService.getAll(req.query);
  return ApiResponse.paginated(res, result.data, result.pagination);
});

const getById = asyncHandler(async (req, res) => {
  const event = await eventService.getById(req.params.id);
  return ApiResponse.success(res, event);
});

const create = asyncHandler(async (req, res) => {
  const event = await eventService.create(req.body);
  return ApiResponse.created(res, event);
});

const update = asyncHandler(async (req, res) => {
  const event = await eventService.update(req.params.id, req.body);
  return ApiResponse.success(res, event, 'Updated successfully');
});

const remove = asyncHandler(async (req, res) => {
  await eventService.delete(req.params.id);
  return ApiResponse.success(res, null, 'Deleted successfully');
});

const rsvp = asyncHandler(async (req, res) => {
  const rsvpData = { ...req.body, event: req.params.eventId };
  const rsvpResult = await eventRsvpService.create(rsvpData);
  return ApiResponse.created(res, rsvpResult, 'RSVP confirmed');
});

const getRsvps = asyncHandler(async (req, res) => {
  const result = await eventRsvpService.getByEvent(req.params.eventId, req.query);
  return ApiResponse.paginated(res, result.data, result.pagination);
});

module.exports = { getAll, getById, create, update, remove, rsvp, getRsvps };
