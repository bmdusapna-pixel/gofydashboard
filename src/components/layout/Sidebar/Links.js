import {
  faHome,
  faBoxOpen,
  faTags,
  faShoppingCart,
  faUsers,
  faClipboardList,
  faFileInvoiceDollar,
  faLayerGroup,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

export const navItems = [
  { name: "Dashboard", icon: faHome, path: "/", type: "link" },
  {
    name: "Summary Dashboard",
    icon: faHome,
    path: "/summary-dashboard",
    type: "link",
  },
  {
    name: "Sales Dashboard",
    icon: faHome,
    path: "/sales-dashboard",
    type: "link",
  },
  {
    name: "Products",
    icon: faBoxOpen,
    type: "dropdown",
    path: "/products", // Base path for dropdown
    subItems: [
      { name: "All Products", path: "/products/list" },
      { name: "Add New", path: "/products/add-new" },
      // Removed Inventory from here
    ],
  },
  {
    name: "Categories",
    icon: faTags,
    type: "dropdown",
    path: "/categories", // Base path for dropdown
    subItems: [
      { name: "All Categories", path: "/categories/list" },
      { name: "Add New", path: "/categories/add-new" },
      { name: "Age Groups", path: "/age-groups" },
    ],
  },
  {
    name: "Collections",
    icon: faLayerGroup,
    type: "dropdown",
    path: "/collections", // Base path for dropdown
    subItems: [
      { name: "All Collections", path: "/collections/list" },
      { name: "Add Collection", path: "/collections/add-collection" },
    ],
  },
  {
    name: "Inventory", // New top-level item
    icon: faClipboardList, // Using a new icon for Inventory
    type: "dropdown",
    path: "/inventory", // Base path for Inventory dropdown
    subItems: [
      { name: "Received Orders", path: "/received" },
      { name: "Warehouse", path: "/inventory/warehouse" }, // Warehouse as a sub-item
    ],
  },
  {
    name: "Orders",
    icon: faShoppingCart,
    type: "dropdown",
    path: "/orders", // Base path for dropdown
    subItems: [{ name: "All Orders", path: "/orders" }],
  },
  {
    name: "Purchase",
    icon: faClipboardList,
    type: "dropdown",
    subItems: [
      {
        name: "List",
        path: "/purchase/list",
      },
      {
        name: "Order",
        path: "/purchase/order",
      },
      {
        name: "Return",
        path: "/purchase/return",
      },
    ],
  },
  {
    name: "Invoices",
    icon: faFileInvoiceDollar,
    path: "/invoices",
    type: "link",
  }, // Added Invoices
  {
    name: "Banners",
    icon: faFileInvoiceDollar,
    path: "/banners",
    type: "link",
  },
  {
    name: "Filter",
    icon: faPalette,
    subItems: [
      { name: "Color", path: "/color" },
      { name: "Material", path: "/material" },
    ],
    type: "dropdown",
  },
  { name: "Customers", icon: faUsers, path: "/customers", type: "link" },
];
