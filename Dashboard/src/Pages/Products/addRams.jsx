import { Button, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { IoMdCloudUpload } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Mycontext } from "../../App";
import { postData, fetchData, deleteData, editData } from "../../utils/api";

export default function AddColors() {
  const [isLoading, setisLoading] = useState(false);
  const [color, setcolor] = useState([]);
  const [data, setData] = useState([]);
  const context = useContext(Mycontext);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    getColors();
  }, []);

  const getColors = () => {
    fetchData(`/api/product/getColors`)
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .catch((err) => console.error("Error fetching Colors:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setisLoading(true);
    if (editId !== "") {
      editData(`/api/product/updateColors/${editId}`, { color }).then((res) => {
        console.log(res);
        if (res.error === false) {
          setcolor("");
          getColors();
          setEditId("");
          context.Alertbox("success", res.message);
        } else {
          context.Alertbox("error", res.message);
        }
      });
    }
    if (editId === "") {
      if (color.trim() === "") {
        context.Alertbox("Please enter a Color value");
        setisLoading(false);
        return;
      }

      postData(`/api/product/AddColor`, { color })
        .then((res) => {
          console.log(res);
          if (res.error === false) {
            setcolor("");
            getColors();
            context.Alertbox("success", res.message);
          } else {
            context.Alertbox("error", res.message);
          }
        })
        .catch((err) => {
          console.error(err);
          context.Alertbox("Failed to add RAM");
        })
        .finally(() => {
          setisLoading(false);
        });
    }
  };

  const handleDelete = (id) => {
    deleteData(`/api/product/deleteColor/${id}`)
      .then((res) => {
        console.log(res);
        if (res.error === false) {
          getColors();
          context.Alertbox("success", res.message);
        } else {
          context.Alertbox("error", res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        context.Alertbox("error", "Failed to delete RAM");
      });
  };

  const handleEdit = (id) => {
    console.log("Edit RAM with ID:", id);
    setisLoading(true);
    setEditId(id);
    fetchData(`/api/product/getColors/${id}`)
      .then((res) => {
        console.log(res);
        if (res.error === false) {
          setcolor(res.data.color);
          context.Alertbox("success", res.message);
        } else {
          context.Alertbox("error", res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        context.Alertbox("error", "Failed to fetch Color data");
      })
      .finally(() => {
        setisLoading(false);
      });
  };
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 mt-6">
        <h1 className="text-xl font-bold mb-4 md:mb-0">Add Color</h1>
      </div>

      <div className="w-[80%] px-4 mt-4">
        <div className="w-full bg-white shadow-lg rounded-xl p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
              <label
                htmlFor="ram"
                className="text-sm font-medium text-gray-700 min-w-[100px]"
              >
                Color:
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={color}
                onChange={(e) => setcolor(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter RAM Value"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="!bg-primary !text-white items-center mt-4 w-full !pr-2 gap-2 !pl-12"
              >
                <IoMdCloudUpload className="text-[25px] " /> Publish Product
                Colors
                {isLoading === true && (
                  <CircularProgress color="inherit" size={20} />
                )}
              </Button>
            </div>
          </form>
        </div>
        <table className="min-w-full bg-white shadow-lg rounded-xl mt-6 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/2 px-6 py-2 text-left">Product Color Value</th>
              <th className="w-1/4 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500">
                  No Color data available
                </td>
              </tr>
            ) : (
              data.map((color, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="w-1/2 px-6 py-2 truncate items-center">
                    {color.color}
                  </td>
                  <td className="w-1/4 px-4 py-2">
                    <div className="flex items-center gap-3">
                      <AiTwotoneEdit
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleEdit(color._id)}
                      />
                      <MdOutlineDeleteOutline
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(color._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
