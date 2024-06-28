import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LoginForm from "./logincompantents/login/login/loginForm";
import Home from "./home/home"; // Örneğin, "Home" bileşeninin doğru şekilde içe aktarıldığından emin olun
import AuthProvider from "./provider/authProvider";
import SignUp from "./logincompantents/login/signUp/sign-up";
import ForgotPasswordForm from "./logincompantents/forgotPassword/forgotPassword";
import { SnackbarProvider } from "notistack";
import Profile from "./account/profile";
import Account from "./account/account";
import Category from "./categories/category";
import Cart from "./cart/cart.jsx";
import Favorites from "./AppBarColumns/favorites";
import CategoryRecords from "./admınRecords/categoryRecords.jsx"
import Unauthorized from "./unauthorized/unauthorized.jsx";
import ProductRecords from "./admınRecords/productRecords.jsx";
import ReactZoom from "./admınRecords/reactzoom.jsx";
import ProductsDetail from "./categories/ProductsDetail.jsx";
import Orders from "./account/orders.jsx";

function App() {
  useEffect(() => {
    document.title = "TeknoHane";
  }, []);

  return (
    <SnackbarProvider>
      <Router>
        <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Navigate to="/teknoHane" />} />
              <Route path="/teknoHane" element={<Home />} />
              <Route path="/giris" element={<LoginForm />} />
              <Route path="/uye-ol" element={<SignUp />}></Route>
              <Route
                path="/sifremi-unuttum"
                element={<ForgotPasswordForm />}
              ></Route>{" "}
              <Route path="/profil" element={<Profile />}></Route>
              <Route path="/hesap" element={<Account />}></Route>
              <Route path="/:categoryName/:id" element={<Category />}></Route>
              <Route path="/sepetim" element={<Cart/>}> </Route>
              <Route path="/favorilerim" element={<Favorites/>}></Route>
              <Route path="/admin-records" element={<CategoryRecords/>}></Route>
              <Route path="/unauthorized" element={<Unauthorized/>}></Route>
              <Route path="/admin-records/products/:id" element={<ProductRecords />} />
              <Route path="/:categoryName/:id/:productId" element={<ProductsDetail />} />
              <Route path="/hesap/siparişlerim" element={<Orders/>}></Route>
              <Route path="/siparişlerim" element={<Orders/>}></Route>
              <Route path="/react-zoom" element={<ReactZoom/>}></Route>
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
