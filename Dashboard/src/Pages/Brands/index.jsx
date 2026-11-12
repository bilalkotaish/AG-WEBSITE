import { useContext, useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { MdDeleteOutline, MdEdit, MdImage } from "react-icons/md";
import { Mycontext } from "../../App";
import { deleteData, editData, fetchData, postData, UploadImages } from "../../utils/api";

const emptyForm = { name: "", image: null };

export default function Brands() {
  const context = useContext(Mycontext);
  const { setBrandData } = context;
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadBrands = async () => {
    const response = await fetchData("/api/brand");
    if (response.error || !Array.isArray(response.brands)) {
      context.Alertbox("error", response.message || "Could not load brands");
      return;
    }
    setBrandData(response.brands || []);
  };

  useEffect(() => {
    let active = true;
    fetchData("/api/brand").then((response) => {
      if (!active) return;
      if (response.error || !Array.isArray(response.brands)) {
        console.error("Could not load brands:", response.message);
        return;
      }
      setBrandData(response.brands);
    });
    return () => {
      active = false;
    };
  }, [setBrandData]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      context.Alertbox("error", "Choose a JPG, PNG, or WebP image");
      return;
    }

    const body = new FormData();
    body.append("images", file);
    setIsSaving(true);
    const response = await UploadImages("/api/product/uploadimage", body);
    setIsSaving(false);
    if (!response.images?.[0]) {
      context.Alertbox("error", response.message || "Brand image upload failed");
      return;
    }
    setForm((current) => ({ ...current, image: response.images[0] }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.image?.url) {
      context.Alertbox("error", "Brand name and image are required");
      return;
    }

    setIsSaving(true);
    const response = editingId
      ? await editData(`/api/brand/${editingId}`, form)
      : await postData("/api/brand", form);
    setIsSaving(false);

    if (response.error || !response.success) {
      context.Alertbox("error", response.message || "Could not save brand");
      return;
    }
    context.Alertbox("success", response.message);
    resetForm();
    await loadBrands();
  };

  const startEditing = (brand) => {
    setEditingId(brand._id);
    setForm({ name: brand.name, image: brand.image });
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Delete ${brand.name}?`)) return;
    const response = await deleteData(`/api/brand/${brand._id}`);
    if (response.error) {
      context.Alertbox("error", response.message || "Could not delete brand");
      return;
    }
    context.Alertbox("success", response.message);
    if (editingId === brand._id) resetForm();
    await loadBrands();
  };

  return (
    <main className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B0000]">
          Catalog management
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[#0F1F4B]">Brands</h1>
        <p className="mt-2 text-sm text-slate-500">
          Add brand logos and names to connect products and storefront discovery.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_auto] md:items-end"
      >
        <label className="block text-sm font-semibold text-slate-700">
          Brand name
          <input
            required
            maxLength={80}
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="e.g. Samsung"
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 font-normal outline-none focus:border-[#0F1F4B] focus:ring-2 focus:ring-[#0F1F4B]/10"
          />
        </label>

        <div>
          <span className="block text-sm font-semibold text-slate-700">
            Brand image
          </span>
          <label className="mt-2 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 text-sm text-slate-600 hover:border-[#0F1F4B]">
            {isSaving ? (
              <CircularProgress size={18} />
            ) : (
              <>
                <MdImage size={20} />
                {form.image ? "Replace image" : "Choose image"}
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleImageChange}
              disabled={isSaving}
            />
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isSaving}
            variant="contained"
            className="!min-h-11 !bg-[#0F1F4B] !normal-case"
          >
            {editingId ? "Save changes" : "Add brand"}
          </Button>
          {editingId && (
            <Button type="button" onClick={resetForm} className="!min-h-11 !normal-case">
              Cancel
            </Button>
          )}
        </div>

        {form.image?.url && (
          <img
            src={form.image.url}
            alt="Brand image preview"
            className="h-16 w-28 rounded-lg border border-slate-200 bg-white object-contain p-2 md:col-span-3"
          />
        )}
      </form>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {context.brandData.map((brand) => (
          <article
            key={brand._id}
            className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <img
              src={brand.image?.url}
              alt={`${brand.name} logo`}
              className="h-16 w-20 shrink-0 rounded-lg bg-slate-50 object-contain p-2"
            />
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-semibold text-slate-800">{brand.name}</h2>
              <div className="mt-2 flex gap-2">
                <Button
                  size="small"
                  onClick={() => startEditing(brand)}
                  startIcon={<MdEdit />}
                  className="!min-w-0 !px-2 !normal-case"
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(brand)}
                  startIcon={<MdDeleteOutline />}
                  className="!min-w-0 !px-2 !normal-case"
                >
                  Delete
                </Button>
              </div>
            </div>
          </article>
        ))}
        {context.brandData.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 sm:col-span-2 xl:col-span-4">
            No brands yet. Add the first brand above.
          </p>
        )}
      </section>
    </main>
  );
}
