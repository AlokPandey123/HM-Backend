const reportService = require('./report.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await reportService.getDashboardStats();
  sendSuccess(res, stats, 'Dashboard stats retrieved');
});
const getPatientReport = asyncHandler(async (req, res) => {
  const report = await reportService.getPatientReport(req.params.patientId);
  sendSuccess(res, report, 'Patient report retrieved');
});
const getTestReports = asyncHandler(async (req, res) => {
  const result = await reportService.getTestReports(req.query);
  sendSuccess(res, result, 'Test reports retrieved');
});
const getRevenueReport = asyncHandler(async (req, res) => {
  const result = await reportService.getRevenueReport(req.query);
  sendSuccess(res, result, 'Revenue report retrieved');
});

module.exports = { getDashboardStats, getPatientReport, getTestReports, getRevenueReport };
