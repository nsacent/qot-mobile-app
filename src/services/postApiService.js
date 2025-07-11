// utils/apiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://qot.ug/api';
const APP_API_TOKEN = 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=';

/**
 * Get API headers with authorization token
 */
const getHeaders = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Language': 'en',
        'X-AppApiToken': APP_API_TOKEN,
        'X-AppType': 'mobile',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
    }
    return response.json();
};

/**
 * Listing Types API
 */
export const listingTypesService = {
    // Get all listing types
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/postTypes`, {
            headers: await getHeaders(),
        });
        return handleResponse(response);
    },

    // Get single listing type by ID
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/postTypes/${id}`, {
            headers: await getHeaders(),
        });
        return handleResponse(response);
    },
};

/**
 * Report Types API
 */
export const reportTypesService = {
    // Get all report types
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/reportTypes`, {
            headers: await getHeaders(),
        });
        return handleResponse(response);
    },

    // Get single report type by ID
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/reportTypes/${id}`, {
            headers: await getHeaders(),
        });
        return handleResponse(response);
    },
};

/**
 * Posts API
 */
export const postsService = {
    // Get all posts with filters
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add all provided parameters to the query
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value);
            }
        });

        // Always embed pictures by default if not specified
        if (!params.embed) {
            queryParams.append('embed', 'pictures');
        }

        const response = await fetch(`${API_BASE_URL}/posts?${queryParams.toString()}`, {
            headers: await getHeaders(),
        });
        return handleResponse(response);
    },

    // Get posts pending approval
    getPendingApproval: async (page = 1, perPage = 12) => {
        return postsService.getAll({
            pendingApproval: 1,
            belongLoggedUser: 1, // Assuming this is a filter to get posts belonging to the logged user
            page,
            perPage,
            embed: 'pictures',
        });
    },

    // Get archived posts
    getArchived: async (page = 1, perPage = 12) => {
        return postsService.getAll({
            belongLoggedUser: 1, // Assuming this is a filter to get posts belonging to the logged user
            archived: 1,
            page,
            perPage,
            embed: 'pictures',
        });
    },

    // Get single post by ID
    getById: async (id, embed = 'pictures') => {
        const response = await fetch(`${API_BASE_URL}/posts/${id}?embed=${embed}`, {
            headers: await getHeaders(),
        });
        return handleResponse(response);
    },

    // Create a new post
    create: async (postData, pictures = []) => {
        const formData = new FormData();

        // Append all post data
        Object.entries(postData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        // Append pictures
        pictures.forEach((picture, index) => {
            formData.append('pictures[]', {
                uri: picture.uri,
                type: picture.type || 'image/jpeg',
                name: `picture_${index}.jpg`,
            });
        });

        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                ...(await getHeaders()),
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });
        return handleResponse(response);
    },

    // Update a post
    update: async (id, postData, pictures = []) => {
        const formData = new FormData();

        // Append all post data
        Object.entries(postData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        // Append pictures if provided
        if (pictures.length > 0) {
            pictures.forEach((picture, index) => {
                formData.append('pictures[]', {
                    uri: picture.uri,
                    type: picture.type || 'image/jpeg',
                    name: `picture_${index}.jpg`,
                });
            });
        }

        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'PUT',
            headers: {
                ...(await getHeaders()),
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });
        return handleResponse(response);
    },

    // Delete post(s)
    delete: async (ids) => {
        const idList = Array.isArray(ids) ? ids.join(',') : ids;
        const response = await fetch(`${API_BASE_URL}/posts/${idList}`, {
            method: 'DELETE',
            headers: await getHeaders(),
        });
        return handleResponse(response);
    },

    // Archive post
    archive: async (id) => {
        return postsService.update(id, { archived: 1 });
    },

    // Unarchive post
    unarchive: async (id) => {
        return postsService.update(id, { archived: 0 });
    },
};

/**
 * Export all services
 */
export default {
    listingTypes: listingTypesService,
    reportTypes: reportTypesService,
    posts: postsService,
};