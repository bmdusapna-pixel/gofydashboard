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

const App = () => {
  return (
    <div>
      <SidebarProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<ContentLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/inventory/warehouse" element={<Warehouse />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/received" element={<Received />} />
              <Route path="/purchase/list" element={<PurchaseList />} />
              <Route path="/purchase/order" element={<PurchaseOrder />} />
              <Route path="/purchase/return" element={<PurchaseReturn />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </SidebarProvider>
    </div>
  );
};

export default App;
