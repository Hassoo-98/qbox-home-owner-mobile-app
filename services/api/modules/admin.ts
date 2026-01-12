import api from '../config';

export const systemCheck = async () => {
    const response = await api.get('/api/health');
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
};

export const getUserList = async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
};

export const deleteUser = async (userId: string) => {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
};
