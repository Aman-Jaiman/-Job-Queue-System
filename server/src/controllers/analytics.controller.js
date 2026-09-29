import { getQueueAnalytics } from "../services/analytics/analytics.service.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await getQueueAnalytics();

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    next(error);
  }
};
