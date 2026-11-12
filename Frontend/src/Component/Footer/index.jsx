import { LiaShippingFastSolid } from "react-icons/lia";
import { LiaGiftsSolid } from "react-icons/lia";
import { BiSupport } from "react-icons/bi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { PiClockCountdown } from "react-icons/pi";
import { Link } from "react-router-dom";
import { IoChatbubblesOutline } from "react-icons/io5";
import { Button } from "@mui/material";
import { FaInstagram, FaWhatsapp, FaFacebookF, FaGithub } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { useContext } from "react";
import { myContext } from "../../App";
import Drawer from "@mui/material/Drawer";
import CartPanel from "../CartPanel";
import { MdClose } from "react-icons/md";
import AddressPanel from "../../Pages/Myaccount/addressPanel";

export default function Footer() {
  const context = useContext(myContext);

  const benefits = [
    {
      icon: <LiaShippingFastSolid />,
      title: "Delivery Across Lebanon",
      description: "Fast and reliable delivery",
    },
    {
      icon: <PiClockCountdown />,
      title: "12-Month Warranty",
      description: "Shop with confidence",
    },
    {
      icon: <RiSecurePaymentLine />,
      title: "Secure Shopping",
      description: "Safe and reliable checkout",
    },
    {
      icon: <LiaGiftsSolid />,
      title: "Special Offers",
      description: "Great deals on your favorites",
    },
    {
      icon: <BiSupport />,
      title: "Customer Support",
      description: "We're here to help",
    },
  ];

  const productLinks = [
    { label: "Price Drops", to: "/products" },
    { label: "New Products", to: "/products" },
    { label: "Best Sellers", to: "/products" },
    { label: "All Products", to: "/products" },
    { label: "Contact Us", to: "/contactus" },
  ];

  const companyLinks = [
    { label: "Delivery Information", to: "/delivery" },
    { label: "Legal Notice", to: "/legalnotice" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Contact Us", to: "/contactus" },
    { label: "About Us", to: "/aboutus" },
    { label: "Secure Payments", to: "/securepayment" },
    { label: "My Account", to: "/myaccount" },
  ];

  const socialLinks = [
    {
      icon: <FaInstagram />,
      href: "https://instagram.com/yourhandle",
      label: "Instagram",
    },
    {
      icon: <FaFacebookF />,
      href: "https://facebook.com/yourpage",
      label: "Facebook",
    },

    {
      icon: <FaWhatsapp />,
      href: "https://chat.whatsapp.com/your-group-invite",
      label: "WhatsApp",
    },
  ];

  return (
    <>
      <footer className="bg-white">
        {/* Benefits section */}
        <div className="border-y border-[#e8eaf0] bg-[#0f1f4b]">
          <div className="container mx-auto grid grid-cols-2 gap-5 px-4 py-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {benefits.map((item, index) => (
              <div key={index} className="group flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[28px] text-[#0f1f4b] shadow-sm transition-all duration-300 group-hover:bg-[#0f1f4b] group-hover:text-white">
                  {item.icon}
                </div>

                <div>
                  <h3 className="text-[13px] font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-white">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main footer */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Contact */}
            <div>
              <h2 className="mb-6 text-[17px] font-bold text-[#0f1f4b]">
                Contact Us
              </h2>

              <div className="space-y-4 text-[13px] text-[#697386]">
                <p className="leading-6">
                  Saida, South Lebanon
                  <br />
                  AgCell - Lebanon
                </p>

                <a
                  href="mailto:bilalkotaish2000@gmail.com"
                  className="block transition-colors hover:text-[#8b0000]"
                >
                  bilalkotaish2000@gmail.com
                </a>

                <a
                  href="tel:+96178994740"
                  className="block transition-colors hover:text-[#8b0000]"
                >
                  +961 78 994 740
                </a>
              </div>

              <a
                href="https://wa.me/96178994740"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-3 rounded-xl border border-[#e8eaf0] p-3 transition-all hover:border-[#8b0000]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f8f0f0] text-[23px] text-[#8b0000]">
                  <IoChatbubblesOutline />
                </div>

                <div>
                  <h3 className="text-[13px] font-bold text-[#0f1f4b]">
                    Online Support
                  </h3>
                  <p className="text-[11px] text-[#7b8498]">
                    Chat with our team
                  </p>
                </div>
              </a>
            </div>

            {/* Products */}
            <div>
              <h2 className="mb-6 text-[17px] font-bold text-[#0f1f4b]">
                Products
              </h2>

              <ul className="space-y-3">
                {productLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-[13px] text-[#697386] transition-all hover:pl-1 hover:text-[#8b0000]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h2 className="mb-6 text-[17px] font-bold text-[#0f1f4b]">
                Our Company
              </h2>

              <ul className="space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-[13px] text-[#697386] transition-all hover:pl-1 hover:text-[#8b0000]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* WhatsApp community */}
            <div>
              <h2 className="mb-4 text-[17px] font-bold text-[#0f1f4b]">
                Join Our Community
              </h2>

              <p className="text-[13px] leading-6 text-[#697386]">
                Be the first to discover our latest smartphones, exclusive
                offers, new arrivals, and special promotions.
              </p>

              <div className="mt-5 rounded-xl bg-[#f8f9fc] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f7ed] text-[26px] text-[#25d366]">
                  <FaWhatsapp />
                </div>

                <h3 className="mb-2 text-[14px] font-bold text-[#0f1f4b]">
                  AgCell WhatsApp Group
                </h3>

                <p className="mb-4 text-[12px] leading-5 text-[#7b8498]">
                  Get updates about our latest deals directly on WhatsApp.
                </p>

                <Button
                  fullWidth
                  onClick={() =>
                    window.open(
                      "https://chat.whatsapp.com/your-invite-link",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="!rounded-lg !bg-[#0f1f4b] !py-3 !text-[12px] !font-bold !normal-case !text-white hover:!bg-[#8b0000]"
                >
                  Join WhatsApp Group
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-[#e8eaf0] bg-[#0b1736]">
          <div className="container mx-auto flex flex-col items-center justify-between gap-5 px-4 py-6 md:flex-row">
            {/* Social media */}
            <div className="flex items-center gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[15px] text-white transition-all duration-300 hover:border-[#8b0000] hover:bg-[#8b0000]"
                >
                  {item.icon}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-center text-[11px] text-white/60">
              © {new Date().getFullYear()} AgCell. All rights reserved.
            </p>

            {/* Payment methods */}
            {/* <div className="flex items-center gap-2">
              {[
                "/assets/carte_bleue.png",
                "/assets/master_card.png",
                "/assets/paypal.png",
                "/assets/visa.png",
              ].map((src) => (
                <div
                  key={src}
                  className="flex h-8 w-12 items-center justify-center rounded bg-white px-1"
                >
                  <img
                    src={src}
                    alt="Payment method"
                    className="max-h-6 max-w-full object-contain"
                  />
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </footer>

      {/* Cart drawer */}
      <Drawer
        open={context?.openCartPanel}
        onClose={context.toggleCartPanel(false)}
        anchor="right"
        className="cartpanel"
      >
        <div className="relative flex items-center justify-center border-b border-[#e8eaf0] px-4 py-4">
          <h2 className="text-center text-[17px] font-bold text-[#0f1f4b]">
            Your Shopping Cart
          </h2>

          <MdClose
            className="absolute right-4 cursor-pointer text-[21px] text-[#0f1f4b] transition-colors hover:text-[#8b0000]"
            onClick={context.toggleCartPanel(false)}
          />
        </div>

        {context.cartData?.length > 0 ? (
          <div className="max-h-[300px] w-full overflow-x-hidden overflow-y-auto px-4 py-3">
            <CartPanel data={context.cartData} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-5 px-5">
            <img
              src="/assets/emptycarts.png"
              alt="Empty shopping cart"
              className="w-full max-w-[180px] object-contain"
            />

            <h4 className="text-[15px] font-semibold text-[#0f1f4b]">
              Your Cart is Empty
            </h4>

            <Button
              onClick={context.toggleCartPanel(false)}
              className="!rounded-lg !bg-[#0f1f4b] !px-6 !py-2.5 !text-white hover:!bg-[#8b0000]"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </Drawer>

      {/* Address drawer */}
      <Drawer
        open={context.openaddressPanel}
        onClose={context.toggleaddressPanel(false)}
        anchor="right"
        className="addresspanel"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#e8eaf0] px-4 py-4">
          <h4 className="text-[15px] font-bold text-[#0f1f4b]">
            {context.addressmode === "add" ? "Add" : "Update"} Your Shipping
            Address
          </h4>

          <MdClose
            className="cursor-pointer text-[21px] text-[#0f1f4b] hover:text-[#8b0000]"
            onClick={context.toggleaddressPanel(false)}
          />
        </div>

        <AddressPanel />
      </Drawer>
    </>
  );
}
