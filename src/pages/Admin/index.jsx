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
    { id: 101, name: "Amit Sharma", roleId: 1 },
    { id: 102, name: "Riya Patel", roleId: 2 },
    { id: 103, name: "Karan Singh", roleId: 3 },
  ]);

  const [permissions, setPermissions] = useState({
    1: { inventory: { view: true, add: true, edit: true, delete: true } },
    2: { inventory: { view: true, add: false, edit: true, delete: false } },
    3: { marketing: { view: true, add: true, edit: true, delete: false } },
    4: { orders: { view: true, add: true, edit: false, delete: false } },
    5: { support: { view: true, add: true, edit: false, delete: false } },
  });

  // States for adding
  const [newRole, setNewRole] = useState("");
  const [newUser, setNewUser] = useState({ name: "", roleId: "" });

  const togglePermission = (roleId, module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [module]: {
          ...prev[roleId][module],
          [action]: !prev[roleId][module][action],
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
    setRoles([
      ...roles,
      { id, name: newRole, twoFA: false, notifyOnLogin: false },
    ]);
    setNewRole("");
  };

  const addUser = () => {
    if (!newUser.name.trim() || !newUser.roleId) return;
    const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 101;
    setUsers([
      ...users,
      { id, name: newUser.name, roleId: parseInt(newUser.roleId) },
    ]);
    setNewUser({ name: "", roleId: "" });
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

      {/* Roles List */}
      <div className="bg-white rounded-xl shadow border border-gray-300 p-5 space-y-4">
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

      {/* Assign Roles */}
      <div className="bg-white rounded-xl shadow border border-gray-300 p-5 space-y-4">
        <h3 className="text-lg font-semibold">Assign Roles to Users</h3>

        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left">
                User
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border border-gray-300 px-3 py-2">{u.name}</td>
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
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add User Form */}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="New User Name"
            className="border border-gray-300 rounded p-2 flex-1"
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
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl shadow border border-gray-300 p-5">
        <h3 className="text-lg font-semibold mb-4">Permissions</h3>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2">Role</th>
              <th className="border border-gray-300 px-3 py-2">Module</th>
              <th className="border border-gray-300 px-3 py-2">View</th>
              <th className="border border-gray-300 px-3 py-2">Add</th>
              <th className="border border-gray-300 px-3 py-2">Edit</th>
              <th className="border border-gray-300 px-3 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(permissions).map(([roleId, modules]) =>
              Object.entries(modules).map(([module, actions]) => (
                <tr key={roleId + module}>
                  <td className="border border-gray-300 px-3 py-2">
                    {roles.find((r) => r.id === parseInt(roleId))?.name}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 capitalize">
                    {module}
                  </td>
                  {["view", "add", "edit", "delete"].map((action) => (
                    <td
                      key={action}
                      className="border border-gray-300 px-3 py-2 text-center"
                    >
                      <input
                        type="checkbox"
                        checked={actions[action]}
                        onChange={() =>
                          togglePermission(parseInt(roleId), module, action)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
