import Button from "@mui/material/Button";
import { useContext } from "react";
import Listitems from "./Listitems";
import Accountsidebar from "../AccountSidebar";
import { myContext } from "../../App";
import { Link } from "react-router-dom";
import { MdFavoriteBorder } from "react-icons/md";
import { IoBagCheckOutline } from "react-icons/io5";

export default function MyList() {
  const context = useContext(myContext);

  const listCount = context?.listData?.length || 0;

  return (
    <section className="min-h-screen bg-white py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F1F4B] md:text-3xl">
            My Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your profile, orders, addresses and favorite products.
          </p>
        </div>

        <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
          {/* Account Sidebar */}
          <aside className="w-full lg:w-[280px] lg:shrink-0">
            <Accountsidebar />
          </aside>

          {/* Main Content */}
          <main className="w-full min-w-0 flex-1">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-5 py-6 sm:flex-row sm:items-center sm:px-7">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0F1F4B]/5">
                      <MdFavoriteBorder className="text-2xl text-[#8B0000]" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[#0F1F4B]">
                        My Wishlist
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Your favorite products in one place.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start rounded-lg border border-gray-200 px-4 py-2 sm:self-auto">
                  <span className="text-sm text-gray-500">Products</span>
                  <span className="font-bold text-[#8B0000]">{listCount}</span>
                </div>
              </div>

              {/* Wishlist Items */}
              {listCount > 0 && (
                <div className="divide-y divide-gray-100">
                  {context?.listData?.map((item, index) => (
                    <Listitems key={index} item={item} />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {listCount === 0 && (
                <div className="flex min-h-[400px] flex-col items-center justify-center px-5 py-12 text-center">
                  <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-gray-100 bg-white">
                    <MdFavoriteBorder className="text-5xl text-gray-300" />
                  </div>

                  <h3 className="text-xl font-bold text-[#0F1F4B]">
                    Your Wishlist is Empty
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    You haven't added any products to your wishlist yet. Explore
                    our collection and save your favorite products.
                  </p>

                  <Link to="/" className="mt-6">
                    <Button
                      variant="contained"
                      startIcon={<IoBagCheckOutline />}
                      sx={{
                        backgroundColor: "#0F1F4B",
                        borderRadius: "8px",
                        padding: "11px 24px",
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#8B0000",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
