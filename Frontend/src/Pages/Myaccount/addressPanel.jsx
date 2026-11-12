import {
  FormControl,
  Radio,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  CircularProgress,
} from "@mui/material";

import { myContext } from "../../App";
import { useContext, useEffect, useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { postData, fetchData, editData } from "../../utils/api";

export default function AddressPanel() {
  const context = useContext(myContext);

  const initialForm = {
    Address_line: "",
    City: "",
    State: "",
    Pincode: "",
    Country: "",
    Mobile: "",
    Address_Type: "",
    landmark: "",
  };

  const [formfield, setformfield] = useState(initialForm);
  const [isLoading, setisLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [Addresstype, setAddresstype] = useState("");

  const resetForm = () => {
    setformfield(initialForm);
    setPhone("");
    setAddresstype("");
  };

  const closePanel = () => {
    context.toggleaddressPanel(false)();
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    setformfield((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onChangeAddresstype = (e) => {
    const value = e.target.value;

    setAddresstype(value);

    setformfield((prev) => ({
      ...prev,
      Address_Type: value,
    }));
  };

  // Load address data when editing
  useEffect(() => {
    if (context.addressmode !== "edit" || !context.AddressId) {
      resetForm();
      return;
    }

    let isMounted = true;

    const loadAddress = async () => {
      setisLoading(true);

      try {
        const res = await fetchData(`/api/address/${context.AddressId}`, {
          withCredentials: true,
        });

        if (!isMounted) return;

        const data = res.data;

        setformfield({
          Address_line: data?.Address_line || "",
          City: data?.City || "",
          State: data?.State || "",
          Pincode: data?.Pincode || "",
          Country: data?.Country || "",
          Mobile: data?.Mobile || "",
          Address_Type: data?.Address_Type || "",
          landmark: data?.landmark || "",
        });

        setAddresstype(data?.Address_Type || "");
        setPhone(data?.Mobile || "");
      } catch (error) {
        if (isMounted) {
          context.Alertbox(
            "error",
            error?.response?.data?.message || "Unable to load address details",
          );
        }
      } finally {
        if (isMounted) setisLoading(false);
      }
    };

    loadAddress();

    return () => {
      isMounted = false;
    };
  }, [context.addressmode, context.AddressId]);

  // Validate form
  const validateForm = () => {
    const requiredFields = [
      ["Address_line", "Please provide your address"],
      ["City", "Please provide your city"],
      ["Mobile", "Please provide your mobile number"],
      ["State", "Please provide your state"],
      ["Pincode", "Please provide your pincode"],
      ["Country", "Please provide your country"],
      ["landmark", "Please provide your landmark"],
      ["Address_Type", "Please select your address type"],
    ];

    for (const [field, message] of requiredFields) {
      if (!String(formfield[field] || "").trim()) {
        context.Alertbox("error", message);
        return false;
      }
    }

    return true;
  };

  // Submit address
  const handlesubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validateForm()) return;

    setisLoading(true);

    try {
      let res;

      if (context.addressmode === "add") {
        res = await postData("/api/address/add", formfield, {
          withCredentials: true,
        });
      } else if (context.addressmode === "edit") {
        res = await editData(
          `/api/address/update/${context.AddressId}`,
          formfield,
          { withCredentials: true },
        );
      }

      if (!res || res.error === true) {
        context.Alertbox("error", res?.message || "Something went wrong");
        return;
      }

      context.Alertbox("success", res.message);

      await context.getuserDetails();

      resetForm();
      closePanel();
    } catch (error) {
      context.Alertbox(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save address",
      );
    } finally {
      setisLoading(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#ffffff",
      fontSize: "14px",
      "& fieldset": {
        borderColor: "#dfe3ec",
      },
      "&:hover fieldset": {
        borderColor: "#0f1f4b",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0f1f4b",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "13px",
      color: "#778197",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0f1f4b",
    },
  };

  const inputClass = "w-full";

  return (
    <form className="flex flex-col gap-5 p-5 sm:p-6" onSubmit={handlesubmit}>
      {/* Header */}
      <div className="border-b border-[#e8eaf0] pb-4">
        <h3 className="text-[17px] font-bold text-[#0f1f4b]">
          {context.addressmode === "edit"
            ? "Update Address"
            : "Add New Address"}
        </h3>

        <p className="mt-1 text-[12px] text-[#8790a3]">
          Enter your shipping details below.
        </p>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#0f1f4b]">
            Street Address
          </label>

          <TextField
            fullWidth
            name="Address_line"
            value={formfield.Address_line}
            onChange={onChangeInput}
            placeholder="Building, street, apartment..."
            disabled={isLoading}
            sx={inputStyles}
            size="medium"
          />
        </div>

        {/* Country and City */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#0f1f4b]">
              Country
            </label>

            <TextField
              fullWidth
              name="Country"
              value={formfield.Country}
              onChange={onChangeInput}
              placeholder="Country"
              disabled={isLoading}
              sx={inputStyles}
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#0f1f4b]">
              City
            </label>

            <TextField
              fullWidth
              name="City"
              value={formfield.City}
              onChange={onChangeInput}
              placeholder="City"
              disabled={isLoading}
              sx={inputStyles}
            />
          </div>
        </div>

        {/* State and Pincode */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#0f1f4b]">
              State / Governorate
            </label>

            <TextField
              fullWidth
              name="State"
              value={formfield.State}
              onChange={onChangeInput}
              placeholder="South Governorate"
              disabled={isLoading}
              sx={inputStyles}
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#0f1f4b]">
              Pincode
            </label>

            <TextField
              fullWidth
              name="Pincode"
              value={formfield.Pincode}
              onChange={onChangeInput}
              placeholder="Postal code"
              disabled={isLoading}
              sx={inputStyles}
            />
          </div>
        </div>

        {/* Phone and Landmark */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#0f1f4b]">
              Mobile Number
            </label>

            <PhoneInput
              defaultCountry="lb"
              value={phone}
              disabled={isLoading}
              onChange={(value) => {
                setPhone(value);

                setformfield((prev) => ({
                  ...prev,
                  Mobile: value,
                }));
              }}
              inputClassName="!w-full !h-[48px] !text-[13px] !border-0 !outline-none"
              countrySelectorStyleProps={{
                buttonClassName: "!h-[48px] !border-0 !bg-transparent",
              }}
              className="!w-full !h-[50px] !rounded-[10px] !border !border-[#dfe3ec] !bg-white focus-within:!border-[#0f1f4b]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#0f1f4b]">
              Landmark
            </label>

            <TextField
              fullWidth
              name="landmark"
              value={formfield.landmark}
              onChange={onChangeInput}
              placeholder="Nearby landmark"
              disabled={isLoading}
              sx={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* Address type */}
      <div className="rounded-xl border border-[#e8eaf0] p-4">
        <FormControl>
          <FormLabel
            sx={{
              color: "#0f1f4b",
              fontSize: "13px",
              fontWeight: 700,
              "&.Mui-focused": {
                color: "#0f1f4b",
              },
            }}
          >
            Address Type
          </FormLabel>

          <RadioGroup
            row
            value={Addresstype}
            onChange={onChangeAddresstype}
            sx={{
              mt: 1,
              gap: 2,
              "& .MuiRadio-root": {
                color: "#aab1c0",
              },
              "& .MuiRadio-root.Mui-checked": {
                color: "#8b0000",
              },
              "& .MuiFormControlLabel-label": {
                color: "#46516a",
                fontSize: "13px",
              },
            }}
          >
            <FormControlLabel
              value="Home"
              control={<Radio disabled={isLoading} />}
              label="Home"
            />

            <FormControlLabel
              value="Office"
              control={<Radio disabled={isLoading} />}
              label="Office"
            />
          </RadioGroup>
        </FormControl>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-[#e8eaf0] pt-5 sm:flex-row">
        <Button
          type="button"
          onClick={closePanel}
          disabled={isLoading}
          fullWidth
          className="!h-[48px] !rounded-lg !border !border-[#dfe3ec] !text-[13px] !font-semibold !normal-case !text-[#0f1f4b] hover:!bg-[#f5f6f9]"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          fullWidth
          className="!h-[48px] !rounded-lg !bg-[#0f1f4b] !text-[13px] !font-semibold !normal-case !text-white hover:!bg-[#8b0000] disabled:!bg-[#aab1c0]"
        >
          {isLoading ? (
            <CircularProgress size={21} sx={{ color: "#fff" }} />
          ) : context.addressmode === "edit" ? (
            "Update Address"
          ) : (
            "Save Address"
          )}
        </Button>
      </div>
    </form>
  );
}
