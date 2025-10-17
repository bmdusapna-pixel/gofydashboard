import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SalesDashboard from "./pages/SalesDashboard";
import SummaryDashboard from "./pages/SummaryDashboard";
import MainLayout from "./components/layout/MainLayout";
import ContentLayout from "./components/layout/ContentLayout";
import PrivateRoute from "./components/layout/PrivateRoute";
import { SidebarProvider } from "./hooks/toggleContext";
import "./App.css";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Warehouse from "./pages/Warehouse";
import Orders from "./pages/Orders";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/Customers/CustomerDetailsPage";
import Received from "./pages/Received";
import Login from "./pages/Login";
import PurchaseList from "./pages/Purchase/List";
import PurchaseOrder from "./pages/Purchase/Order";
import PurchaseReturn from "./pages/Purchase/Return";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProduct from "./pages/Products/AddProduct";
import ViewProduct from "./pages/Products/ViewProduct";
import EditProduct from "./pages/Products/EditProduct";
import AddCategory from "./pages/Categories/AddCategory";
import EditCategory from "./pages/Categories/EditCategory";
import Collections from "./pages/Collection";
import AddCollection from "./pages/Collection/AddCollection";
import AgeGroups from "./pages/AgeGroups";
import EditAgeGroup from "./pages/AgeGroups/EditAgeGroup";
import Banners from "./pages/Banner";
import DelayBanners from "./pages/Banner/BannerDashboard";
import Color from "./pages/Color";
import Material from "./pages/Material";
import AddEdit from "./pages/Banner/AddEdit";
import Settings from "./pages/Settings";
import Inventory from "./pages/Inventory";
import SeoAnalytics from "./pages/SeoAnalytics";
import AdminSettings from "./pages/Settings/AdminSettings";
import Admin from "./pages/Admin";
import ProductAnalytics from "./pages/Products/ProductAnalytics";
import ReferralDashboard from "./pages/ReferralDashboard";
import LoyaltyDashboard from "./pages/LoyaltyDashboard";
import UserTransactions from "./pages/LoyaltyDashboard/UserTransactions";
import Review from "./pages/Review";
import Activities from "./pages/Activities";
import NotificationDashboard from "./pages/NotificationDashboard";
import Notification from "./pages/NotificationDashboard/Notification";
import CartList from "./pages/Customers/CartList";
import CouponForm from "./pages/Coupon/CouponForm";
import Coupons from "./pages/Coupon";
import BulkOrders from "./pages/Orders/BulkOrders";
import CouponAnalytics from "./pages/Coupon/CouponAnalytics";
import Blogs from "./pages/Blogs";
import AddBlog from "./pages/Blogs/AddBlog";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <SidebarProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<PrivateRoute />}>
              <Route element={<ContentLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sales-dashboard" element={<SalesDashboard />} />
                <Route path="/" element={<SummaryDashboard />} />
                <Route path="/products/list" element={<Products />} />
                <Route path="/products/add-new" element={<AddProduct />} />
                <Route path="/products/view/:url" element={<ViewProduct />} />
                <Route path="/products/edit/:url" element={<EditProduct />} />
                <Route path="/categories/list" element={<Categories />} />
                <Route path="/categories/add-new" element={<AddCategory />} />
                <Route
                  path="/categories/edit/:categoryId"
                  element={<EditCategory />}
                />
                <Route path="/inventory/warehouse" element={<Warehouse />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/:id" element={<CustomerDetails />} />
                <Route path="/received" element={<Received />} />
                <Route path="/purchase/list" element={<PurchaseList />} />
                <Route path="/purchase/order" element={<PurchaseOrder />} />
                <Route path="/purchase/return" element={<PurchaseReturn />} />
                <Route path="/collections/list" element={<Collections />} />
                <Route path="/banners" element={<Banners />} />
                <Route path="/delay-banners" element={<DelayBanners />} />
                <Route path="/banner-add-edit" element={<AddEdit />} />
                <Route
                  path="/banner-add-edit/:bannerId"
                  element={<AddEdit />}
                />
                <Route path="/color" element={<Color />} />
                <Route path="/material" element={<Material />} />
                <Route
                  path="/collections/add-collection"
                  element={<AddCollection />}
                />
                <Route path="/age-groups" element={<AgeGroups />} />
                <Route
                  path="/age-groups/edit-age-group/:ageGroupId"
                  element={<EditAgeGroup />}
                />
                <Route path="/setting" element={<Settings />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/seo-analytics" element={<SeoAnalytics />} />
                <Route path="/admin-settings" element={<AdminSettings />} />
                <Route path="/admin" element={<Admin />} />
                <Route
                  path="/product-analytics"
                  element={<ProductAnalytics />}
                />
                <Route
                  path="/referral-dashboard"
                  element={<ReferralDashboard />}
                />
                <Route
                  path="/loyalty-dashboard"
                  element={<LoyaltyDashboard />}
                />
                <Route
                  path="/loyalty-dashboard/:customerId"
                  element={<UserTransactions />}
                />
                <Route path="/review" element={<Review />} />
                <Route path="/activities" element={<Activities />} />
                <Route
                  path="/notifications"
                  element={<NotificationDashboard />}
                />
                <Route path="/notification-logger" element={<Notification />} />
                <Route path="/cart-list" element={<CartList />} />
                <Route path="/coupon-form" element={<CouponForm />} />
                <Route
                  path="/coupon-form/:couponCode"
                  element={<CouponForm />}
                />
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/bulk-orders" element={<BulkOrders />} />
                <Route path="/coupon-analytics" element={<CouponAnalytics />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/add-new" element={<AddBlog />} />
              </Route>
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </SidebarProvider>
    </div>
  );
};

export default App;
