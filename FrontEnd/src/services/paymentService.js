import apiClient from "./authService";

/**
 * Gọi API backend để tạo link thanh toán PayOS.
 * @param {object} paymentData - Dữ liệu thanh toán gồm { description, price, courseIds, cancelUrl? }.
 */
export const createPayOSLink = async (paymentData) => {
  try {
    const response = await apiClient.post(`/payment/create-link`, paymentData, {
      withCredentials: true, // Giữ lại nếu bạn dùng session/cookie để xác thực
    });
    return response.data; // Trả về { message, checkoutUrl }
  } catch (error) {
    throw error.response?.data || new Error("Không thể tạo link thanh toán.");
  }
};

/**
 * Kiểm tra trạng thái của một giao dịch từ backend bằng orderCode.
 * @param {string} orderCode - Mã đơn hàng.
 */
export const checkPaymentStatus = async (orderCode) => {
  try {
    const response = await apiClient.get(`/payment/status/${orderCode}`);
    return response.data; // Trả về { status }
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Không thể kiểm tra trạng thái đơn hàng.")
    );
  }
};

/**
 * Yêu cầu backend hủy một đơn hàng đang chờ xử lý.
 * @param {string} orderCode - Mã đơn hàng.
 */
export const cancelPaymentOrder = async (orderCode) => {
  try {
    const response = await apiClient.put(`/payment/cancel/${orderCode}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Không thể hủy đơn hàng.");
  }
};

export const saveTransactionToDB = async (
  bankTransaction,
  currentUser,
  courseIdArray
) => {
  if (!currentUser?._id) {
    throw new Error("Cannot save transaction without a valid user ID.");
  }

  try {
    const transactionDate = new Date(
      bankTransaction["Ngày diễn ra"]
    ).toISOString();

    const payload = {
      userId: currentUser._id,
      paymentId: createCustomPaymentId(bankTransaction["Mã GD"]),
      gatewayTransactionId: generateGatewayId(),
      type: "sale",
      amount: Number(bankTransaction["Giá trị"]),
      currency: "VND",
      createdAt: transactionDate,
      updatedAt: transactionDate,
      description: bankTransaction["Mô tả"],
      courseId: courseIdArray || [],
    };

    console.log("Saving transaction payload:", payload);

    const response = await apiClient.post("/payment/transactions", payload);
    return response.data;
  } catch (error) {
    console.error("Error saving transaction to DB:", error);
    // Axios stores error response in error.response
    const message =
      error.response?.data?.message ||
      "Failed to save transaction to the database";
    throw new Error(message);
  }
};

const generateGatewayId = () => {
  return [...Array(24)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
};

const createCustomPaymentId = (bankTransactionId) => {
  const idString = String(bankTransactionId);
  const requiredLength = 24;
  if (idString.length >= requiredLength) {
    return idString.substring(0, requiredLength);
  }
  const paddingLength = requiredLength - idString.length;
  const randomPadding = [...Array(paddingLength)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
  return idString + randomPadding;
};
