import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { createContext, lazy, Suspense, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { RiCloseLine } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";
import { deleteData, fetchData, postData } from "./utils/api";

export const myContext = createContext();

const Home = lazy(() => import("./Pages/Home"));
const Productlisting = lazy(() => import("./Pages/Productlisting"));
const ProductDetails = lazy(() => import("./Component/Productdetails"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const Cart = lazy(() => import("./Component/Cart"));
const Emailverify = lazy(() => import("./Pages/verification"));
const Forgetpass = lazy(() => import("./Component/Forgetpass"));
const Checkout = lazy(() => import("./Pages/Checkout"));
const Myaccount = lazy(() => import("./Pages/Myaccount"));
const MyList = lazy(() => import("./Component/Mylist"));
const Orders = lazy(() => import("./Pages/Orders"));
const Address = lazy(() => import("./Pages/Myaccount/address"));
const Successorder = lazy(() => import("./Pages/Orders/successorder"));
const Failedorder = lazy(() => import("./Pages/Orders/failedorder"));
const SearchPage = lazy(() => import("./Pages/SearchPage"));
const HelpCenter = lazy(() => import("./Component/Otherpages/Helpcenter"));
const ContactUs = lazy(() => import("./Component/Otherpages/ContactUs"));
const AboutUs = lazy(() => import("./Component/Otherpages/Aboutus"));
const SecurePayments = lazy(() =>
  import("./Component/Otherpages/Securepayment")
);
const LegalNotice = lazy(() => import("./Component/Otherpages/legalnotice"));
const TermsAndConditions = lazy(() =>
  import("./Component/Otherpages/Termofuse")
);
const DeliveryInfo = lazy(() => import("./Component/Otherpages/Delivery"));
const BlogDetailsPage = lazy(() =>
  import("./Component/Otherpages/Blogdetails/blog.details")
);
const Productzoom = lazy(() => import("./Component/ProductZoom"));
const ProductModal = lazy(() => import("./Component/ProductModal"));

function App() {
  const [openProduct, setOpenProduct] = useState({ open: false, item: {} });
  const maxWidth = "lg";
  const [fullWidth] = useState(true);
  const [openCartPanel, setopenCartPanel] = useState(false);
  const [openaddressPanel, setopenaddressPanel] = useState(false);
  const [addressmode, setaddressmode] = useState("add");
  const [AddressId, setAddressId] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [islogin, setislogin] = useState(false);
  const [userData, setuserData] = useState(null);
  const [catData, setCatData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [Addedlist, setAddedlist] = useState(false);
  const [listData, setListData] = useState([]);

  const Alertbox = (status, msg) => {
    status === "success" ? toast.success(msg) : toast.error(msg);
  };

  // 🔹 Check login token on mount
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    setislogin(Boolean(token));
  }, []);

  // 🔹 Fetch categories only once on app load
  useEffect(() => {
    fetchData("/api/category/getcategory").then((res) => {
      console.log("Fetched category data:", res);
      setCatData(res.categories || []);
    });
    fetchData("/api/brand").then((res) => {
      if (res.error || !Array.isArray(res.brands)) {
        console.error(
          "Failed to load brands:",
          res.message || "Invalid response"
        );
        return;
      }
      setBrandData(res.brands);
    });
  }, []);

  // 🔹 When login is confirmed, fetch necessary data
  useEffect(() => {
    if (islogin) {
      getCart();
      getList();
      getuserDetails();
    }
  }, [islogin]);

  const getuserDetails = () => {
    fetchData(`/api/user/userdetails`)
      .then((res) => {
        if (res.error) throw res;
        setuserData(res.data);
      })
      .catch((err) => {
        const message = err?.message || err?.response?.data?.message;
        if (message === "You Are Not Logged In") {
          localStorage.removeItem("accesstoken");
          localStorage.removeItem("refreshToken");
          Alertbox("error", "Your session has expired");
          setislogin(false);
        } else {
          Alertbox("error", "An error occurred while fetching user data");
        }
      });
  };

  const toggleCartPanel = (newOpen) => () => {
    setopenCartPanel(newOpen);
  };

  const toggleaddressPanel = (newOpen) => () => {
    if (newOpen === false) {
      setaddressmode("add");
    }
    setopenaddressPanel(newOpen);
  };

  const handleClose = () => {
    setOpenProduct({ open: false, item: {} });
  };

  const handleOpen = (status, item) => {
    setOpenProduct({ open: status, item });
  };

  const AddtoCart = (product, userId, quantity) => {
    if (!userId) {
      Alertbox("error", "Please Login First");
      return;
    }

    const subTotal = Number(product.price) * Number(quantity);
    const Data = {
      ProductTitle: product.name,
      image: product?.images?.[0]?.url,
      productId: product._id,
      quantity: Number(quantity),
      price: Number(product.price),
      subTotal,
      countInStock: product.countInStock,
      rating: product.rating,
      userId,
      cartData,
      size: product.size,
      weight: product.productweight,
      ram: product.productRam,
    };

    postData("/api/cart/add", Data).then((res) => {
      res.error
        ? Alertbox("error", res.message)
        : (Alertbox("success", res.message), getCart());
    });
  };

  const getCart = () => {
    fetchData(`/api/cart/getCart`).then((res) => {
      res.error ? Alertbox("error", res.message) : setCartData(res.data);
    });
  };

  const handleWishlist = (item) => {
    if (!userData) {
      Alertbox("error", "Please Login First");
      return;
    }

    const existingItem = listData.find(
      (wishlistItem) => wishlistItem.productId === item._id
    );

    if (existingItem) {
      deleteData(`/api/mylist/delete/${existingItem._id}`).then((res) => {
        res.error
          ? Alertbox("error", res.message)
          : (Alertbox("success", "Removed from wishlist"), getList());
      });
    } else {
      const Data = {
        productId: item._id,
        userId: userData._id,
        image: item?.images?.[0]?.url,
        productTitle: item.name,
        price: item.price,
        rating: item.rating,
        oldprice: item.oldprice,
        brand: item.brand,
        discount: item.discount,
      };

      postData("/api/mylist/add", Data).then((res) => {
        res.error
          ? Alertbox("error", res.message)
          : (Alertbox("success", "Added to wishlist"), getList());
      });
    }
  };

  const isInWishlist = (productId) => {
    return listData.some((item) => item.productId === productId);
  };

  const getList = () => {
    fetchData(`/api/mylist/getList`).then((res) => {
      res.error ? Alertbox("error", res.message) : setListData(res.data);
    });
  };

  const values = {
    setOpenProduct,
    setopenCartPanel,
    openCartPanel,
    openaddressPanel,
    setopenaddressPanel,
    toggleaddressPanel,
    toggleCartPanel,
    handleOpen,
    handleClose,
    getuserDetails,
    addressmode,
    setaddressmode,
    AddressId,
    setAddressId,
    Alertbox,
    islogin,
    AddtoCart,
    setislogin,
    setuserData,
    userData,
    catData,
    setCatData,
    brandData,
    setBrandData,
    cartData,
    setCartData,
    getCart,
    handleWishlist,
    listData,
    setAddedlist,
    isInWishlist,
    Addedlist,
    setListData,
    getList,
    searchData,
    setSearchData,
  };

  return (
    <>
      <BrowserRouter>
        <myContext.Provider value={values}>
          <Header />
          <Suspense
            fallback={
              <main
                className="min-h-[60vh] bg-white px-4 py-8"
                aria-label="Loading page"
                aria-busy="true"
              >
                <div className="container mx-auto animate-pulse space-y-6">
                  <div className="h-8 w-40 rounded bg-gray-100" />
                  <div className="h-48 rounded-2xl bg-gray-100 sm:h-72" />
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[0, 1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="aspect-square rounded-xl bg-gray-100"
                      />
                    ))}
                  </div>
                </div>
              </main>
            }
          >
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/products" exact element={<Productlisting />} />
              <Route
                path="/productdetails/:id"
                exact
                element={<ProductDetails />}
              />
              <Route path="/Login" exact element={<Login />} />
              <Route path="/Register" exact element={<Register />} />
              <Route path="/Cart" exact element={<Cart />} />
              <Route path="/verify" exact element={<Emailverify />} />
              <Route path="/Resetpassword" exact element={<Forgetpass />} />
              <Route path="/checkout" exact element={<Checkout />} />
              <Route path="/myaccount" exact element={<Myaccount />} />
              <Route path="/mylist" exact element={<MyList />} />
              <Route path="/myorders" exact element={<Orders />} />
              <Route path="/orders/success" exact element={<Successorder />} />
              <Route path="/orders/failed" exact element={<Failedorder />} />
              <Route path="/address" exact element={<Address />} />
              <Route path="/search" exact element={<SearchPage />} />
              <Route path="/helpcenter" exact element={<HelpCenter />} />
              <Route path="/contactus" exact element={<ContactUs />} />
              <Route path="/Aboutus" exact element={<AboutUs />} />
              <Route path="/securepayment" exact element={<SecurePayments />} />
              <Route path="/legalnotice" exact element={<LegalNotice />} />
              <Route path="/terms" exact element={<TermsAndConditions />} />
              <Route path="/delivery" exact element={<DeliveryInfo />} />
              <Route path="/blog/:id" exact element={<BlogDetailsPage />} />
            </Routes>
          </Suspense>
          <Footer />

          <Dialog
            open={openProduct.open}
            onClose={handleClose}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            className="productdetailsmodal"
          >
            <DialogContent>
              <div className="flex items-center w-full productdetailsmodal container relative">
                <Button
                  onClick={handleClose}
                  className="!w-[40px] !h-[40px] !min-w-[40px] !text-[25px] !rounded-full !text-black !absolute top-[15px] right-[0px]"
                >
                  <RiCloseLine />
                </Button>
                {openProduct.item && (
                  <Suspense
                    fallback={<div className="p-8">Loading product...</div>}
                  >
                    <>
                      <div className="col-1 w-[40%] ">
                        <Productzoom images={openProduct.item?.images} />
                      </div>
                      <div className="col-2 w-[60%] py-2 px-6 pr-1">
                        <ProductModal item={openProduct.item} />
                      </div>
                    </>
                  </Suspense>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </myContext.Provider>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
