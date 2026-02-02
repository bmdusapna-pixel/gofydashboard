// Role-based sidebar access configuration
// Maps sidebar menu items to roles that can access them

export const roleBasedAccess = {
  // Super Admin has access to everything (handled separately)
  SuperAdmin: "*", // Special case - shows all items
  "Super Admin": "*", // Alternative format with space

  // Order Processor: Orders, Payments, Customers, Status Update
  "Order Processor": [
    "Dashboard",
    "Sales Dashboard",
    "Order History",
    "Payments",
    "Customers",
    "Invoices",
  ],

  // Inventory Executive: Products, Stock, Categories, Low Stock Alerts
  "Inventory Executive": [
    "Dashboard",
    "Sales Dashboard",
    "Products",
    "Categories",
    "Collections",
    "Filter",
    "Inventory",
  ],

  // Marketing Manager: Banners, Coupons, Flash Sales, Push Notifications, SEO
  "Marketing Manager": [
    "Dashboard",
    "Sales Dashboard",
    "Banners",
    "Coupons",
    "SEO Analytics",
    "Notifications",
  ],

  // Finance Head: Payments, Refunds, Reports, Payout Logs
  "Finance Head": [
    "Dashboard",
    "Sales Dashboard",
    "Payments",
    "Invoices",
  ],

  // Customer Support: Order tracking, Return/Exchange, Chats, Manual Refunds
  "Customer Support": [
    "Dashboard",
    "Sales Dashboard",
    "Order History",
    "Customers",
    "Payments",
  ],

  // Affiliate Manager: Affiliate/Referral Dashboard, Conversion Logs
  "Affiliate Manager": [
    "Dashboard",
    "Sales Dashboard",
    "Customers", // For Referral Dashboard sub-item
  ],
};

// Map sidebar item names to their display names (for matching)
const sidebarItemMapping = {
  "Dashboard": "Dashboard",
  "Sales Dashboard": "Sales Dashboard",
  "Products": "Products",
  "Categories": "Categories",
  "Collections": "Collections",
  "Filter": "Filter",
  "Inventory": "Inventory",
  "Loyalty Dashboard": "Loyalty Dashboard",
  "Order History": "Order History",
  "Invoices": "Invoices",
  "Banners": "Banners",
  "Coupons": "Coupons",
  "Customers": "Customers",
  "SEO Analytics": "SEO Analytics",
  "Notifications": "Notifications",
  "Review": "Review",
  "Blogs": "Blogs",
  "Payments": "Payments",
  "Admin": "Admin",
  "Settings": "Settings",
  "Profile": "Profile",
  "Logout": "Logout",
};

/**
 * Filters sidebar items based on user role
 * @param {Array} navItems - Original navigation items array
 * @param {String} role - User's role name
 * @returns {Array} - Filtered navigation items array
 */
export const filterSidebarByRole = (navItems, role) => {
  if (!role) {
    return [];
  }

  // Normalize role name (trim and handle case variations)
  const normalizedRole = role.trim();

  // SuperAdmin gets access to everything (check both formats)
  if (
    normalizedRole === "SuperAdmin" ||
    normalizedRole === "Super Admin" ||
    normalizedRole === "*"
  ) {
    return navItems;
  }

  // Get allowed menu items for this role
  const allowedItems = roleBasedAccess[normalizedRole] || [];

  // If role not found in config, return empty array (no access)
  if (!allowedItems || allowedItems.length === 0) {
    return [];
  }

  // Filter navItems based on allowed items
  const filteredItems = navItems
    .map((item) => {
      // Always show Logout
      if (item.name === "Logout") {
        return item;
      }

      // Check if this item is allowed
      const isAllowed = allowedItems.includes(item.name);

      if (!isAllowed) {
        return null; // Item not allowed
      }

      // For dropdown items, filter sub-items based on role-specific rules
      if (item.type === "dropdown" && item.subItems) {
        const filteredSubItems = filterSubItemsByRole(item, role);
        
        // If no sub-items remain, don't show the parent either
        if (filteredSubItems.length === 0) {
          return null;
        }

        return {
          ...item,
          subItems: filteredSubItems,
        };
      }

      return item;
    })
    .filter(Boolean); // Remove null items

  return filteredItems;
};

/**
 * Filters sub-items within a dropdown based on role
 * @param {Object} parentItem - Parent dropdown item
 * @param {String} role - User's role name
 * @returns {Array} - Filtered sub-items array
 */
const filterSubItemsByRole = (parentItem, role) => {
  const subItemAccessRules = {
    "Order Processor": {
      Customers: ["All Customers"], // Only show "All Customers", hide "Referral Dashboard"
    },
    "Inventory Executive": {
      Products: ["All Products", "Add New", "Product Analytics"],
      Categories: ["All Categories", "Add New", "Age Groups"],
      Collections: ["All Collections", "Add Collection"],
      Filter: ["Color", "Material"],
    },
    "Marketing Manager": {
      Banners: ["All Banners", "Delay Banners"],
      Coupons: ["All Coupons", "Add Coupon", "Coupon Analytics"],
      Notifications: ["Notifications", "Notification Logger"],
    },
    "Affiliate Manager": {
      Customers: ["Referral Dashboard"], // Only show "Referral Dashboard"
    },
  };

  const roleRules = subItemAccessRules[role];
  if (!roleRules || !roleRules[parentItem.name]) {
    // If no specific rules, show all sub-items (parent is already allowed)
    return parentItem.subItems || [];
  }

  const allowedSubItemNames = roleRules[parentItem.name];
  return (parentItem.subItems || []).filter((subItem) =>
    allowedSubItemNames.includes(subItem.name)
  );
};

