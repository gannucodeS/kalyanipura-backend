const adminService = require('../services/admin.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await adminService.login(email, password);

  res.cookie('adminToken', result.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return ApiResponse.success(res, { token: result.token }, 'Login successful');
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('adminToken');
  return ApiResponse.success(res, null, 'Logged out successfully');
});

const me = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, { email: req.admin.email });
});

module.exports = { login, logout, me };
