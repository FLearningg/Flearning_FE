import apiClient from "./authService";

// Lấy danh sách yêu cầu rút tiền của instructor (có thể lọc theo params)
export const getInstructorWithdrawals = (params) => {
  // params có thể là { status: 'pending' }
  return apiClient.get("/withdrawals", { params });
};

// Tạo một yêu cầu rút tiền mới
export const createWithdrawalRequest = (data) => {
  // data có dạng { amount: 50000 }
  return apiClient.post("/withdrawals", data);
};

// Cập nhật một yêu cầu rút tiền (dùng để 'cancel')
export const updateWithdrawalRequest = (id, data) => {
  // data có dạng { status: 'cancelled' }
  return apiClient.put(`/withdrawals/${id}`, data);
};
