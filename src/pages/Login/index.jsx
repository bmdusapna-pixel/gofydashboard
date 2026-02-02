import React, { useState } from "react";
import Logo from "../../assets/images/logo.png";
import { loginApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginApi(form);
      sessionStorage.setItem("adminToken", data.token);
      // Store role and permissions for sidebar filtering
      if (data.admin) {
        sessionStorage.setItem("adminRole", data.admin.role);
        sessionStorage.setItem("adminPermissions", JSON.stringify(data.admin.permissions || {}));
      }
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="bg-login min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full login-container rounded-xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header with Company Logo */}
        <div className="admin-header p-6 text-center relative border-b border-gray-200">
          <div className="mx-auto w-40 h-16 mb-4 flex items-center justify-center">
            {/* Replace with your actual logo */}
            <img
              src={Logo}
              alt="Company Logo"
              className="h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Admin Portal</h1>
          <p className="text-gray-600 text-sm mt-1">
            Children's E-Commerce Dashboard
          </p>
        </div>
        {/* Login Form */}
        <div className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-xs text-primary-600 hover:text-primary-500"
              >
                Forgot password?
              </a>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Sign In to Dashboard
              </button>
            </div>
          </form>
          <div className="mt-5 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 inline mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Restricted access to authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
