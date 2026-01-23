import { Mail, Shield, Calendar } from "lucide-react";
import api from "../../api/axios";
import { useEffect, useState } from "react";

export default function AdminProfile() {
  const [data, setdata] = useState(null);
  const token = localStorage.getItem("admintoken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          console.log("No token found");
          return;
        }

        const response = await api.get("auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API RESPONSE 👉", response.data);
        setdata(response.data.admin);
      } catch (error) {
        console.log("API ERROR 👉", error.response || error);
      }
    };

    fetchProfile();
  }, [token]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg">
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-20 w-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-semibold mb-3">
              {data.email?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">Admin Profile</h2>
            <p className="text-sm text-gray-500">System Administrator</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{data.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Admin ID</p>
                <p className="text-sm font-medium break-all">{data._id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Created On</p>
                <p className="text-sm font-medium">
                  {new Date(data.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
