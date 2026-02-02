import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function AdminRBAC() {
  const token = sessionStorage.getItem("adminToken");

  /* ================= STATES ================= */

  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [dirtyRoles, setDirtyRoles] = useState({}); // roleId -> boolean (has unsaved permission changes)
  const [savingRoles, setSavingRoles] = useState({}); // roleId -> boolean (save in progress)

  const [users, setUsers] = useState([]);
  const [newModule, setNewModule] = useState("");
  const [newRole, setNewRole] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "",
  });

  /* ================= FETCH ================= */

  const fetchRoles = async () => {
    try {
      const res = await api.get("/auth/role", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setRoles(
        res.data.map((r) => ({
          id: r._id,
          name: r.name,
          twoFA: r.twoFA,
          notifyOnLogin: r.notifyOnLogin,
        }))
      );
  
      const perms = {};
      res.data.forEach((r) => {
        perms[r._id] = r.permissions || {};
      });
      setPermissions(perms);
    } 
    catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
    }
  
  };

  const fetchModules = async () => {
    const res = await api.get("/auth/module", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res.data)
    setModules(res.data.map((m) => m.name));
  };

  const fetchUsers = async () => {
    const res = await api.get("/auth", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("users",res.data)
    setUsers(res.data);
  }

  useEffect(() => {
    fetchRoles();
    fetchModules();
    fetchUsers();
  }, []);

  /* ================= PERMISSION TOGGLE ================= */

  const togglePermission = async (roleId, module, action) => {
    console.log(roleId, module, action)
      const updated = {
        ...permissions,
        [roleId]: {
          ...permissions[roleId],
          [module]: {
            ...permissions[roleId]?.[module],
            [action]: !permissions[roleId]?.[module]?.[action],
          },
        },
      };
  
      setPermissions(updated);
      setDirtyRoles((prev) => ({ ...prev, [roleId]: true }));
  };

  console.log(permissions)

  const handleUpdateRolePermissions = async (roleId, permissions) => {
    try {
      await api.put(
        `/auth/role/${roleId}`,
        { permissions: permissions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Permissions updated");
    }
    catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
      throw error;
    }
  }

  const saveRolePermissions = async (roleId) => {
    try {
      setSavingRoles((prev) => ({ ...prev, [roleId]: true }));
      await handleUpdateRolePermissions(roleId, permissions?.[roleId] || {});
      setDirtyRoles((prev) => ({ ...prev, [roleId]: false }));
    } finally {
      setSavingRoles((prev) => ({ ...prev, [roleId]: false }));
    }
  };
  /* ================= SECURITY TOGGLES ================= */

  const toggleSecurity = (roleId, key) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, [key]: !r[key] } : r))
    );
  };

  /* ================= ADD ROLE ================= */

  const addRole = async () => {
    try {
      if (!newRole.trim()) return;

      await api.post(
        "/auth/role",
        { name: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setNewRole("");
      fetchRoles(); 
    } 
    catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
    }

  };

  /* ================= ADD MODULE ================= */

  const addModule = async () => {
    try {
      if (!newModule.trim()) return;

      await api.post(
        "/auth/module",
        { name: newModule.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setNewModule("");
      fetchModules();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
    }
  };

  const addUser = async () => {
    try {
      console.log(newUser)
      await api.post(
        "/auth/register",
        { email: newUser.email, password: newUser.password, roleName: newUser.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setNewUser("");
      fetchUsers();
    } 
    catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
    }

  };

  /* ================= USER HELPERS (UI SAME) ================= */

  const handleEditUser = (u) => setEditingUser(u);

  const handleUpdateUser = async (id) => {
    try {
      console.log(editingUser)
      await api.put(`/auth/user/${id}`, { email: editingUser.email, password: editingUser.password, roleName: editingUser.role }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("User updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/auth/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
    }
  }

  const handledletemodule = async (moduleId) => {
    try {
      await api.delete(`/auth/module/${moduleId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Module deleted successfully");
      fetchModules();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
    }
  }
  return (
    <div className="p-4 flex-1 overflow-y-auto space-y-8">
      <h2 className="sm:text-xl text-lg font-semibold">
        Role-Based Access Control (RBAC)
      </h2>
      {/* Roles and Modules Management */}
      <div className="flex gap-4">
        {/* Roles List */}
        <div className="bg-white rounded-xl shadow border border-gray-300 p-5 space-y-4 flex-1">
          <h3 className="text-lg font-semibold">Available Roles</h3>
          <ul className="space-y-2">
            {roles.map((role) => (
              <li
                key={role.id}
                className="flex justify-between items-center border border-gray-300 rounded-lg p-3"
              >
                <span>{role.name}</span>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={role.twoFA}
                      onChange={() => toggleSecurity(role.id, "twoFA")}
                    />
                    2FA
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={role.notifyOnLogin}
                      onChange={() => toggleSecurity(role.id, "notifyOnLogin")}
                    />
                    Notify on Login
                  </label>
                </div>
              </li>
            ))}
          </ul>
          {/* Add Role Form */}
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="New Role Name"
              className="border border-gray-300 rounded p-2 flex-1"
            />
            <button
              onClick={addRole}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              Add Role
            </button>
          </div>
        </div>

        {/* Add Module Section */}
        <div className="bg-white rounded-xl shadow border border-gray-300 p-5 space-y-4 flex-1">
          <h3 className="text-lg font-semibold">Available Modules</h3>
          <ul className="space-y-2">
            {modules.map((moduleName, index) => (
              <li
                key={index}
                className="border border-gray-300 rounded-lg p-3 capitalize"
              >
                {moduleName}
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newModule}
              onChange={(e) => setNewModule(e.target.value)}
              placeholder="New Module Name"
              className="border border-gray-300 rounded p-2 flex-1"
            />
            <button
              onClick={addModule}
              className="bg-purple-600 text-white px-3 py-2 rounded"
            >
              Add Module
            </button>
          </div>
        </div>
      </div>

      {/* User Management and Assign Roles */}
      <div className="bg-white rounded-xl shadow border border-gray-300 p-5 space-y-4">
        <h3 className="text-lg font-semibold">User Management</h3>

        {/* User List Table */}
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              
              <th className="border border-gray-300 px-3 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Role
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border border-gray-300 px-3 py-2">{u.email}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {u.role.name}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <button
                    onClick={() => handleEditUser(u)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add User Form */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="User Email"
            className="border border-gray-300 rounded p-2"
          />
          <input
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            placeholder="Password"
            className="border border-gray-300 rounded p-2"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
          <button
            onClick={addUser}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Add User
          </button>
        </div>

        {/* Edit User Modal/Form */}
        {editingUser && (
          <div className="mt-4 p-4 border border-gray-400 rounded-lg bg-gray-50 space-y-2">
            <h4 className="font-semibold">Edit User</h4>
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              placeholder="Email"
              className="border border-gray-300 rounded p-2 w-full"
            />
            <input
              type="password"
              value={editingUser.password}
              onChange={(e) =>
                setEditingUser({ ...editingUser, password: e.target.value })
              }
              placeholder="Password"
              className="border border-gray-300 rounded p-2 w-full"
            />
            <select
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleUpdateUser(editingUser._id)}
              className="bg-purple-600 text-white px-3 py-2 rounded mr-2"
            >
              Update User
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="bg-gray-500 text-white px-3 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl shadow border border-gray-300 p-5">
        <h3 className="text-lg font-semibold mb-4">Permissions</h3>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2">Role</th>
                {modules.map((moduleName) => (
                  <th
                    key={moduleName}
                    colSpan="4"
                    className="border border-gray-300 px-3 py-2 text-center"
                  >
                    {moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="border border-gray-300 px-3 py-2"></th>
                {modules.map((moduleName) => (
                  <>
                    <th
                      key={`${moduleName}-view`}
                      className="border border-gray-300 px-1 py-2 text-center"
                    >
                      View
                    </th>
                    <th
                      key={`${moduleName}-add`}
                      className="border border-gray-300 px-1 py-2 text-center"
                    >
                      Add
                    </th>
                    <th
                      key={`${moduleName}-edit`}
                      className="border border-gray-300 px-1 py-2 text-center"
                    >
                      Edit
                    </th>
                    <th
                      key={`${moduleName}-delete`}
                      className="border border-gray-300 px-1 py-2 text-center"
                    >
                      Delete
                    </th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="border border-gray-300 px-3 py-2 font-semibold">
                    <div className="flex items-center justify-between gap-3">
                      <span>{role.name}</span>
                      <button
                        type="button"
                        onClick={() => saveRolePermissions(role.id)}
                        disabled={!dirtyRoles?.[role.id] || savingRoles?.[role.id]}
                        className={`px-3 py-1 rounded text-xs font-medium border ${
                          !dirtyRoles?.[role.id] || savingRoles?.[role.id]
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                        }`}
                        title={
                          dirtyRoles?.[role.id]
                            ? "Save permission changes"
                            : "No changes to save"
                        }
                      >
                        {savingRoles?.[role.id] ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </td>
                  {modules.map((module) => (
                    <>
                      {["view", "add", "edit", "delete"].map((action) => (
                        <td
                          key={`${role.id}-${module}-${action}`}
                          className="border border-gray-300 px-3 py-2 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={
                              permissions[role.id]?.[module]?.[action] || false
                            }
                            onChange={() =>
                              togglePermission(role.id, module, action)
                            }

                          />
                        </td>
                      ))}
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
