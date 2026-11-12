import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { MdDeleteOutline, MdShoppingCartCheckout } from "react-icons/md";
import { BsBagCheck, BsCart3 } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { myContext } from "../../App";
import { deleteData } from "../../utils/api";

export default function CartPanel(props) {
  const context = useContext(myContext);

  const [deletingId, setDeletingId] = useState(null);

  const cartItems = props.data || context.cartData || [];

  // Calculate cart total
  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;

      return total + price * quantity;
    }, 0);
  };

  const total = getTotal();

  // Delete cart item
  const handleDelete = async (id) => {
    if (!id || deletingId) return;

    try {
      setDeletingId(id);

      const res = await deleteData(`/api/cart/deletecart/${id}`);

      if (res?.error) {
        context.Alertbox("error", res.message || "Unable to remove item.");
        return;
      }

      context.Alertbox("success", res?.message || "Item removed from cart.");

      await context.getCart();
    } catch (error) {
      console.error("Cart delete error:", error);
      context.Alertbox("error", "Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Close cart drawer
  const closeCart = () => {
    context.toggleCartPanel(false)();
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-white">
      {/* CART HEADER */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F1F4B] text-white">
            <BsCart3 size={19} />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#0F1F4B]">
              Shopping Cart
            </h3>

            <p className="text-xs text-gray-400">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
        </div>

        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#8B0000] px-2 text-xs font-bold text-white">
          {cartItems.length}
        </span>
      </div>

      {/* CART ITEMS - SCROLLABLE */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-5">
        {cartItems.length === 0 ? (
          <div className="flex h-full min-h-[250px] flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F6FA]">
              <BsCart3 className="text-4xl text-[#0F1F4B]/30" />
            </div>

            <h4 className="text-base font-bold text-[#0F1F4B]">
              Your cart is empty
            </h4>

            <p className="mt-2 max-w-[220px] text-sm leading-6 text-gray-400">
              Looks like you haven't added any products to your cart yet.
            </p>

            <Link
              to="/products"
              onClick={closeCart}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0F1F4B] px-6 text-sm font-semibold text-white transition hover:bg-[#8B0000]"
            >
              Start Shopping
              <FiArrowRight />
            </Link>

            <img
              src="/assets/emptycarts.png"
              alt="Empty shopping cart"
              className="mt-5 h-24 w-24 object-contain opacity-70"
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => {
              const productId =
                item.productId?._id || item.productId || item._id;

              const productTitle =
                item.ProductTitle || item.productId?.name || "Product";

              const image =
                item.image ||
                item.productId?.images?.[0]?.url ||
                "/assets/placeholder.png";

              return (
                <div key={item._id} className="flex gap-3 py-4 sm:gap-4">
                  {/* Product Image */}
                  <Link
                    to={`/productdetails/${productId}`}
                    onClick={closeCart}
                    className="h-[85px] w-[85px] shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-[#F8F9FC] sm:h-[95px] sm:w-[95px]"
                  >
                    <img
                      src={image}
                      alt={productTitle}
                      className="h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-105"
                    />
                  </Link>

                  {/* Product Information */}
                  <div className="relative min-w-0 flex-1 pr-7">
                    <Link
                      to={`/productdetails/${productId}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-semibold leading-5 text-[#0F1F4B] transition-colors hover:text-[#8B0000]"
                    >
                      {productTitle}
                    </Link>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>
                        Qty:{" "}
                        <strong className="text-[#0F1F4B]">
                          {item.quantity}
                        </strong>
                      </span>

                      <span>
                        Price:{" "}
                        <strong className="text-[#0F1F4B]">
                          ${Number(item.price || 0).toFixed(2)}
                        </strong>
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-bold text-[#8B0000]">
                      $
                      {(
                        Number(item.price || 0) * Number(item.quantity || 0)
                      ).toFixed(2)}
                    </p>

                    {/* Delete */}
                    <button
                      type="button"
                      disabled={deletingId !== null}
                      onClick={() => handleDelete(item._id)}
                      aria-label={`Remove ${productTitle} from cart`}
                      className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-[#8B0000] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === item._id ? (
                        <CircularProgress size={17} sx={{ color: "#8B0000" }} />
                      ) : (
                        <MdDeleteOutline size={21} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CART SUMMARY - FIXED AT BOTTOM */}
      {cartItems.length > 0 && (
        <div className="shrink-0 border-t border-gray-200 bg-white px-4 pb-4 pt-4 sm:px-5">
          {/* Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-500">
                Subtotal ({cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"})
              </span>

              <span className="font-semibold text-[#0F1F4B]">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-500">Shipping</span>

              <span className="font-semibold text-green-600">Free</span>
            </div>
          </div>

          {/* Total */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="text-sm font-bold text-[#0F1F4B]">Total</p>

              <p className="mt-1 text-[11px] text-gray-400">
                Shipping included
              </p>
            </div>

            <span className="text-xl font-extrabold text-[#8B0000]">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link to="/cart" onClick={closeCart} className="w-full">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<BsBagCheck />}
                sx={{
                  minHeight: "46px",
                  borderRadius: "8px",
                  borderColor: "#0F1F4B",
                  color: "#0F1F4B",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#8B0000",
                    backgroundColor: "rgba(139,0,0,0.04)",
                    color: "#8B0000",
                  },
                }}
              >
                View Cart
              </Button>
            </Link>

            <Link to="/checkout" onClick={closeCart} className="w-full">
              <Button
                fullWidth
                variant="contained"
                endIcon={<MdShoppingCartCheckout />}
                sx={{
                  minHeight: "46px",
                  borderRadius: "8px",
                  backgroundColor: "#8B0000",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#650000",
                    boxShadow: "none",
                  },
                }}
              >
                Checkout
              </Button>
            </Link>
          </div>

          <p className="mt-3 text-center text-[11px] text-gray-400">
            Secure shopping · Cash on delivery available
          </p>
        </div>
      )}
    </div>
  );
}
