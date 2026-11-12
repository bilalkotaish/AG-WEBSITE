import { useContext, useEffect, useMemo } from "react";
import { myContext } from "../../App";
import CartItems from "./CartItems";
import Button from "@mui/material/Button";
import { IoBagCheckOutline } from "react-icons/io5";
import { BsBagCheck } from "react-icons/bs";
import { FiShoppingBag, FiTruck, FiShield } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/emptycarts.png";

export default function Cart() {
  const context = useContext(myContext);
  const navigate = useNavigate();

  const cartData = context?.cartData || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalPrice = useMemo(() => {
    return cartData.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  }, [cartData]);

  const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;

  const handleCheckout = () => {
    navigate(context?.islogin ? "/checkout" : "/login");
  };

  const handleContinueShopping = () => {
    if (typeof context?.toggleCartPanel === "function") {
      context.toggleCartPanel(false)();
    }
  };

  return (
    <section className="min-h-screen bg-[#F8F9FC] py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F1F4B] text-white">
              <BsBagCheck className="text-xl" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0F1F4B] sm:text-3xl">
                Shopping Cart
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Review your items before checkout
              </p>
            </div>
          </div>
        </div>

        {cartData.length === 0 ? (
          /* Empty cart */
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
            <img
              src={logo}
              alt="Empty shopping cart"
              className="mb-6 w-36 max-w-full object-contain opacity-90 sm:w-44"
            />

            <h2 className="text-xl font-bold text-[#0F1F4B] sm:text-2xl">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Looks like you haven't added anything to your cart yet. Explore
              our collection and find something you love.
            </p>

            <Link
              to="/"
              onClick={handleContinueShopping}
              className="mt-7 inline-flex"
            >
              <Button
                variant="contained"
                className="!rounded-lg !bg-[#0F1F4B] !px-7 !py-3 !text-sm !font-semibold !normal-case !shadow-none hover:!bg-[#8B0000]"
              >
                <FiShoppingBag className="mr-2 text-lg" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
            {/* Cart items */}
            <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-5 sm:px-6">
                <div>
                  <h2 className="text-lg font-bold text-[#0F1F4B] sm:text-xl">
                    Your Items
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {cartData.length} product(s) in your cart
                  </p>
                </div>

                <span className="rounded-full bg-[#F1F3F8] px-3 py-1.5 text-xs font-semibold text-[#0F1F4B]">
                  {cartData.reduce(
                    (total, item) => total + Number(item.quantity || 0),
                    0,
                  )}{" "}
                  item(s)
                </span>
              </div>

              <div className="divide-y divide-gray-100 px-3 sm:px-6">
                {cartData.map((item) => (
                  <div key={item._id} className="py-4 sm:py-5">
                    <CartItems data={item} qty={item.quantity} size="S" />
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 px-4 py-4 sm:px-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F1F4B] transition-colors hover:text-[#8B0000]"
                >
                  <FiShoppingBag />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <aside className="min-w-0">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
                <h2 className="mb-5 text-xl font-bold text-[#0F1F4B]">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-3 text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-gray-600">
                    <span>Delivery destination</span>
                    <span className="font-medium text-gray-900">Lebanon</span>
                  </div>
                </div>

                <div className="my-5 border-t border-dashed border-gray-200" />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-bold text-[#0F1F4B]">
                    Total
                  </span>
                  <span className="text-xl font-extrabold text-[#8B0000]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={cartData.length === 0}
                  fullWidth
                  variant="contained"
                  className="!mt-6 !h-[52px] !rounded-xl !bg-[#0F1F4B] !text-base !font-bold !normal-case !shadow-none transition-all hover:!bg-[#8B0000]"
                >
                  Proceed to Checkout
                  <IoBagCheckOutline className="ml-2 text-xl" />
                </Button>

                <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <FiTruck className="shrink-0 text-lg text-[#0F1F4B]" />
                    <span>Delivery available across Lebanon</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <FiShield className="shrink-0 text-lg text-[#0F1F4B]" />
                    <span>Cash on delivery available</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
