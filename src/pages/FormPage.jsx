import React, { useState } from "react";
import {
  Building,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Upload,
  Save,
  ArrowRight,
  Loader2
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { uploadToCloudinary } from "../utils/cloudinary";
import * as XLSX from "xlsx";

// --- Constants ---
const PRIMARY_COLOR = "#0F40C5"; // Coral

// --- Helper Components ---

// Moved Input outside to prevent re-mounting (and focus loss) on every render
const Input = ({ label, name, type = "text", required = false, value, onChange, disabled }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F40C5]/20 focus:border-[#0F40C5] transition-all disabled:bg-gray-50 disabled:text-gray-400"
      placeholder={label}
    />
  </div>
);

export default function FormPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    integratorName: "",
    officeAddress: "",
    contactPerson: "",
    contactNo: "",
    email: "",
    customerProjectSite: "",
    customerContact: "",
    customerAlternate: "",
    customerEmail: "",
    customerAlternateEmail: ""
  });

  const [serialNumbers, setSerialNumbers] = useState([""]);
  const [previewImages, setPreviewImages] = useState([]);
  const [files, setFiles] = useState([]);

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSerialNumber = () => {
    setSerialNumbers([...serialNumbers, ""]);
  };

  const updateSerialNumber = (index, value) => {
    const updated = [...serialNumbers];
    updated[index] = value;
    setSerialNumbers(updated);
  };

  const removeSerialNumber = (index) => {
    if (serialNumbers.length > 1) {
      setSerialNumbers(serialNumbers.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setFiles(prev => [...prev, ...selectedFiles]);
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Extract serial numbers from the first column, filtering out empty values
        const newSerialNumbers = jsonData
          .map(row => row[0])
          .filter(cell => cell !== undefined && cell !== null && String(cell).trim() !== "");

        if (newSerialNumbers.length > 0) {
          // If the current list only has one empty entry, replace it. Otherwise append.
          setSerialNumbers(prev => {
            if (prev.length === 1 && prev[0] === "") {
              return newSerialNumbers.map(String);
            }
            return [...prev, ...newSerialNumbers.map(String)];
          });
        } else {
          alert("No valid serial numbers found in the first column of the Excel file.");
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        alert("Error parsing Excel file. Please ensure it is a valid Excel file.");
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset file input value to allow uploading the same file again if needed
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Upload Images to Cloudinary
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const uploadedImageUrls = await Promise.all(uploadPromises);

      // 2. Save Data to Firestore
      await addDoc(collection(db, "requests"), {
        ...formData,
        serialNumbers: serialNumbers.filter(s => s.trim()),
        sitePictures: uploadedImageUrls,
        status: "pending",
        createdAt: serverTimestamp()
      });

      console.log("Form Submitted Successfully");
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitted form:", error);
      alert("Submission failed: " + error.message);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      integratorName: "",
      officeAddress: "",
      contactPerson: "",
      contactNo: "",
      email: "",
      customerProjectSite: "",
      customerContact: "",
      customerAlternate: "",
      customerEmail: "",
      customerAlternateEmail: ""
    });
    setSerialNumbers([""]);
    setPreviewImages([]);
    setFiles([]);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">

      {/* --- Main Content --- */}
      {/* Dynamic styles removed in favor of Tailwind utility classes */}

      <main className="max-w-3xl mx-auto px-4 py-8">

        {isSubmitted ? (
          // --- Success State ---
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-100 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Request Submitted!</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Your installation verification request has been successfully sent to the admin team. We will review it shortly.
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold shadow-lg hover:brightness-110 transition-all"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              Submit Another Request
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          // --- Form State ---
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
            <div className="text-center mb-8 border-b border-gray-100 pb-6">
              <h1 className="text-2xl font-bold mb-2 text-slate-800">
                Installation Verification Form
              </h1>
              <p className="text-slate-500 text-sm">
                Please fill out the details below to verify your installation site.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Integrator Section */}
              <div className="md:col-span-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">1</span>
                Integrator Details
              </div>
              <Input
                label="Integrator / EPC Name"
                name="integratorName"
                required
                value={formData.integratorName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Office Address"
                name="officeAddress"
                required
                value={formData.officeAddress}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Contact Person"
                name="contactPerson"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Contact Number"
                name="contactNo"
                required
                value={formData.contactNo}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div className="md:col-span-2">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Customer Section */}
              <div className="md:col-span-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 mb-2 mt-6">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">2</span>
                Customer Details
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Project Site Address"
                  name="customerProjectSite"
                  required
                  value={formData.customerProjectSite}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <Input
                label="Site Contact Person"
                name="customerContact"
                required
                value={formData.customerContact}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Alternate Number"
                name="customerAlternate"
                value={formData.customerAlternate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Customer Email"
                name="customerEmail"
                type="email"
                required
                value={formData.customerEmail}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Alternate Email"
                name="customerAlternateEmail"
                type="email"
                value={formData.customerAlternateEmail}
                onChange={handleChange}
                disabled={isSubmitting}
              />

              {/* Serial Numbers */}
              <div className="md:col-span-2 mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Serial Number List <span className="text-red-500">*</span>
                </label>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  {serialNumbers.map((sn, index) => (
                    <div key={index} className="flex gap-2 animate-in slide-in-from-left-2 duration-200">
                      <input
                        type="text"
                        required
                        value={sn}
                        disabled={isSubmitting}
                        onChange={(e) => updateSerialNumber(index, e.target.value)}
                        placeholder={`e.g. SN-2024-${100 + index}`}
                        className="flex-grow rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F40C5]/20 focus:border-[#0F40C5] bg-white transition-all"
                      />
                      {serialNumbers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSerialNumber(index)}
                          className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                          disabled={isSubmitting}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-4 mt-2">
                    <button
                      type="button"
                      onClick={addSerialNumber}
                      disabled={isSubmitting}
                      className="text-sm hover:underline font-medium flex items-center gap-1 transition-colors"
                      style={{ color: PRIMARY_COLOR }}
                    >
                      <Plus size={16} /> Add another serial number
                    </button>

                    <label className="text-sm hover:underline font-medium flex items-center gap-1 transition-colors cursor-pointer" style={{ color: PRIMARY_COLOR }}>
                      <Upload size={16} /> Upload Excel
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleExcelUpload}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Site Pictures */}
              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Site Pictures (Evidence)
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative ${isSubmitting ? 'bg-gray-50 border-gray-200' : 'border-slate-300 hover:bg-slate-50 hover:border-slate-400'}`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <Upload size={24} className="text-slate-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (Max 5MB)</p>
                  </div>
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative group w-24 h-24 animate-in zoom-in duration-200">
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover rounded-lg border border-slate-200 shadow-sm"
                        />
                        {!isSubmitting && (
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="md:col-span-2 pt-6 mt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white px-6 py-4 rounded-xl shadow-lg hover:opacity-90 transition-all font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Submit Verification Request
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  By submitting this form, you certify that all information is accurate.
                </p>
              </div>
            </form>
          </div>
        )}
      </main>
    </div >
  );
}