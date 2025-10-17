import apiClient from "./authService";

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

/**
 * Fetches the 10 most recent bank transactions from the API.
 */
export const getRecentBankTransactions = async () => {
  try {
    const response = await apiClient.get(`/payment/transactions`);
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching recent bank transactions:", error);
    throw error;
  }
};

/**
 * Saves a processed bank transaction to your application's database.
 */
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
