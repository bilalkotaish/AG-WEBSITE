import DashboardBox from "../../Components/DashboardBoxs";
import { MdWavingHand } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import { Link } from "react-router-dom";
import { Button, CircularProgress, Rating } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Checkbox from "@mui/material/Checkbox";
import ProgressBar from "../../Components/ProgressBar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Pagination from "@mui/material/Pagination";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { BiExport } from "react-icons/bi";
import { AiTwotoneEdit } from "react-icons/ai";
import { useContext } from "react";
import { Mycontext } from "../../App";
import Product from "../Products";
import { deleteData, deleteMultiple, fetchData } from "../../utils/api";
import Searchbox from "../../Components/Searchbox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoMdEye } from "react-icons/io";
import StatusBadge from "../../Components/Badge";

export default function Dashboard() {
  const [openPopupIndex, setOpenPopupIndex] = useState(null);
  const context = useContext(Mycontext);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [Cat, setCat] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [subCat, setsubCat] = useState("");
  const [thirdsubCat, setthirdsubCat] = useState("");
  const [product, setProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [perPage, setPerPage] = useState(1);
  const [Sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryfilter, setcategoryfilter] = useState("");
  const [currentPage1, setCurrentPage1] = useState(1);
  const [perPage1, setPerPage1] = useState(10);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productcount, setProductcount] = useState([]);

  const totalPages1 = Math.ceil(orderData?.length / perPage1);
  const { totalRevenue, totalSales, topSellingProducts } = useMemo(() => {
    let revenue = 0;
    let sales = 0;
    const productsById = new Map();

    orderData.forEach((order) => {
      if (
        ["cancelled", "canceled"].includes(order.orderStatus?.toLowerCase())
      ) {
        return;
      }

      const orderTotal = Number(order.Total);
      if (Number.isFinite(orderTotal)) {
        revenue += orderTotal;
      }

      order.products?.forEach((item) => {
        const quantity = Number(item.quantity);
        if (!Number.isFinite(quantity) || quantity <= 0) {
          return;
        }

        sales += quantity;
        const product =
          item.productId && typeof item.productId === "object"
            ? item.productId
            : null;
        const name =
          product?.name || item.productTitle?.name || "Unknown product";
        const key = String(product?._id || item.productId || name);
        const itemRevenue = Number(item.SubTotal);
        const lineRevenue = Number.isFinite(itemRevenue)
          ? itemRevenue
          : Number(item.price) * quantity;
        const existing = productsById.get(key) || {
          id: key,
          name,
          quantity: 0,
          revenue: 0,
        };

        existing.quantity += quantity;
        existing.revenue += Number.isFinite(lineRevenue) ? lineRevenue : 0;
        productsById.set(key, existing);
      });
    });

    const topProducts = Array.from(productsById.values())
      .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalRevenue: revenue,
      totalSales: sales,
      topSellingProducts: topProducts,
    };
  }, [orderData]);

  const formatCurrency = (amount) =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const chartdata = useMemo(() => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentYear = new Date().getFullYear();
    const monthlyData = months.map((name) => ({
      name,
      revenue: 0,
      sales: 0,
    }));

    orderData.forEach((order) => {
      if (
        ["cancelled", "canceled"].includes(order.orderStatus?.toLowerCase())
      ) {
        return;
      }

      const orderDate = new Date(order.createdAt);
      if (
        Number.isNaN(orderDate.getTime()) ||
        orderDate.getFullYear() !== currentYear
      ) {
        return;
      }

      const month = monthlyData[orderDate.getMonth()];
      const orderRevenue = Number(order.Total);
      if (Number.isFinite(orderRevenue)) {
        month.revenue += orderRevenue;
      }
      order.products?.forEach((item) => {
        const quantity = Number(item.quantity);
        if (Number.isFinite(quantity) && quantity > 0) {
          month.sales += quantity;
        }
      });
    });

    return monthlyData;
  }, [orderData]);

  // Handlers
  const handlePageChange1 = (event, value) => {
    setCurrentPage1(value);
  };

  const handleLimitChange1 = (event) => {
    setPerPage1(event.target.value);
    setCurrentPage1(1); // Reset to first page when limit changes
  };

  // Slice data
  const paginatedData1 = orderData?.slice(
    (currentPage1 - 1) * perPage1,
    currentPage1 * perPage1,
  );

  const handleChangeCatFilter = (event) => {
    setcategoryfilter(event.target.value);
  };
  useEffect(() => {
    // getTotalSales();
    const getOrderData = async () => {
      const res = await fetchData(`/api/orders/get`);
      if (res.error) {
        context.Alertbox("error", res.message);
      } else {
        setOrderData(res.data);
        console.log("Order Data:", res.data);
      }
    };

    getOrderData();
  }, [context.Alertbox, context.userData?._id]);

  useEffect(() => {
    fetchData(`/api/user/getallusers`)
      .then((res) => {
        if (res.error) {
          context.Alertbox("error", res.message);
        } else {
          setUsers(res.users);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });

    fetchData(`/api/user/getallreviews`)
      .then((res) => {
        if (res.error) {
          context.Alertbox("error", res.message);
        } else {
          setReviews(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch reviews:", err);
      });

    fetchData(`/api/product/productsCount`)
      .then((res) => {
        if (res.error) {
          context.Alertbox("error", res.message);
        } else {
          console.log("Product Count:", res.data);
          setProductcount(res.ProductCount);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch productcount:", err);
      });
  }, []);

  const handleTogglePopup = (index) => {
    if (openPopupIndex === index) {
      setOpenPopupIndex(null);
    } else {
      setOpenPopupIndex(index);
    }
  };

  const handleChange = (event) => {
    const selectedCat = event.target.value;
    setCat(selectedCat);
    setsubCat("");
    setthirdsubCat("");
    setLoading(true);

    fetchData(`/api/product/products/${selectedCat}`)
      .then((res) => {
        const safeData = Array.isArray(res?.data) ? res.data : [];
        setProduct(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProduct([]); // fallback to empty list
        setLoading(false);
      });
  };

  const handleChangesub = (event) => {
    setsubCat(event.target.value);
    setthirdsubCat("");
    setCat("");

    setLoading(true);

    fetchData(`/api/product/productSub/${event.target.value}`)
      .then((res) => {
        const safeData = Array.isArray(res?.data) ? res.data : [];
        setProduct(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProduct([]); // fallback to empty list
        setLoading(false);
      });
  };

  const handleChangethirdsub = (event) => {
    setsubCat("");
    setCat("");
    setLoading(true);
    setthirdsubCat(event.target.value);
    fetchData(`/api/product/productthirdSub/${event.target.value}`)
      .then((res) => {
        const safeData = Array.isArray(res?.data) ? res.data : [];
        setProduct(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
        setProduct([]); // fallback to empty list
      });
  };

  useEffect(() => {
    fetchData("/api/product/products").then((res) => {
      console.log("Fetched Product data:", res);
      if (res.error === false) {
        setProduct(res.data);
      }
    });
  }, []);
  const getProducts = (page = 1, limit = perPage) => {
    setLoading(true);
    fetchData(`/api/product/products?page=${page}&perpage=${limit}`).then(
      (res) => {
        let productArr = [];
        if (res.error === false) {
          for (let i = 0; i < res.data?.length; i++) {
            productArr[i] = res.data[i];
            productArr[i].checked = false;
          }
          console.log("Fetched Product data:", productArr);
          setProduct(productArr);
          setTotalPages(res.totalPages);
          setCurrentPage(res.currentPage);
          setLoading(false);
        } else {
          setLoading(false);
          context.Alertbox("error", res.message || "Failed to fetch products");
        }
      },
    );
  };
  const deleteMultiple = () => {
    if (Sorting.length > 0) {
      deleteMultiple("/api/product/deleteMultiple", {
        ids: Sorting,
      })
        .then((res) => {
          console.log("Deleting IDs:", Sorting);
          if (res.error === false) {
            context.Alertbox("success", "Product Deleted Successfully");
            getProducts();
          } else {
            context.Alertbox(
              "error",
              res.message || "Failed to delete product",
            );
          }
        })
        .catch((err) => {
          console.error("Delete failed:", err);
          context.Alertbox(
            "error",
            "An unexpected error occurred while deleting the product",
          );
        });
    }
  };
  const handleLimitChange = (event) => {
    const limit = parseInt(event.target.value);
    setPerPage(limit);
    getProducts(1, limit); // Reset to first page on limit change
  };

  useEffect(() => {
    getProducts(currentPage);
  }, []);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    getProducts(value, perPage);
  };
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    const updatedProducts = product.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setProduct(updatedProducts);
    console.log("Selected products:", updatedProducts);
    if (isChecked) {
      const ids = updatedProducts.map((item) => item._id).sort((a, b) => a - b);
      console.log("Selected product IDs:", ids);
      setSorting(ids);
    } else {
      setSorting([]);
    }
  };
  const handleDelete = (id) => {
    deleteData(`/api/product/${id}`)
      .then((res) => {
        if (res.error === false) {
          context.Alertbox("success", "Product Deleted Successfully");
          getProducts();
        } else {
          context.Alertbox("error", res.message || "Failed to delete product");
        }
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        context.Alertbox(
          "error",
          "An unexpected error occurred while deleting the product",
        );
      });
  };
  const handlecheckboxChange = (e, id) => {
    const updatedProducts = product.map((item) =>
      item._id === id ? { ...item, checked: e.target.checked } : item,
    );
    setProduct(updatedProducts);
    console.log("Selected products:", updatedProducts);
    if (e.target.checked) {
      const ids = updatedProducts
        .filter((item) => item.checked)
        .map((item) => item._id)
        .sort((a, b) => a - b);
      console.log("Selected product IDs:", ids);
      setSorting(ids);
    } else {
      setSorting([]);
    }
  };
  return (
    <>
      <section className="admin-welcome mb-5 flex flex-col items-start justify-between gap-5 rounded-2xl p-5 sm:flex-row sm:items-center sm:p-7">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/65">
            Your store at a glance
          </p>
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
            Welcome back, {context.userData?.name || "Admin"}
            <MdWavingHand className="text-2xl text-amber-300 sm:text-3xl" />
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
            Review your store activity and keep your catalog, orders, and
            customers moving.
          </p>
          <Button
            onClick={() =>
              context.setisOpenPanel({ open: true, model: "Add Product" })
            }
            className="!mt-5 !min-h-11 !rounded-xl !bg-white !px-5 !font-semibold !normal-case !text-[#0F1F4B] hover:!bg-slate-100"
          >
            <FaPlus className="mr-2" /> Add product
          </Button>
        </div>
        <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-5xl font-black text-white/90 sm:flex">
          A
        </div>
      </section>
      <DashboardBox
        product={productcount}
        orderData={orderData?.length}
        catData={context.catData?.length}
        users={users?.length}
        reviews={reviews?.length}
      />

      <section className="my-4 overflow-hidden rounded-xl bg-white shadow-md">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Top Selling Products
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Ranked by units sold, excluding canceled orders.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-5 py-3">
                  Product
                </th>
                <th scope="col" className="px-5 py-3">
                  Units Sold
                </th>
                <th scope="col" className="px-5 py-3">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-5 py-4">{item.quantity}</td>
                    <td className="px-5 py-4 font-semibold text-primary">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    No sales data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="card my-3 shadow-md sm:rounded-lg bg-white pt-2">
        <div className="card mt-4 mb-6 shadow-lg sm:rounded-xl bg-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 border-b">
            <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4 px-2">
              <div className="w-full md:w-[150px]">
                <label className="text-sm font-semibold mb-2 block text-gray-700">
                  Filter By Category
                </label>
                {Array.isArray(context?.catData) &&
                  context.catData.length > 0 && (
                    <Select
                      labelId="demo-simple-select-label"
                      id="ProductCat"
                      name="productCat"
                      value={Cat}
                      className="w-full bg-white rounded-md h-[45px]"
                      label="Category"
                      onChange={handleChange}
                    >
                      {context.catData.map((cat, index) => (
                        <MenuItem key={index} value={cat._id}>
                          {cat?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
              </div>
              <div className="w-full md:w-[180px]">
                <label className="text-sm font-semibold mb-2 block text-gray-700">
                  Filter By Sub Category
                </label>
                {context.catData.length !== 0 && (
                  <Select
                    labelId="demo-simple-select-label"
                    id="ProductCat"
                    name="productCat"
                    value={subCat}
                    className="w-full bg-white rounded-md h-[45px]"
                    label="subCategory"
                    onChange={handleChangesub}
                  >
                    {context.catData.map((cat, index) =>
                      cat.children.map((subcat, index) => (
                        <MenuItem key={index} value={subcat._id}>
                          {subcat?.name}
                        </MenuItem>
                      )),
                    )}
                  </Select>
                )}
              </div>
              <div className="w-full md:w-[250px]">
                <label className="text-sm text-[12px] block font-semibold mb-2  text-gray-700">
                  Filter By Third Level Category
                </label>
                {context.catData.length !== 0 && (
                  <Select
                    labelId="demo-simple-select-label"
                    id="ProductCat"
                    name="productCat"
                    value={thirdsubCat}
                    className="w-full bg-white rounded-md h-[45px]"
                    label="subCategory"
                    onChange={handleChangethirdsub}
                  >
                    {context.catData.map((cat, index) =>
                      cat.children.map((subcat, index) =>
                        subcat.children.map((third, index) => (
                          <MenuItem key={index} value={third._id}>
                            {third?.name}
                          </MenuItem>
                        )),
                      ),
                    )}
                  </Select>
                )}
              </div>

              <div className="w-full md:w-[300px]">
                <label className="text-sm font-semibold  block text-gray-700">
                  Search
                </label>
                <Searchbox />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-3">
                    <Checkbox
                      size="small"
                      {...label}
                      onChange={handleSelectAll}
                      checked={
                        product.length !== 0
                          ? product.every((item) => item.checked)
                          : false
                      }
                    />
                  </th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Subcategory</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-1 py-2">Sales</th>
                  <th className="px-1 py-2">Rating</th>
                  <th className="px-4 py-3 min-w-[150px]">Actions</th>
                </tr>
              </thead>

              {Array.isArray(product) && product.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={9} className="text-center py-6">
                      <p className="!text-sm !items-center text-center text-gray-500 my-4">
                        No products found for this category.
                      </p>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="text-center py-6">
                        <CircularProgress color="inherit" size={24} />
                      </td>
                    </tr>
                  ) : (
                    product.map((product) => (
                      <tr
                        key={product._id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            {...label}
                            checked={product.checked === true}
                            onChange={(e) =>
                              handlecheckboxChange(e, product._id)
                            }
                            size="small"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-4 max-w-md">
                            <Link
                              to={`/product/${product._id}`}
                              className="w-[60px] h-[60px] flex-shrink-0 rounded-lg overflow-hidden border border-gray-200"
                            >
                              <LazyLoadImage
                                alt={product?.name || "product"}
                                effect="blur"
                                className="w-full h-full object-cover"
                                src={
                                  product.images?.[0]?.url || "/placeholder.jpg"
                                }
                              />
                            </Link>
                            <div className="flex flex-col">
                              <Link to={`/product/${product._id}`}>
                                <h3 className="!text-[12px] font-semibold hover:text-primary line-clamp-2">
                                  {product.description.substring(0, 20) ||
                                    "N/A"}
                                </h3>
                              </Link>
                              <span className="text-xs whitespace-nowrap text-gray-500 font-[600]">
                                {product?.name?.substring(0, 20) || "N/A"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{product.category?.name}</td>
                        <td className="px-4 py-3">{product.subcatname}</td>
                        <td className="px-4 py-3">{product.brand}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="line-through text-gray-400 text-xs">
                              ${product.oldprice || "0.00"}
                            </span>
                            <span className="text-green-600 font-bold text-sm">
                              ${product.price || "0.00"}
                            </span>
                          </div>
                        </td>
                        <td className="px-1 py-1">
                          <span className="font-semibold text-sm">
                            {product.sale} Sales
                          </span>
                          <ProgressBar type="warning" value={product.sale} />
                        </td>
                        <td className="px-1 py-1">
                          <Rating
                            name="half-rating-read"
                            defaultValue={product.rating}
                            precision={0.5}
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {/* Edit Button */}

                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              sx={{
                                minWidth: 32,
                                height: 32,
                                p: 0,
                                backgroundColor: "rgb(220 252 231)",
                                "&:hover": {
                                  backgroundColor: "rgb(187 247 208)",
                                },
                              }}
                              onClick={() =>
                                context.setisOpenPanel({
                                  open: true,
                                  model: "Edit Product",
                                  id: product._id,
                                })
                              }
                            >
                              <AiTwotoneEdit className="text-green-700 text-lg" />
                            </Button>

                            {/* View Button */}

                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              component={Link}
                              to={`/product/${product._id}`}
                              sx={{
                                minWidth: 32,
                                height: 32,
                                p: 0,
                                backgroundColor: "rgb(219 234 254)",
                                "&:hover": {
                                  backgroundColor: "rgb(191 219 254)",
                                },
                              }}
                            >
                              <IoMdEye className="text-blue-700 text-lg" />
                            </Button>

                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              sx={{
                                minWidth: 32,
                                height: 32,
                                p: 0,
                                backgroundColor: "rgb(254 226 226)",
                                "&:hover": {
                                  backgroundColor: "rgb(254 202 202)",
                                },
                              }}
                              onClick={() => handleDelete(product._id)}
                            >
                              <MdOutlineDeleteOutline className="text-red-700 text-lg" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4">
            <div className="w-full sm:w-auto">
              <label className="font-semibold text-[14px] mb-1 block">
                Items Per Page
              </label>
              <Select
                className="w-1/2 sm:w-[70px]"
                size="small"
                value={perPage}
                onChange={handleLimitChange}
              >
                <MenuItem value={1}>1</MenuItem>

                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </div>
            <Pagination
              count={totalPages}
              page={currentPage}
              color="primary"
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">My Orders</h2>
          <p className="text-sm text-gray-600">
            There are{" "}
            <span className="text-primary font-semibold">
              {orderData?.length}
            </span>{" "}
            Orders in Total
          </p>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3"></th>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Pincode</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData1?.map((item, index) => {
                if (!item) return null;

                const globalIndex = (currentPage1 - 1) * perPage1 + index;
                const address = item.deliver_address ?? {};
                return (
                  <tr
                    key={item._id}
                    className="bg-white border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => handleTogglePopup(globalIndex)}
                        className="w-10 h-10 min-w-10 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        {openPopupIndex === globalIndex ? (
                          <FaAngleUp className="text-gray-600 text-lg" />
                        ) : (
                          <FaAngleDown className="text-gray-600 text-lg" />
                        )}
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-primary">{item._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.PaymentId}
                    </td>
                    <td className="px-6 py-4">{context.userData?.name}</td>
                    <td className="px-6 py-4">{address.Mobile || "N/A"}</td>
                    <td className="px-6 py-4 w-[500px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {[
                        address.Address_Type,
                        address.Address_line,
                        address.City,
                        address.State,
                        address.Country,
                        address.landmark,
                      ]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      ${item.Total}
                    </td>
                    <td className="px-6 py-4">{address.Pincode || "N/A"}</td>
                    <td className="px-6 py-4">{context.userData?.email}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.orderStatus} />
                    </td>
                    <td className="px-6 py-4">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4">
            <div className="w-full sm:w-auto">
              <label className="font-semibold text-[14px] mb-1 block">
                Items Per Page
              </label>
              <Select
                className="w-1/2 sm:w-[70px]"
                size="small"
                value={perPage1}
                onChange={handleLimitChange1}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </div>

            <Pagination
              count={totalPages1}
              page={currentPage1}
              color="primary"
              onChange={handlePageChange1}
            />
          </div>
        </div>
      </div>

      {openPopupIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-5xl relative">
            <button
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500"
              onClick={() => setOpenPopupIndex(null)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-5 text-gray-800">
              Order Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData?.[openPopupIndex]?.products?.map(
                    (product, idx) => (
                      <tr
                        key={idx}
                        className="bg-white border-b hover:bg-gray -50 transition"
                      >
                        <td className="px-6 py-4 text-primary">
                          {product.productId?._id}
                        </td>
                        <td className="px-6 py-4">
                          {product.productId?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <img
                            src={
                              product?.productId?.images?.[0]?.url ||
                              "https://via.placeholder.com/50"
                            }
                            className="w-[50px] h-[60px] object-cover rounded-md border"
                            alt="product"
                          />
                        </td>
                        <td className="px-6 py-4">{product.quantity}</td>
                        <td className="px-6 py-4">${product.price}</td>
                        <td className="px-6 py-4 font-semibold text-primary">
                          ${product.SubTotal}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <h2 className="text-[18px] font-[600]">Total Revenue & Sales</h2>
            <p className="mt-1 text-sm text-gray-500">
              Monthly totals for {new Date().getFullYear()}
            </p>
          </div>
        </div>
        <div className="h-[360px] w-full px-3 pb-5 sm:px-5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartdata}
              margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="revenue"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis
                yAxisId="sales"
                orientation="right"
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === "Revenue"
                    ? [formatCurrency(value), name]
                    : [value, name]
                }
              />
              <Legend />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="sales"
                type="monotone"
                dataKey="sales"
                name="Units Sold"
                stroke="#ea580c"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
