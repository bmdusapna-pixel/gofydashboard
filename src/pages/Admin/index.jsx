import { useState } from "react";

export default function AdminRBAC() {
  const [roles, setRoles] = useState([
    { id: 1, name: "Super Admin", twoFA: true, notifyOnLogin: true },
    { id: 2, name: "Finance Head", twoFA: true, notifyOnLogin: false },
    { id: 3, name: "Marketing Manager", twoFA: false, notifyOnLogin: false },
    { id: 4, name: "Order Processor", twoFA: false, notifyOnLogin: true },
    { id: 5, name: "Support Team", twoFA: false, notifyOnLogin: false },
  ]);

  const [users, setUsers] = useState([
    { id: 101, name: "Amit Sharma", roleId: 1, email: "amit.s@example.com" },
    { id: 102, name: "Riya Patel", roleId: 2, email: "riya.p@example.com" },
    { id: 103, name: "Karan Singh", roleId: 3, email: "karan.s@example.com" },
  ]);

  // Dynamic modules state
  const [modules, setModules] = useState([
    "inventory",
    "marketing",
    "orders",
    "support",
  ]);
  const [newModule, setNewModule] = useState("");

  const [permissions, setPermissions] = useState({
    1: { inventory: { view: true, add: true, edit: true, delete: true } },
    2: { inventory: { view: true, add: false, edit: true, delete: false } },
    3: { marketing: { view: true, add: true, edit: true, delete: false } },
    4: { orders: { view: true, add: true, edit: false, delete: false } },
    5: { support: { view: true, add: true, edit: false, delete: false } },
  });

  // States for adding
  const [newRole, setNewRole] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  const togglePermission = (roleId, module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [module]: {
          ...prev[roleId]?.[module],
          [action]: !prev[roleId]?.[module]?.[action],
        },
      },
    }));
  };

  const toggleSecurity = (roleId, key) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, [key]: !r[key] } : r))
    );
  };

  const addRole = () => {
    if (!newRole.trim()) return;
    const id = roles.length ? Math.max(...roles.map((r) => r.id)) + 1 : 1;

    setRoles((prevRoles) => [
      ...prevRoles,
      { id, name: newRole, twoFA: false, notifyOnLogin: false },
    ]);

    // Initialize permissions for the new role across all existing modules
    const newRolePermissions = {};
    modules.forEach((module) => {
      newRolePermissions[module] = {
        view: false,
        add: false,
        edit: false,
        delete: false,
      };
    });

    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [id]: newRolePermissions,
    }));

    setNewRole("");
  };

  const addModule = () => {
    if (!newModule.trim() || modules.includes(newModule.toLowerCase())) return;
    const newMod = newModule.toLowerCase();

    // Add the new module to the modules state
    setModules((prev) => [...prev, newMod]);

    // Update permissions for all existing roles to include the new module
    setPermissions((prev) => {
      const updatedPermissions = { ...prev };
      roles.forEach((role) => {
        updatedPermissions[role.id] = {
          ...updatedPermissions[role.id],
          [newMod]: {
            view: false,
            add: false,
            edit: false,
            delete: false,
          },
        };
      });
      return updatedPermissions;
    });
    setNewModule("");
  };

  const addUser = () => {
    if (
      !newUser.name.trim() ||
      !newUser.email.trim() ||
      !newUser.password.trim() ||
      !newUser.roleId
    )
      return;
    const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 101;
    setUsers([
      ...users,
      {
        id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        roleId: parseInt(newUser.roleId),
      },
    ]);
    setNewUser({ name: "", email: "", password: "", roleId: "" });
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    setEditingUser(null);
  };

  const updateUserRole = (userId, roleId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, roleId: parseInt(roleId) } : u
      )
    );
  };

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
                User
              </th>
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
                <td className="border border-gray-300 px-3 py-2">{u.name}</td>
                <td className="border border-gray-300 px-3 py-2">{u.email}</td>
                <td className="border border-gray-300 px-3 py-2">
                  <select
                    className="border border-gray-300 rounded p-1"
                    value={u.roleId}
                    onChange={(e) => updateUserRole(u.id, e.target.value)}
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
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
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="User Name"
            className="border border-gray-300 rounded p-2"
          />
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
            value={newUser.roleId}
            onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
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
            <h4 className="font-semibold">Edit User: {editingUser.name}</h4>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              placeholder="Name"
              className="border border-gray-300 rounded p-2 w-full"
            />
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
            <button
              onClick={handleUpdateUser}
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
                    {role.name}
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
