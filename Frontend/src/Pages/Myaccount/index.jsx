import { MdCloudUpload } from "react-icons/md";
import Button from "@mui/material/Button";
import { FaRegUser } from "react-icons/fa";
import { BsBagCheck } from "react-icons/bs";
import { GoChecklist } from "react-icons/go";
import { RiLogoutBoxLine } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Collapse } from "react-collapse";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Accountsidebar from "../../Component/AccountSidebar";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import { editData, postData } from "../../utils/api";
import {} from "../Myaccount/index.css";

export default function Myaccount() {
  const [isLoading, setisLoading] = useState(false);
  const [isLoading2, setisLoading2] = useState(false);
  const [isclick, setisclick] = useState(false);
  const [phone, setPhone] = useState("");
  const [userId, setuserId] = useState("");

  const [formfield, setformfield] = useState({
    name: "",
    email: "",
    Mobile: "",
  });

  const [changePassword, setchangePassword] = useState({
    email: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const context = useContext(myContext);
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token === null) {
      history("/");
    }
  }, [context?.islogin]);

  const validValue = Object.values(formfield).every((el) => el);
  const validValue2 = Object.values(changePassword).every((el) => el);

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      setuserId(context?.userData?._id);

      setformfield({
        name: context?.userData?.name,
        email: context?.userData?.email,
        Mobile: context?.userData?.Mobile,
      });

      const ph = `"${context?.userData?.Mobile}"`;
      setPhone(ph);

      setchangePassword({
        email: context?.userData?.email,
      });
    }
  }, [context?.userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    setformfield((prev) => ({
      ...prev,
      [name]: value,
    }));

    setchangePassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = (e) => {
    setisLoading(true);
    e.preventDefault();

    if (formfield.email === "") {
      context.Alertbox("error", "Please Provide Your Email");
      return false;
    }

    if (formfield.name === "") {
      context.Alertbox("error", "Please Provide Your Password");
      return false;
    }

    if (formfield.Mobile === "") {
      context.Alertbox("error", "Please Provide Your Mobile Number");
      return false;
    }

    editData(`/api/user/${userId}`, formfield, {
      withCredentials: true,
    }).then((res) => {
      if (res.error !== true) {
        setisLoading(false);
        context.Alertbox("success", res.message);
        console.log(res);
      } else {
        context.Alertbox("error", res.message);
        setisLoading(false);
      }
    });
  };

  const handlesubmitChange = (e) => {
    setisLoading(true);
    e.preventDefault();

    if (changePassword.oldPassword === "") {
      context.Alertbox("error", "Please Provide Your Old Password");
      return false;
    }

    if (changePassword.password === "") {
      context.Alertbox("error", "Please Provide Your New Password");
      return false;
    }

    if (changePassword.confirmPassword === "") {
      context.Alertbox("error", "Please Confirm Your Password");
      return false;
    }

    if (changePassword.confirmPassword !== changePassword.password) {
      context.Alertbox("error", "Password Does Not Match");
      return false;
    }

    postData(`/api/user/reset-password`, changePassword, {
      withCredentials: true,
    }).then((res) => {
      console.log("Response:", res);

      if (res.error !== true) {
        setisLoading(false);
        context.Alertbox("success", res.message);
        console.log(res);
      } else {
        context.Alertbox("error", res.message);
        setisLoading(false);
      }
    });
  };

  const fieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "9px",
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: "#E5E7EB",
      },
      "&:hover fieldset": {
        borderColor: "#0F1F4B",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0F1F4B",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0F1F4B",
    },
  };

  return (
    <section className="min-h-screen bg-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb / Page heading */}
        <div className="mb-8">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[2px] text-[#8B0000]">
            AGCELL ACCOUNT
          </span>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F1F4B] sm:text-3xl">
            My Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and account security.
          </p>
        </div>

        <div className="flex flex-col items-start gap-7 lg:flex-row lg:gap-8">
          {/* Account Sidebar */}
          <aside className="w-full lg:w-[280px] lg:shrink-0">
            <Accountsidebar />
          </aside>

          {/* Main content */}
          <main className="min-w-0 w-full flex-1">
            {/* Profile card */}
            <div className="mb-7 overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* Card heading */}
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0F1F4B] text-white">
                    <FaRegUser size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#0F1F4B]">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Update your profile details
                    </p>
                  </div>
                </div>

                <Button
                  variant="outlined"
                  onClick={() => setisclick(!isclick)}
                  startIcon={<GoChecklist />}
                  sx={{
                    borderColor: "#8B0000",
                    color: "#8B0000",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "13px",
                    padding: "8px 14px",
                    "&:hover": {
                      borderColor: "#8B0000",
                      backgroundColor: "rgba(139,0,0,0.04)",
                    },
                  }}
                >
                  {isclick ? "Close Password Settings" : "Change Password"}
                </Button>
              </div>

              {/* Profile form */}
              <form
                onSubmit={handlesubmit}
                className="space-y-6 px-5 py-6 sm:px-7 sm:py-7"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextField
                    label="Full Name"
                    name="name"
                    size="medium"
                    disabled={isLoading}
                    variant="outlined"
                    fullWidth
                    value={formfield.name}
                    onChange={onChangeInput}
                    sx={fieldStyles}
                  />

                  <TextField
                    label="Email Address"
                    name="email"
                    size="medium"
                    disabled
                    variant="outlined"
                    fullWidth
                    value={formfield.email}
                    sx={fieldStyles}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0F1F4B]">
                    Mobile Number
                  </label>

                  <PhoneInput
                    defaultCountry="lb"
                    className="agcell-phone-input"
                    disabled={isLoading}
                    value={phone}
                    onChange={(val) => {
                      setPhone(val);
                      setformfield((prev) => ({
                        ...prev,
                        Mobile: val,
                      }));
                    }}
                  />
                </div>

                {/* Save */}
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-400">
                    Make sure your information is up to date.
                  </p>

                  <Button
                    type="submit"
                    disabled={!validValue || isLoading}
                    variant="contained"
                    sx={{
                      minWidth: "135px",
                      backgroundColor: "#0F1F4B",
                      borderRadius: "8px",
                      padding: "10px 22px",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#8B0000",
                        boxShadow: "none",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#D1D5DB",
                        color: "#fff",
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Change password panel */}
            <Collapse isOpened={isclick}>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#8B0000] text-white">
                    <GoChecklist size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#0F1F4B]">
                      Change Password
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Keep your account secure with a strong password.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handlesubmitChange}
                  className="space-y-5 px-5 py-6 sm:px-7 sm:py-7"
                >
                  {context.userData?.SignUpGoogle === false && (
                    <TextField
                      label="Current Password"
                      name="oldPassword"
                      type="password"
                      size="medium"
                      variant="outlined"
                      fullWidth
                      value={changePassword.oldPassword}
                      onChange={onChangeInput}
                      sx={fieldStyles}
                    />
                  )}

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <TextField
                      label="New Password"
                      name="password"
                      type="password"
                      size="medium"
                      variant="outlined"
                      fullWidth
                      value={changePassword.password}
                      onChange={onChangeInput}
                      sx={fieldStyles}
                    />

                    <TextField
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      size="medium"
                      variant="outlined"
                      fullWidth
                      value={changePassword.confirmPassword}
                      onChange={onChangeInput}
                      sx={fieldStyles}
                    />
                  </div>

                  <div className="flex justify-end border-t border-gray-100 pt-5">
                    <Button
                      type="submit"
                      disabled={!validValue2 || isLoading}
                      variant="contained"
                      sx={{
                        minWidth: "180px",
                        backgroundColor: "#8B0000",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#0F1F4B",
                          boxShadow: "none",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "#D1D5DB",
                          color: "#fff",
                        },
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Collapse>
          </main>
        </div>
      </div>
    </section>
  );
}
