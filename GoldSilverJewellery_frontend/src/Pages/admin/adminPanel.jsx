import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axios";


const CARD_STYLES = [
  { bg: "bg-amber-100", text: "text-amber-900" },
  { bg: "bg-slate-100", text: "text-slate-800" },
  { bg: "bg-rose-100",  text: "text-rose-900"  },
  { bg: "bg-stone-100", text: "text-stone-800" },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm shadow-lg border
      ${toast.type === "error" ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200"}`}>
      {toast.msg}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-9 h-9 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin" />
    </div>
  );
}

function Badge({ visible, onToggle }) {
  return (
    <button onClick={onToggle}
      className={`px-3 py-1 rounded-full text-xs font-semibold transition
        ${visible ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
      {visible ? "Visible" : "Hidden"}
    </button>
  );
}

// Breadcrumb trail at the top
function Breadcrumb({ steps }) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-1">
      {steps.map((step, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-amber-300 text-sm">›</span>}
          {step.onClick ? (
            <button onClick={step.onClick}
              className="px-3 py-1 rounded-lg text-sm text-amber-600 hover:text-amber-900 hover:bg-amber-50 transition">
              {step.label}
            </button>
          ) : (
            <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 font-semibold text-sm">
              {step.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

const cls = "border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 w-full bg-white";
function Label({ text }) { return <label className="text-xs font-semibold text-amber-800 uppercase tracking-wider">{text}</label>; }

function SaveCancel({ saving, editingId, onCancel, label }) {
  return (
    <div className="col-span-2 flex gap-3 pt-2">
      <button type="submit" disabled={saving}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition"
        style={{ background: "#7c4a1e" }}>
        {saving ? "Saving…" : editingId ? `Update ${label}` : `Create ${label}`}
      </button>
      <button type="button" onClick={onCancel}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-amber-200 text-amber-800 hover:bg-amber-50 transition">
        Cancel
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 1. COLLECTIONS PANEL
// ════════════════════════════════════════════════════════════════════════════
function CollectionsPanel({ onSelect, showToast }) {
  const EMPTY = { name: "", isVisible: true };
  const [list, setList]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState(EMPTY);

  const load = async () => {
    try {
      const { data } = await axiosInstance.get("/api/collections/admin/all");
      if (data.success) setList(data.data);
    } catch { showToast("Failed to load collections", "error"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const openNew  = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const openEdit = (c) => { setForm({ name: c.name, isVisible: c.isVisible }); setEditingId(c._id); setShowForm(true); };
  const cancel   = () => { setShowForm(false); setEditingId(null); };

  const onSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const url = editingId ? `/api/collections/${editingId}` : `/api/collections`;
      const { data } = await axiosInstance[editingId ? "put" : "post"](url, form);
      if (data.success) { showToast(editingId ? "Updated!" : "Created!"); cancel(); load(); }
      else showToast(data.message, "error");
    } catch (err) { showToast(err.response?.data?.message || "Error", "error"); }
    finally { setSaving(false); }
  };

  const toggleVis = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/api/collections/${id}/toggle-visibility`);
      if (data.success) { setList(p => p.map(c => c._id === id ? { ...c, isVisible: data.data.isVisible } : c)); showToast("Updated"); }
    } catch { showToast("Failed", "error"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete collection and ALL its data?")) return;
    try {
      const { data } = await axiosInstance.delete(`/api/collections/${id}`);
      if (data.success) { showToast("Deleted"); load(); }
    } catch (err) { showToast(err.response?.data?.message || "Error", "error"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-normal" style={{ color: "#2c1a0e" }}>Collections</h2>
          <p className="text-xs mt-0.5" style={{ color: "#8b6b4a" }}>Gold, Silver, Platinum…</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition" style={{ background: "#7c4a1e" }}>+ New Collection</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 mb-6">
          <h3 className="font-semibold mb-4" style={{ color: "#2c1a0e" }}>{editingId ? "Edit" : "New"} Collection</h3>
          <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1">
              <Label text="Name *" />
              <input name="name" value={form.name} onChange={onChange} required placeholder="e.g. Gold" className={cls} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="isVisible" id="col-vis" checked={form.isVisible} onChange={onChange} className="w-4 h-4 accent-amber-700" />
              <label htmlFor="col-vis" className="text-sm text-amber-900">Visible on storefront</label>
            </div>
            <SaveCancel saving={saving} editingId={editingId} onCancel={cancel} label="Collection" />
          </form>
        </div>
      )}

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-2 gap-4">
          {list.map((col, i) => {
            const s = CARD_STYLES[i % CARD_STYLES.length];
            return (
              <div key={col._id} className={`${s.bg} rounded-2xl p-5 flex flex-col gap-3 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <p className={`font-bold text-xl ${s.text}`}>{col.name}</p>
                  <Badge visible={col.isVisible} onToggle={() => toggleVis(col._id)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => onSelect(col)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/80 hover:bg-white text-amber-900 transition">📂 Categories</button>
                  <button onClick={() => openEdit(col)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/60 border border-white/60 text-amber-800 hover:bg-white transition">Edit</button>
                  <button onClick={() => del(col._id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/60 border border-red-200 text-red-600 hover:bg-red-50 transition">Delete</button>
                </div>
              </div>
            );
          })}
          {list.length === 0 && <div className="col-span-2 text-center py-16 text-amber-400"><p className="text-4xl mb-2">💎</p><p>No collections yet.</p></div>}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. CATEGORIES PANEL
// ════════════════════════════════════════════════════════════════════════════
function CategoriesPanel({ collection, onSelect, onBack, showToast }) {
  const EMPTY = { name: "", label: "", isVisible: true, order: 0 };
  const [list, setList]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState("");
  const [existing, setExisting]   = useState("");
  const fileRef                   = useRef(null);

  const load = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/categories/admin/by-collection/${collection._id}`);
      if (data.success) setList(data.data);
    } catch { showToast("Failed to load", "error"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [collection._id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const onFile  = (e) => { const f = e.target.files[0]; if (!f) return; setImageFile(f); setPreview(URL.createObjectURL(f)); };
  const clearImg = () => { setImageFile(null); setPreview(""); setExisting(""); if (fileRef.current) fileRef.current.value = ""; };
  const openNew  = () => { setForm(EMPTY); setImageFile(null); setPreview(""); setExisting(""); setEditingId(null); setShowForm(true); };
  const openEdit = (c) => { setForm({ name: c.name, label: c.label, isVisible: c.isVisible, order: c.order }); setImageFile(null); setPreview(""); setExisting(c.imageUrl || ""); setEditingId(c._id); setShowForm(true); };
  const cancel   = () => { setShowForm(false); setEditingId(null); setImageFile(null); setPreview(""); setExisting(""); };

  const onSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      fd.append("collectionId", collection._id);
      fd.append("name",       form.name);
      fd.append("label",      form.label);
      fd.append("isVisible",  String(form.isVisible));
      fd.append("order",      String(form.order));
      if (imageFile) fd.append("image", imageFile);
      const url = editingId ? `/api/categories/${editingId}` : `/api/categories`;
      const { data } = await axiosInstance[editingId ? "put" : "post"](url, fd);
      if (data.success) { showToast(editingId ? "Updated!" : "Created!"); cancel(); load(); }
      else showToast(data.message, "error");
    } catch (err) { showToast(err.response?.data?.message || "Error", "error"); }
    finally { setSaving(false); }
  };

  const toggleVis = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/api/categories/${id}/toggle-visibility`);
      if (data.success) { setList(p => p.map(c => c._id === id ? { ...c, isVisible: data.data.isVisible } : c)); showToast("Updated"); }
    } catch { showToast("Failed", "error"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete category and all its subcategories & products?")) return;
    try {
      const { data } = await axiosInstance.delete(`/api/categories/${id}`);
      if (data.success) { showToast("Deleted"); load(); }
    } catch (err) { showToast(err.response?.data?.message || "Error", "error"); }
  };

  const imgSrc = preview || existing;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={onBack} className="px-3 py-1.5 rounded-xl text-sm border border-amber-200 text-amber-700 hover:bg-amber-50 transition">← Back</button>
        <div>
          <Breadcrumb steps={[{ label: "Collections", onClick: onBack }, { label: collection.name }]} />
          <p className="text-xs" style={{ color: "#8b6b4a" }}>Chains, Earrings, Bangles…</p>
        </div>
        <button onClick={openNew} className="ml-auto px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition" style={{ background: "#7c4a1e" }}>+ New Category</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 mb-6">
          <h3 className="font-semibold mb-4" style={{ color: "#2c1a0e" }}>{editingId ? "Edit" : "New"} Category under "{collection.name}"</h3>
          <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label text="Name *" />
              <input name="name" value={form.name} onChange={onChange} required placeholder="Chains" className={cls} />
            </div>
            <div className="flex flex-col gap-1">
              <Label text="Label *" />
              <input name="label" value={form.label} onChange={onChange} required placeholder="Elegant" className={cls} />
            </div>
           <div className="col-span-2 flex flex-col gap-2">
  <Label text="Category Image" />
  {imgSrc && (
    <div className="flex items-center gap-3">
      <img src={imgSrc} alt="preview" className="w-20 h-20 rounded-xl object-cover border border-amber-200" />
      <div>
        {imageFile ? <p className="text-xs text-green-600 font-medium">✓ {imageFile.name}</p>
                   : <p className="text-xs text-amber-500">Current image · upload to replace</p>}
        <button type="button" onClick={clearImg} className="text-xs text-red-400 hover:underline mt-1">Remove</button>
      </div>
    </div>
  )}
  <label htmlFor="cat-img" className="flex flex-col items-center justify-center border-2 border-dashed border-amber-200 rounded-xl py-5 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition">
    <span className="text-2xl mb-1">📷</span>
    <span className="text-sm font-medium text-amber-700">{imageFile ? "Change image" : "Click to upload"}</span>
    <span className="text-xs text-amber-400 mt-0.5">JPG, PNG, WEBP · max 5 MB</span>
  </label>
  <input id="cat-img" ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
</div>
            <div className="flex flex-col gap-1">
              <Label text="Order" />
              <input type="number" name="order" value={form.order} onChange={onChange} min={0} className={cls} />
            </div>
            <div className="flex items-center gap-3 mt-5">
              <input type="checkbox" name="isVisible" id="cat-vis" checked={form.isVisible} onChange={onChange} className="w-4 h-4 accent-amber-700" />
              <label htmlFor="cat-vis" className="text-sm text-amber-900">Visible on storefront</label>
            </div>
            {/* Live preview */}
            <div className="col-span-2">
              <Label text="Card Preview" />
              <div className=' mt-2 rounded-3xl flex items-center justify-between px-6 py-4 max-w-xs shadow-sm'>
                <div className="text-black">
                  <p className="text-xs opacity-70">{form.label || "Label"}</p>
                  <p className="text-base font-bold">{form.name || "Name"}</p>
                </div>
                {imgSrc && <img src={imgSrc} alt="" className="w-14 h-14 rounded-xl object-cover" />}
              </div>
            </div>
            <SaveCancel saving={saving} editingId={editingId} onCancel={cancel} label="Category" />
          </form>
        </div>
      )}

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-amber-100">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#fdf3e3" }}>
                {["Preview", "Name / Label", "Order", "Visible", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-amber-800 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(cat => (
                <tr key={cat._id} className={`border-t border-amber-50 hover:bg-amber-50/40 transition ${!cat.isVisible ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3">
                    <div className='rounded-xl flex items-center gap-2 px-3 py-2 w-36'>
                      {cat.imageUrl && <img src={cat.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />}
                      <div className="text-black">
                        <p className="text-[10px] opacity-70">{cat.label}</p>
                        <p className="text-xs font-bold">{cat.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><p className="font-semibold text-amber-900">{cat.name}</p><p className="text-xs text-amber-500">{cat.label}</p></td>
                  <td className="px-5 py-3 text-amber-700">{cat.order}</td>
                  <td className="px-5 py-3"><Badge visible={cat.isVisible} onToggle={() => toggleVis(cat._id)} /></td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => onSelect(cat)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition">📂 SubCategories</button>
                      <button onClick={() => openEdit(cat)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-200 text-amber-800 hover:bg-amber-50 transition">Edit</button>
                      <button onClick={() => del(cat._id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-amber-300">No categories yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. SUBCATEGORIES PANEL
// ════════════════════════════════════════════════════════════════════════════
function SubCategoriesPanel({ collection, category, onSelectSub, onAddProduct, onBack, showToast }) {
  const EMPTY = { name: "", label: "",  isVisible: true};
  const [list, setList]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState("");
  const [existing, setExisting]   = useState("");
  const fileRef                   = useRef(null);

  const load = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/subcategories/admin/by-category/${category._id}`);
      if (data.success) setList(data.data);
    } catch { showToast("Failed to load", "error"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [category._id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const onFile   = (e) => { const f = e.target.files[0]; if (!f) return; setImageFile(f); setPreview(URL.createObjectURL(f)); };
  const clearImg = () => { setImageFile(null); setPreview(""); setExisting(""); if (fileRef.current) fileRef.current.value = ""; };
  const openNew  = () => { setForm(EMPTY); setImageFile(null); setPreview(""); setExisting(""); setEditingId(null); setShowForm(true); };
  const openEdit = (s) => { setForm({ name: s.name, label: s.label || "", isVisible: s.isVisible }); setImageFile(null); setPreview(""); setExisting(s.imageUrl || ""); setEditingId(s._id); setShowForm(true); };
  const cancel   = () => { setShowForm(false); setEditingId(null); setImageFile(null); setPreview(""); setExisting(""); };

  const onSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      fd.append("collectionId", collection._id);
      fd.append("categoryId",   category._id);
      fd.append("name",         form.name);
      fd.append("label",        form.label);
      fd.append("isVisible",    String(form.isVisible));
      if (imageFile) fd.append("image", imageFile);
      const url = editingId ? `/api/subcategories/${editingId}` : `/api/subcategories`;
      const { data } = await axiosInstance[editingId ? "put" : "post"](url, fd);
      if (data.success) { showToast(editingId ? "Updated!" : "Created!"); cancel(); load(); }
      else showToast(data.message, "error");
    } catch (err) { showToast(err.response?.data?.message || "Error", "error"); }
    finally { setSaving(false); }
  };

  const toggleVis = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/api/subcategories/${id}/toggle-visibility`);
      if (data.success) { setList(p => p.map(s => s._id === id ? { ...s, isVisible: data.data.isVisible } : s)); showToast("Updated"); }
    } catch { showToast("Failed", "error"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete subcategory and its products?")) return;
    try {
      const { data } = await axiosInstance.delete(`/api/subcategories/${id}`);
      if (data.success) { showToast("Deleted"); load(); }
    } catch (err) { showToast(err.response?.data?.message || "Error", "error"); }
  };

  const imgSrc = preview || existing;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={onBack} className="px-3 py-1.5 rounded-xl text-sm border border-amber-200 text-amber-700 hover:bg-amber-50 transition">← Back</button>
        <div>
          <Breadcrumb steps={[
            { label: "Collections", onClick: () => { onBack(); onBack(); } },
            { label: collection.name, onClick: onBack },
            { label: category.name },
          ]} />
          <p className="text-xs" style={{ color: "#8b6b4a" }}>Lightweight Chains, Ball Chains…</p>
        </div>
        <div className="ml-auto flex gap-2">
          {/* Add products directly to this category (no subcategory) */}
          <button onClick={() => onAddProduct(null)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-amber-300 text-amber-800 hover:bg-amber-50 transition">
            📦 Add Product to Category
          </button>
          <button onClick={openNew}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
            style={{ background: "#7c4a1e" }}>
            + New SubCategory
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 mb-6">
          <h3 className="font-semibold mb-4" style={{ color: "#2c1a0e" }}>{editingId ? "Edit" : "New"} SubCategory under "{category.name}"</h3>
          <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label text="Name *" />
              <input name="name" value={form.name} onChange={onChange} required placeholder="e.g. Lightweight Chains" className={cls} />
            </div>
            <div className="flex flex-col gap-1">
              <Label text="Label" />
              <input name="label" value={form.label} onChange={onChange} placeholder="e.g. Delicate" className={cls} />
            </div>
           <div className="col-span-2 flex flex-col gap-2">
  <Label text="SubCategory Image" />
  {imgSrc && (
    <div className="flex items-center gap-3">
      <img src={imgSrc} alt="preview" className="w-20 h-20 rounded-xl object-cover border border-amber-200" />
      <div>
        {imageFile ? <p className="text-xs text-green-600 font-medium">✓ {imageFile.name}</p>
                   : <p className="text-xs text-amber-500">Current image · upload to replace</p>}
        <button type="button" onClick={clearImg} className="text-xs text-red-400 hover:underline mt-1">Remove</button>
      </div>
    </div>
  )}
  <label htmlFor="sub-img" className="flex flex-col items-center justify-center border-2 border-dashed border-amber-200 rounded-xl py-5 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition">
    <span className="text-2xl mb-1">📷</span>
    <span className="text-sm font-medium text-amber-700">{imageFile ? "Change image" : "Click to upload"}</span>
    <span className="text-xs text-amber-400 mt-0.5">JPG, PNG, WEBP · max 5 MB</span>
  </label>
  <input id="sub-img" ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
</div>
            <div className="flex items-center gap-3 mt-5">
              <input type="checkbox" name="isVisible" id="sub-vis" checked={form.isVisible} onChange={onChange} className="w-4 h-4 accent-amber-700" />
              <label htmlFor="sub-vis" className="text-sm text-amber-900">Visible on storefront</label>
            </div>
            {/* Live preview */}
            <div className="col-span-2">
              <Label text="Card Preview" />
              <div className='mt-2 rounded-3xl flex items-center justify-between px-6 py-4 max-w-xs shadow-sm'>
                <div className="text-black">
                  <p className="text-xs opacity-70">{form.label || "Label"}</p>
                  <p className="text-base font-bold">{form.name || "Name"}</p>
                </div>
                {imgSrc && <img src={imgSrc} alt="" className="w-14 h-14 rounded-xl object-cover" />}
              </div>
            </div>
            <SaveCancel saving={saving} editingId={editingId} onCancel={cancel} label="SubCategory" />
          </form>
        </div>
      )}

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-amber-100">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#fdf3e3" }}>
                {["Preview", "Name / Label","Visible", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-amber-800 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(sub => (
                <tr key={sub._id} className={`border-t border-amber-50 hover:bg-amber-50/40 transition ${!sub.isVisible ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3">
                    <div className='rounded-xl flex items-center gap-2 px-3 py-2 w-36'>
                      {sub.imageUrl && <img src={sub.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />}
                      <div className="text-black">
                        <p className="text-[10px] opacity-70">{sub.label}</p>
                        <p className="text-xs font-bold">{sub.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><p className="font-semibold text-amber-900">{sub.name}</p><p className="text-xs text-amber-500">{sub.label}</p></td>
                  <td className="px-5 py-3 text-amber-700">{sub.order}</td>
                  <td className="px-5 py-3"><Badge visible={sub.isVisible} onToggle={() => toggleVis(sub._id)} /></td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => onSelectSub(sub)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition">📦 Products</button>
                      <button onClick={() => openEdit(sub)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-200 text-amber-800 hover:bg-amber-50 transition">Edit</button>
                      <button onClick={() => del(sub._id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-amber-300">No subcategories yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. PRODUCTS PANEL
// subCategory is null when product belongs directly to a category
// ════════════════════════════════════════════════════════════════════════════
function ProductsPanel({ collection, category, subCategory, onBack, showToast }) {
  const EMPTY = { name: "", label: "", productCode: "", weight: "", price: "", isVisible: true, isFeatured: false, isBestseller: false };
  const [list, setList]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [saving, setSaving]           = useState(false);
  const [form, setForm]               = useState(EMPTY);
  const [newFiles, setNewFiles]       = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [keepImages, setKeepImages]   = useState([]);
  const fileRef                       = useRef(null);

  const apiUrl = subCategory
    ? `/api/products/admin/by-subcategory/${subCategory._id}`
    : `/api/products/admin/by-category/${category._id}`;

  const load = async () => {
    try {
      const { data } = await axiosInstance.get(apiUrl);
      if (data.success) setList(data.data);
    } catch { showToast("Failed to load", "error"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [apiUrl]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const onFiles = (e) => {
    const picked = Array.from(e.target.files);
    if (keepImages.length + newFiles.length + picked.length > 5) { showToast("Max 5 images", "error"); return; }
    setNewFiles(p => [...p, ...picked]);
    setNewPreviews(p => [...p, ...picked.map(f => URL.createObjectURL(f))]);
    if (fileRef.current) fileRef.current.value = "";
  };
  const removeNew      = (i) => { setNewFiles(p => p.filter((_, j) => j !== i)); setNewPreviews(p => p.filter((_, j) => j !== i)); };
  const removeExisting = (url) => setKeepImages(p => p.filter(u => u !== url));
  const totalImgs      = keepImages.length + newFiles.length;

  const openNew  = () => { setForm(EMPTY); setNewFiles([]); setNewPreviews([]); setKeepImages([]); setEditingId(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ name: p.name, label: p.label || "", productCode: p.productCode || "", weight: p.weight || "", price: p.price, isVisible: p.isVisible, isFeatured: p.isFeatured, isBestseller: p.isBestseller }); setNewFiles([]); setNewPreviews([]); setKeepImages(p.images || []); setEditingId(p._id); setShowForm(true); };
  const cancel   = () => { setShowForm(false); setEditingId(null); setNewFiles([]); setNewPreviews([]); setKeepImages([]); };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (totalImgs === 0) { showToast("Upload at least 1 image", "error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("collectionId",  collection._id);
      fd.append("categoryId",    category._id);
      // subCategoryId only if product is under a subcategory
      fd.append("subCategoryId", subCategory ? subCategory._id : "");
      fd.append("name",          form.name);
      fd.append("label",         form.label);
      fd.append("productCode",   form.productCode);
      fd.append("weight",        form.weight);
      fd.append("price",         form.price);
      fd.append("isVisible",     String(form.isVisible));
      fd.append("isFeatured",    String(form.isFeatured));
      fd.append("isBestseller",  String(form.isBestseller));
      if (editingId) fd.append("keepImages", JSON.stringify(keepImages));
      newFiles.forEach(f => fd.append("images", f));
      const url = editingId ? `/api/products/${editingId}` : `/api/products`;
      const { data } = await axiosInstance[editingId ? "put" : "post"](url, fd);
      if (data.success) { showToast(editingId ? "Updated!" : "Created!"); cancel(); load(); }
      else showToast(data.message, "error");
    } catch (err) { showToast(err.response?.data?.message || "Error", "error"); }
    finally { setSaving(false); }
  };

  const toggleVis = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/api/products/${id}/toggle-visibility`);
      if (data.success) { setList(p => p.map(x => x._id === id ? { ...x, isVisible: data.data.isVisible } : x)); showToast("Updated"); }
    } catch { showToast("Failed", "error"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const { data } = await axiosInstance.delete(`/api/products/${id}`);
      if (data.success) { showToast("Deleted"); load(); }
    } catch (err) { showToast(err.response?.data?.message || "Error", "error"); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={onBack} className="px-3 py-1.5 rounded-xl text-sm border border-amber-200 text-amber-700 hover:bg-amber-50 transition">← Back</button>
        <div>
          <Breadcrumb steps={[
            { label: collection.name },
            { label: category.name, onClick: onBack },
            subCategory ? { label: subCategory.name } : { label: "Direct Products" },
          ]} />
          <p className="text-xs mt-0.5" style={{ color: "#8b6b4a" }}>
            {list.length} product{list.length !== 1 ? "s" : ""}
            {subCategory ? ` in "${subCategory.name}"` : ` directly in "${category.name}"`}
          </p>
        </div>
        <button onClick={openNew} className="ml-auto px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition" style={{ background: "#7c4a1e" }}>+ New Product</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 mb-6">
          <h3 className="font-semibold mb-4" style={{ color: "#2c1a0e" }}>
            {editingId ? "Edit" : "New"} Product in "{subCategory ? subCategory.name : category.name}"
          </h3>
          <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1">
              <Label text="Product Name *" />
              <input name="name" value={form.name} onChange={onChange} required placeholder="e.g. 22K Gold Rope Chain" className={cls} />
            </div>
            <div className="flex flex-col gap-1">
              <Label text="Label / Tag" />
              <input name="label" value={form.label} onChange={onChange} placeholder="New Arrival" className={cls} />
            </div>
            <div className="flex flex-col gap-1">
              <Label text="Product Code (SKU)" />
              <input name="productCode" value={form.productCode} onChange={onChange} placeholder="GLD-CH-001" className={cls} />
            </div>
            <div className="flex flex-col gap-1">
              <Label text="Weight" />
              <input name="weight" value={form.weight} onChange={onChange} placeholder="8.5g" className={cls} />
            </div>
            <div className="flex flex-col gap-1">
              <Label text="Price (₹) *" />
              <input name="price" value={form.price} onChange={onChange} required placeholder="45000" className={cls} />
            </div>

            {/* Multi-image upload */}
            <div className="col-span-2 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label text={`Images (${totalImgs}/5)`} />
                {totalImgs >= 5 && <span className="text-xs text-red-400">Max 5 reached</span>}
              </div>
              {keepImages.length > 0 && (
                <div>
                  <p className="text-xs text-amber-600 mb-1">Saved — hover to remove</p>
                  <div className="flex gap-2 flex-wrap">
                    {keepImages.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt="" className="w-20 h-20 rounded-xl object-cover border border-amber-200" />
                        <button type="button" onClick={() => removeExisting(url)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {newPreviews.length > 0 && (
                <div>
                  <p className="text-xs text-green-600 mb-1">New images</p>
                  <div className="flex gap-2 flex-wrap">
                    {newPreviews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} alt="" className="w-20 h-20 rounded-xl object-cover border border-green-200" />
                        <button type="button" onClick={() => removeNew(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {totalImgs < 5 && (
                <label htmlFor="prod-imgs" className="flex flex-col items-center justify-center border-2 border-dashed border-amber-200 rounded-xl py-5 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition">
                  <span className="text-2xl mb-1">🖼️</span>
                  <span className="text-sm font-medium text-amber-700">Click to add images</span>
                  <span className="text-xs text-amber-400 mt-0.5">{5 - totalImgs} slot{5 - totalImgs !== 1 ? "s" : ""} remaining</span>
                </label>
              )}
              <input id="prod-imgs" ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
            </div>

            <div className="col-span-2 flex flex-wrap gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isVisible" checked={form.isVisible} onChange={onChange} className="w-4 h-4 accent-amber-700" /><span className="text-sm text-amber-900">Visible</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={onChange} className="w-4 h-4 accent-amber-700" /><span className="text-sm text-amber-900">⭐ Featured</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isBestseller" checked={form.isBestseller} onChange={onChange} className="w-4 h-4 accent-amber-700" /><span className="text-sm text-amber-900">🔥 Bestseller</span></label>
            </div>
            <SaveCancel saving={saving} editingId={editingId} onCancel={cancel} label="Product" />
          </form>
        </div>
      )}

      {loading ? <Spinner /> : (
        <div className="grid gap-4">
          {list.map(prod => (
            <div key={prod._id} className={`bg-white rounded-2xl shadow-sm border border-amber-100 p-5 flex gap-4 ${!prod.isVisible ? "opacity-60" : ""}`}>
              <div className="flex-shrink-0">
                {prod.images?.[0] ? <img src={prod.images[0]} alt="" className="w-24 h-24 rounded-xl object-cover border border-amber-100" /> : <div className="w-24 h-24 rounded-xl bg-amber-50 flex items-center justify-center text-4xl">💍</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-amber-900">{prod.name}</p>
                    {prod.label && <p className="text-xs text-amber-500 mt-0.5">{prod.label}</p>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {prod.isBestseller && <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-600 font-semibold">🔥</span>}
                    {prod.isFeatured   && <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 font-semibold">⭐</span>}
                    <Badge visible={prod.isVisible} onToggle={() => toggleVis(prod._id)} />
                  </div>
                </div>
                <div className="flex gap-4 mt-2 flex-wrap text-xs text-amber-700">
                  <span className="font-semibold text-sm text-amber-900">₹{prod.price}</span>
                  {prod.weight      && <span>⚖ {prod.weight}</span>}
                  {prod.productCode && <span>SKU: {prod.productCode}</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(prod)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-200 text-amber-800 hover:bg-amber-50 transition">Edit</button>
                  <button onClick={() => del(prod._id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition">Delete</button>
                </div>
              </div>
              {prod.images?.length > 1 && (
                <div className="flex-shrink-0 flex flex-col gap-1">
                  {prod.images.slice(1, 5).map((img, i) => <img key={i} src={img} alt="" className="w-10 h-10 rounded-lg object-cover border border-amber-100" />)}
                </div>
              )}
            </div>
          ))}
          {list.length === 0 && (
            <div className="text-center py-20 text-amber-300 bg-white rounded-2xl border border-amber-100">
              <p className="text-5xl mb-2">💍</p><p>No products yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT — manages navigation between all 4 levels
// ════════════════════════════════════════════════════════════════════════════
export default function AdminPanel() {
  const [view, setView]                   = useState("collections");
  const [selCollection, setSelCollection] = useState(null);
  const [selCategory, setSelCategory]     = useState(null);
  const [selSubCategory, setSelSubCategory] = useState(null); // null = direct to category
  const [toast, setToast]                 = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const goCollections  = () => { setView("collections"); setSelCollection(null); setSelCategory(null); setSelSubCategory(null); };
  const goCategories   = (col) => { setSelCollection(col); setView("categories"); };
  const goSubCategories = (cat) => { setSelCategory(cat); setView("subcategories"); };
  // subCat = null means products are added directly to a category (no subcategory)
  const goProducts     = (subCat) => { setSelSubCategory(subCat); setView("products"); };
  const backToSubs     = () => { setView("subcategories"); setSelSubCategory(null); };
  const backToCats     = () => { setView("categories"); setSelCategory(null); setSelSubCategory(null); };

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: "#faf8f5", fontFamily: "'Georgia', serif" }}>
      <Toast toast={toast} />
      <div className="max-w-5xl mx-auto">

        {/* Top nav */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-2xl">💎</span>
          <span className="font-bold text-amber-900 text-xl">Jewellery Admin</span>
          <span className="text-amber-200 mx-2 text-xl">|</span>
          <button onClick={goCollections} className={`px-3 py-1.5 rounded-lg text-sm transition ${view === "collections" ? "bg-amber-100 text-amber-900 font-semibold" : "text-amber-500 hover:text-amber-900"}`}>Collections</button>
          {selCollection && (<><span className="text-amber-300">›</span><button onClick={() => goCategories(selCollection)} className={`px-3 py-1.5 rounded-lg text-sm transition ${view === "categories" ? "bg-amber-100 text-amber-900 font-semibold" : "text-amber-500 hover:text-amber-900"}`}>{selCollection.name}</button></>)}
          {selCategory   && (<><span className="text-amber-300">›</span><button onClick={() => goSubCategories(selCategory)} className={`px-3 py-1.5 rounded-lg text-sm transition ${view === "subcategories" ? "bg-amber-100 text-amber-900 font-semibold" : "text-amber-500 hover:text-amber-900"}`}>{selCategory.name}</button></>)}
          {view === "products" && (<><span className="text-amber-300">›</span><span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 font-semibold text-sm">{selSubCategory ? selSubCategory.name : "Direct Products"}</span></>)}
        </div>

        {view === "collections"  && <CollectionsPanel onSelect={goCategories} showToast={showToast} />}
        {view === "categories"   && selCollection && <CategoriesPanel collection={selCollection} onSelect={goSubCategories} onBack={goCollections} showToast={showToast} />}
        {view === "subcategories"&& selCollection && selCategory && (
          <SubCategoriesPanel
            collection={selCollection}
            category={selCategory}
            onSelectSub={goProducts}
            onAddProduct={goProducts}   // goProducts(null) = direct to category
            onBack={backToCats}
            showToast={showToast}
          />
        )}
        {view === "products" && selCollection && selCategory && (
          <ProductsPanel
            collection={selCollection}
            category={selCategory}
            subCategory={selSubCategory}  // null if direct to category
            onBack={backToSubs}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
}