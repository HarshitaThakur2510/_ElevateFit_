import React from "react";
import DietConnector from "./components/DietConnector";
import Customer from "./components/Customer";
import Admin from "./components/Admin";
import Shopping from "./components/Shopping";

export default function App() {
  const path = window.location.pathname.toLowerCase();

  if (path.endsWith("diet.html")) {
    return <DietConnector />;
  }

  if (path.endsWith("customer.html")) {
    return <Customer />;
  }

  if (path.endsWith("admin.html")) {
    return <Admin />;
  }

  if (path.endsWith("shopping.html")) {
    return <Shopping />;
  }

  return null;
}
