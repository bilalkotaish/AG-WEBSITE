import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteData } from "../../utils/api";
import { myContext } from "../../App";

export default function Addressmenu(props) {
  const context = useContext(myContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Edit address
  const editAddress = (id) => {
    handleCloseMenu();
    context.toggleaddressPanel(true)();
    context.setaddressmode("edit");
    context.setAddressId(id);
  };

  // Delete address
  const removeAddress = async (id) => {
    handleCloseMenu();

    try {
      const res = await deleteData(`/api/address/${id}`);

      context.Alertbox("success", res.message);
      await context.getuserDetails();
    } catch (error) {
      console.error("Failed to delete address:", error);
      context.Alertbox(
        "error",
        error?.response?.data?.message || "Failed to delete address",
      );
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Address options"
        aria-controls={open ? "address-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClickMenu}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#0f1f4b] transition-all duration-200 hover:bg-[#f1f3f8] hover:text-[#8b0000]"
      >
        <BsThreeDotsVertical className="text-[18px]" />
      </button>

      <Menu
        id="address-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              mt: 1,
              border: "1px solid #e8eaf0",
              borderRadius: "12px",
              boxShadow: "0 8px 30px rgba(15,31,75,0.10)",
              overflow: "hidden",
            },
          },
          list: {
            sx: {
              padding: "5px",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => editAddress(props.address._id)}
          sx={{
            display: "flex",
            gap: 1.5,
            py: 1.2,
            px: 1.5,
            borderRadius: "8px",
            fontSize: "13px",
            color: "#0f1f4b",
            "&:hover": {
              backgroundColor: "#f1f3f8",
            },
          }}
        >
          <FiEdit2 className="text-[16px]" />
          Edit Address
        </MenuItem>

        <MenuItem
          onClick={() => removeAddress(props.address._id)}
          sx={{
            display: "flex",
            gap: 1.5,
            py: 1.2,
            px: 1.5,
            borderRadius: "8px",
            fontSize: "13px",
            color: "#8b0000",
            "&:hover": {
              backgroundColor: "#fff1f1",
            },
          }}
        >
          <FiTrash2 className="text-[16px]" />
          Delete Address
        </MenuItem>
      </Menu>
    </>
  );
}
