import { useContext, useEffect, useState, useCallback } from "react";
import Accountsidebar from "../../Component/AccountSidebar";
import { myContext } from "../../App";
import { fetchData } from "../../utils/api";
import Addressmenu from "./addressmenu";
import { LiaMapMarkedSolid, LiaPlusSolid } from "react-icons/lia";

export default function Address() {
  const context = useContext(myContext);

  const [address, setAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAddresses = useCallback(async () => {
    if (!context?.userData?._id) {
      setAddress([]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetchData("/api/address/get");

      setAddress(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      context.Alertbox(
        "error",
        error?.response?.data?.message || "Unable to load addresses",
      );
    } finally {
      setIsLoading(false);
    }
  }, [context?.userData?._id]);

  useEffect(() => {
    getAddresses();
  }, [getAddresses]);

  // IMPORTANT: Always set add mode before opening the drawer
  const handleAddAddress = () => {
    context.setaddressmode("add");
    context.setAddressId("");
    context.toggleaddressPanel(true)();
  };

  return (
    <section className="min-h-screen bg-white py-10">
      <div className="container mx-auto flex flex-col gap-6 px-4 lg:flex-row lg:gap-8">
        {/* Account sidebar */}
        <aside className="w-full lg:w-[280px] lg:shrink-0">
          <Accountsidebar />
        </aside>

        {/* Address content */}
        <main className="min-w-0 flex-1">
          <div className="rounded-2xl border border-[#e8eaf0] bg-white p-5 shadow-sm sm:p-7">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <LiaMapMarkedSolid className="text-[25px] text-[#8b0000]" />
                  <h2 className="text-xl font-bold text-[#0f1f4b]">
                    My Addresses
                  </h2>
                </div>

                <p className="mt-1 text-sm text-[#7b8498]">
                  Manage your shipping and delivery addresses.
                </p>
              </div>

              <span className="rounded-full bg-[#f1f3f8] px-3 py-1 text-xs font-semibold text-[#0f1f4b]">
                {address.length}{" "}
                {address.length === 1 ? "Address" : "Addresses"}
              </span>
            </div>

            <div className="mb-6 h-px bg-[#e8eaf0]" />

            {/* Add address button */}
            <button
              type="button"
              onClick={handleAddAddress}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#0f1f4b]/30 bg-[#f8f9fc] px-4 py-5 text-sm font-semibold text-[#0f1f4b] transition-all hover:border-[#8b0000] hover:bg-[#fff8f8] hover:text-[#8b0000]"
            >
              <LiaPlusSolid className="text-xl" />
              Add New Address
            </button>

            {/* Address list */}
            <div className="mt-6 flex flex-col gap-4">
              {isLoading ? (
                <div className="py-10 text-center text-sm text-[#7b8498]">
                  Loading addresses...
                </div>
              ) : address.length > 0 ? (
                address.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 rounded-xl border border-[#e8eaf0] bg-white p-4 transition-all hover:border-[#cbd2e0] hover:shadow-sm sm:p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f3f8] text-[#0f1f4b]">
                      <LiaMapMarkedSolid className="text-2xl" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-flex rounded-md bg-[#f8f0f0] px-3 py-1 text-[11px] font-bold text-[#8b0000]">
                            {item.Address_Type || "Address"}
                          </span>

                          <h3 className="mt-2 text-sm font-bold text-[#0f1f4b]">
                            {context?.userData?.name || "Customer"}
                          </h3>
                        </div>

                        <Addressmenu address={item} />
                      </div>

                      <p className="break-words text-sm leading-6 text-[#697386]">
                        {item.Address_line || ""}
                        {item.City ? `, ${item.City}` : ""}
                        {item.State ? `, ${item.State}` : ""}
                        {item.Country ? `, ${item.Country}` : ""}
                        {item.Pincode ? `, ${item.Pincode}` : ""}
                      </p>

                      {item.landmark && (
                        <p className="mt-1 text-xs text-[#8790a3]">
                          Landmark: {item.landmark}
                        </p>
                      )}

                      {item.Mobile && (
                        <p className="mt-3 text-xs font-semibold text-[#0f1f4b]">
                          Phone: {item.Mobile}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-[#e8eaf0] px-4 py-12 text-center">
                  <LiaMapMarkedSolid className="mx-auto text-5xl text-[#c5cad5]" />

                  <h3 className="mt-3 text-base font-bold text-[#0f1f4b]">
                    No addresses yet
                  </h3>

                  <p className="mt-2 text-sm text-[#8790a3]">
                    Add your first shipping address to continue.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
