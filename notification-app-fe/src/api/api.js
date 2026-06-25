import axios from 'axios';

const BASE_URL = 'http://4.224.186.213/evaluation-service/notifications';

export const fetchNotifications = async (page = 1, limit = 10, type = '') => {
  try {
    const params = { page, limit };
    if (type) {
      params.notification_type = type;
    }
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error("API error fetching notifications:", error);
    throw error;
  }
};