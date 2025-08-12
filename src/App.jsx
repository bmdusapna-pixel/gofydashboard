import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/layout/MainLayout";
import ContentLayout from "./components/layout/ContentLayout";
import { SidebarProvider } from "./hooks/toggleContext";
import "./App.css";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Warehouse from "./pages/Warehouse";
import Orders from "./pages/Orders";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
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
import Collections from "./pages/Collection";
import AddCollection from "./pages/Collection/AddCollection";
import AgeGroups from "./pages/AgeGroups";
import EditAgeGroup from "./pages/AgeGroups/EditAgeGroup";
import Banners from "./pages/Banner";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <SidebarProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<ContentLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products/list" element={<Products />} />
              <Route path="/products/add-new" element={<AddProduct />} />
              <Route path="/products/view/:url" element={<ViewProduct />} />
              <Route path="/products/edit/:url" element={<EditProduct />} />
              <Route path="/categories/list" element={<Categories />} />
              <Route path="/categories/add-new" element={<AddCategory />} />
              <Route path="/inventory/warehouse" element={<Warehouse />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/received" element={<Received />} />
              <Route path="/purchase/list" element={<PurchaseList />} />
              <Route path="/purchase/order" element={<PurchaseOrder />} />
              <Route path="/purchase/return" element={<PurchaseReturn />} />
              <Route path="/collections/list" element={<Collections />} />
              <Route path="/banners" element={<Banners />} />
              <Route
                path="/collections/add-collection"
                element={<AddCollection />}
              />
              <Route path="/age-groups" element={<AgeGroups />} />
              <Route
                path="/age-groups/edit-age-group"
                element={<EditAgeGroup />}
              />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </SidebarProvider>
    </div>
  );
};

export default App;
