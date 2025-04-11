import { Routes, Route, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import ItemCategory from "./pages/ItemCategory";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import ProductList from "./pages/seller/ProductList";
import AddProducts from "./pages/seller/AddProducts";
import Orders from "./pages/seller/Orders";
import Loading from "./components/Loading";

function App() {

  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext()

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">

      {isSellerPath ? null : <NavBar />}
      {showUserLogin ? <Login /> : null}


      <Toaster />

      <div className={`${isSellerPath ? " " : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ItemCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetail />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Loading />} />

          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />} >
            <Route index element={isSeller ? <AddProducts /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>

        </Routes>
      </div>


      {!isSellerPath &&
        <Footer />
      }


    </div>
  )
}

export default App
