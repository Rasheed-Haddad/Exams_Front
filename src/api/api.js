import axios from "axios";

// إنشاء instance مركزي
const api = axios.create({
  baseURL: "https://exams-back.onrender.com",
});

// إضافة interceptor لكل طلب لإضافة التوكن تلقائياً
api.interceptors.request.use(
  (config) => {
    const publicRoutes = ["/signin", "/info"];
    if (!publicRoutes.includes(config.url)) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// interceptor للردود للتعامل مع انتهاء صلاحية التوكن
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
