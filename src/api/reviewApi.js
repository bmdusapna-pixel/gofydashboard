import api from "./axios";

export const getReviewsApi = async (productId) => {
  const res = await api.get(`/reviews?productId=${productId}`);
  return res.data;
};

export const postReviewApi = async (reviewData) => {
  const res = await api.post("/reviews", reviewData);
  return res.data;
};
export const deleteReviewApi = async (reviewId) => {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
}