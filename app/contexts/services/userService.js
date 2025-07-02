import axios from 'axios';

const API_BASE_URL = 'https://qot.ug/api';
const X_APP_API_TOKEN = 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY='; // Replace if needed

export const fetchUserData = async (userId, userToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-AppApiToken': X_APP_API_TOKEN,
      },
    });
    // You can log or return the result
        console.log('USERDATA',response.data.result);

    return response.data.result;
  } catch (error) {
    console.error('❌ Failed to fetch user data:', error.message);
    throw error; // optional: re-throw so caller can handle
  }
};


export const fetchPostData = async (postId, userToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-AppApiToken': X_APP_API_TOKEN,
      },
    });
    // You can log or return the result
        //console.log('ADsDATA',response.data.result);

    return response.data.result;
  } catch (error) {
    console.error('❌ Failed to fetch user data:', error.message);
    throw error; // optional: re-throw so caller can handle
  }
};