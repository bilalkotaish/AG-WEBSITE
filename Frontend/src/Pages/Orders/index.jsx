import Accountsidebar from "../../Component/AccountSidebar";
import Badge from "../../Component/Badge";

import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { BsBagCheck } from "react-icons/bs";

import Button from "@mui/material/Button";

import { useState, useEffect, useContext } from "react";
import { myContext } from "../../App";
import { fetchData } from "../../utils/api";

export default function Orders() {
  const [openPopupIndex, setOpenPopupIndex] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const context = useContext(myContext);

  const userId = context?.userData?._id;

  const handleTogglePopup = (index) => {
    setOpenPopupIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const getOrderData = async () => {
      try {
        setIsLoading(true);

        const res = await fetchData(`/api/orders/get/${userId}`);

        if (res?.error) {
          context.Alertbox("error", res.message);
          setOrderData([]);
        } else {
          setOrderData(res?.data || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        context.Alertbox("error", "Unable to load your orders.");
      } finally {
        setIsLoading(false);
      }
    };

    getOrderData();
  }, [userId]);

  const selectedOrder =
    openPopupIndex !== null ? orderData[openPopupIndex] : null;

  return (
    <section className="min-h-screen bg-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page Heading */}
        <div className="mb-8">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[2px] text-[#8B0000]">
            AGCELL ACCOUNT
          </span>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F1F4B] sm:text-3xl">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Track your purchases and view your order history.
          </p>
        </div>

        {/* SAME ACCOUNT LAYOUT AS MY ACCOUNT PAGE */}
        <div className="flex flex-col items-start gap-7 lg:flex-row lg:gap-8">
          {/* Account Sidebar */}
          <aside className="w-full lg:w-[280px] lg:shrink-0">
            <Accountsidebar />
          </aside>

          {/* Main Content */}
          <main className="min-w-0 w-full flex-1">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* Header */}
              <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0F1F4B] text-white">
                    <BsBagCheck size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#0F1F4B]">
                      Order History
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      You have{" "}
                      <span className="font-bold text-[#8B0000]">
                        {orderData.length}
                      </span>{" "}
                      orders in total
                    </p>
                  </div>
                </div>
              </div>

              {/* Loading */}
              {isLoading ? (
                <div className="flex h-[300px] items-center justify-center">
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#0F1F4B]" />
                </div>
              ) : orderData.length > 0 ? (
                /* Orders Table */
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-left text-sm text-gray-600">
                    <thead className="bg-[#F8F9FC] text-xs uppercase tracking-wide text-[#0F1F4B]">
                      <tr>
                        <th className="px-5 py-4"></th>
                        <th className="px-5 py-4">Order ID</th>
                        <th className="px-5 py-4">Payment</th>
                        <th className="px-5 py-4">Name</th>
                        <th className="px-5 py-4">Phone</th>
                        <th className="px-5 py-4">Address</th>
                        <th className="px-5 py-4">Total</th>
                        <th className="px-5 py-4">Pincode</th>
                        <th className="px-5 py-4">Email</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orderData.map((item, index) => {
                        const address = item.deliver_address || {};

                        return (
                          <tr
                            key={item._id}
                            className="border-b border-gray-100 transition hover:bg-[#F8F9FC]"
                          >
                            <td className="px-5 py-4">
                              <Button
                                onClick={() => handleTogglePopup(index)}
                                sx={{
                                  width: 36,
                                  height: 36,
                                  minWidth: 36,
                                  borderRadius: "50%",
                                  color: "#0F1F4B",
                                  backgroundColor: "#F1F3F8",
                                  "&:hover": {
                                    backgroundColor: "#E5E9F2",
                                  },
                                }}
                              >
                                {openPopupIndex === index ? (
                                  <FaAngleUp />
                                ) : (
                                  <FaAngleDown />
                                )}
                              </Button>
                            </td>

                            <td className="px-5 py-4 font-semibold text-[#0F1F4B]">
                              {item._id}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              {item.PaymentId || "N/A"}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              {context.userData?.name || "N/A"}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              {address.Mobile || "N/A"}
                            </td>

                            <td className="max-w-[320px] px-5 py-4">
                              <div className="whitespace-normal text-xs">
                                <p className="mb-1 font-semibold text-[#0F1F4B]">
                                  {address.Address_Type || "Address"}
                                </p>

                                <p>
                                  {[
                                    address.Address_line,
                                    address.City,
                                    address.State,
                                    address.Country,
                                    address.landmark,
                                  ]
                                    .filter(Boolean)
                                    .join(", ") || "N/A"}
                                </p>
                              </div>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 font-bold text-[#8B0000]">
                              ${item.Total}
                            </td>

                            <td className="px-5 py-4">
                              {address.Pincode || "N/A"}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              {context.userData?.email || "N/A"}
                            </td>

                            <td className="px-5 py-4">
                              <Badge status={item.orderStatus} />
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Empty Orders */
                <div className="flex min-h-[340px] flex-col items-center justify-center px-5 py-10 text-center">
                  <img
                    src="https://img.freepik.com/free-vector/removing-goods-from-basket-refusing-purchase-changing-decision-item-deletion-emptying-trash-online-shopping-app-laptop-user-cartoon-character_335657-2566.jpg"
                    alt="No orders"
                    className="mb-5 w-36 object-contain opacity-80"
                  />

                  <h3 className="text-lg font-bold text-[#0F1F4B]">
                    No Orders Found
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-gray-400">
                    Your order history will appear here once you place your
                    first order.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpenPopupIndex(null)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-7">
              <div>
                <h3 className="text-lg font-bold text-[#0F1F4B]">
                  Order Details
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Order #{selectedOrder._id}
                </p>
              </div>

              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 transition hover:bg-red-50 hover:text-[#8B0000]"
                onClick={() => setOpenPopupIndex(null)}
              >
                ×
              </button>
            </div>

            {/* Products */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm text-gray-600">
                <thead className="bg-[#F8F9FC] text-xs uppercase text-[#0F1F4B]">
                  <tr>
                    <th className="px-5 py-4">Product ID</th>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Image</th>
                    <th className="px-5 py-4">Quantity</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrder.products?.map((product, idx) => (
                    <tr
                      key={product._id || idx}
                      className="border-b border-gray-100 hover:bg-[#F8F9FC]"
                    >
                      <td className="px-5 py-4 text-xs text-[#0F1F4B]">
                        {product.productId?._id || "N/A"}
                      </td>

                      <td className="px-5 py-4 font-semibold text-[#0F1F4B]">
                        {product.productId?.name || "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <img
                          src={
                            product.productId?.images?.[0]?.url ||
                            "https://via.placeholder.com/50"
                          }
                          alt={product.productId?.name || "Product"}
                          className="h-[60px] w-[50px] rounded-md border border-gray-200 object-cover"
                        />
                      </td>

                      <td className="px-5 py-4">{product.quantity}</td>

                      <td className="whitespace-nowrap px-5 py-4">
                        ${product.price}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-bold text-[#8B0000]">
                        ${product.SubTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
