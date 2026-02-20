import React, { useEffect, useState } from "react";
// import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MapPin,
  User,
  Phone,
  Mail,
  Building,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Hash,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { collection, query, getDocs, orderBy, doc, updateDoc, where, limit, startAfter, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { logAdminAction, generateDocument, sendRejectionEmail } from "../services/api";


export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set()); // Track selected IDs
  const navigate = useNavigate();

  // --- Theme Constants ---
  const PRIMARY_COLOR = "#0F40C5"; // Coral
  const ITEMS_PER_PAGE = 20;

  const fetchRequests = async (isNextPage = false) => {
    try {
      if (isNextPage) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let q;
      const collectionRef = collection(db, "requests");

      if (filter !== "all") {
        q = query(
          collectionRef,
          where("status", "==", filter),
          orderBy("createdAt", "desc"),
          limit(ITEMS_PER_PAGE)
        );
      } else {
        q = query(
          collectionRef,
          orderBy("createdAt", "desc"),
          limit(ITEMS_PER_PAGE)
        );
      }

      if (isNextPage && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      setHasMore(querySnapshot.docs.length >= ITEMS_PER_PAGE);
      if (lastVisible) setLastDoc(lastVisible);

      if (isNextPage) {
        setRequests(prev => [...prev, ...data]);
      } else {
        setRequests(data);
        setSelectedIds(new Set()); // Clear selection on new filter/load
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setRequests([]);
    setLastDoc(null);
    setHasMore(true);
    fetchRequests(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // ================= SELECTION LOGIC =================
  const toggleSelect = (id, status) => {
    if (status !== "pending" && !selectedIds.has(id)) return; // Allow deselecting, but prevention selection of non-pending

    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBulkAccept = async () => {
    if (selectedIds.size === 0) return;

    const count = selectedIds.size;
    const idsToProcess = Array.from(selectedIds);

    const currentUser = auth.currentUser;
    const adminEmail = currentUser ? currentUser.email : "unknown_admin";


    // Optimistic UI update for all
    setRequests(prev => prev.map(req =>
      idsToProcess.includes(req.id) && req.certificateIssueDate && req.warrantyCertificateNo && req.premierInvoiceNo && req.productDescription ? { ...req, status: "accepted" } : req
    ));

    // Clear selection
    setSelectedIds(new Set());

    toast.success(`Processing requests...`);

    // Process each one by one (Sequential)
    for (const id of idsToProcess) {
      const req = requests.find(r => r.id === id);
      if (!req) continue;
      if (req.certificateIssueDate && req.warrantyCertificateNo && req.premierInvoiceNo && req.productDescription) {
        try {
          await updateDoc(doc(db, "requests", id), { status: "accepted" });
          // Wait for doc generation/email to complete before moving to next
          await generateDocx(req, async () => {
            // Error callback
            console.warn(`Background process failed for ${id}, reverting...`);
            await handleAction(id, "pending");
            toast.error(`Failed to process request for ${req.integratorName}, reverted.`);
          }).then(async () => {
            toast.success(`Request processed successfully for ${req.warrantyCertificateNo}`);
            try {
              await logAdminAction(adminEmail, "BULK ACCEPTED", {
                warrantyCertificateNo: req.warrantyCertificateNo,
                integratorName: req.integratorName,
                reason: "Bulk Accept"
              });
            } catch (logErr) {
              console.error("Failed to post admin log:", logErr);
            }
          });

        } catch (err) {
          console.error("Bulk update error:", err);
          toast.error(`Failed to update ${req.warrantyCertificateNo}`);
          await updateDoc(doc(db, "requests", id), { status: "pending" });
        }
      } else {
        toast.error(`Please fill all the fields for ${req.warrantyCertificateNo}`);
      }

    }
  };


  // ================= UPDATE STATUS =================
  const handleAction = async (id, action, reason = null) => {
    // We need to know who is acting, use the auth instance
    const currentUser = auth.currentUser;
    const adminEmail = currentUser ? currentUser.email : "unknown_admin";

    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: action } : req
      )
    );

    try {
      const ref = doc(db, "requests", id);
      const updateData = { status: action };
      if (reason) updateData.rejectionReason = reason;

      if (action === "pending") {
        // This handles the "revert" case specifically to ensure backend matches UI if we reverted
        await updateDoc(ref, { status: "pending" });
      } else {
        await updateDoc(ref, updateData);

        // Find the request details for logging
        const reqDetail = requests.find(r => r.id === id);
        if (reqDetail && action !== "pending") {
          try {
            await logAdminAction(adminEmail, action.toUpperCase(), {
              warrantyCertificateNo: reqDetail.warrantyCertificateNo,
              integratorName: reqDetail.integratorName,
              reason: reason || null
            });
          } catch (logErr) {
            console.error("Failed to post admin log:", logErr);
          }
        }
      }

    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update status");
    }
  };

  const handleUpdate = (id, newData) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, ...newData } : req));
  };


  // ================= GENERATE DOCX =================
  const generateDocx = async (request, onError) => {
    try {
      const payload = {
        // Integrator
        Name_Id: request.integratorName,
        EPC_Addr: request.officeAddress,
        EPC_Per: request.contactPerson,
        EPC_Con: request.contactNo,
        EPC_Email: request.email,
        WARR_No: request.warrantyCertificateNo,
        PROD_Desc: request.productDescription,
        INVOICE_No: request.premierInvoiceNo,
        ISSUE_DATE: request.certificateIssueDate,

        // Customer
        Cust_Addr: request.customerProjectSite,
        Phone_Number: request.customerContact,
        Alter_Number: request.customerAlternate || "",
        Cust_Email: request.customerEmail,
        Alter_Email: request.customerAltEmail || "",
        serialNumbers: request.serialNumbers,
        sitePictures: request.sitePictures,
      };

      const data = await generateDocument(payload);

      if (data.success) {
        toast.success(`Certificate sent to Premier Energies`);
      } else {
        toast.error(`Failed to generate/send for Premier Energies. Reverting...`);
        throw new Error("Invalid response from server");
      }

    } catch (err) {
      console.error("DOCX error:", err);
      toast.error(`Failed to generate/send for Premier Energies. Reverting...`);
      if (onError) onError();
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      {/* Toaster removed, using global ToastContainer from App.jsx */}

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">New Requests</h2>
          </div>

          <div className="flex gap-4 items-center">
            {/* Bulk Accept Button */}
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkAccept}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-green-700 transition-all animate-in fade-in"
              >
                <CheckCircle size={18} />
                Bulk Accept ({selectedIds.size})
              </button>
            )}

            <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200">
              {['pending', 'accepted', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${filter === status
                    ? `text-white shadow-sm`
                    : 'text-slate-500 hover:bg-gray-100'
                    }`}
                  style={{ backgroundColor: filter === status ? PRIMARY_COLOR : 'transparent' }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-sm h-96 animate-pulse p-6 border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-32 bg-gray-100 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {requests.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
                <p className="text-gray-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {requests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onAction={handleAction}
                      onGenerate={generateDocx}
                      primaryColor={PRIMARY_COLOR}
                      onViewImage={setSelectedImage}
                      onEdit={(id) => navigate(`/form?id=${id}`)}
                      onUpdate={handleUpdate}
                      isSelected={selectedIds.has(request.id)}
                      onToggleSelect={() => toggleSelect(request.id, request.status)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => fetchRequests(true)}
                      disabled={loadingMore}
                      className="px-6 py-2.5 bg-white border border-gray-200 text-slate-600 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-all flex items-center gap-2"
                    >
                      {loadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </>
                      ) : (
                        "Load More Requests"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* --- Image Modal --- */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-screen">
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
            />
            <button
              className="absolute -top-4 -right-4 bg-white text-black rounded-full p-2 hover:bg-gray-200 shadow-lg"
              onClick={() => setSelectedImage(null)}
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-Components ---

function RequestCard({ request, onAction, primaryColor, onViewImage, onGenerate, onEdit, onUpdate, isSelected, onToggleSelect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");


  // Auto-expand when editing
  useEffect(() => {
    if (isEditing) {
      setIsExpanded(true);
    }
  }, [isEditing]);

  // this holds ALL editable data (customer + admin)
  const [editData, setEditData] = useState({ ...request });

  // update any field
  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // SAVE button logic (THIS IS THE SAVE FUNCTION)
  const saveChanges = async () => {
    try {
      await updateDoc(doc(db, "requests", request.id), editData);
      if (onUpdate) onUpdate(request.id, editData);
      setIsEditing(false);
      toast.success("Changes saved successfully!");
    } catch (err) {
      console.error("Error saving changes:", err);
      toast.error("Failed to save changes");
    }
  };

  const isPending = request.status === "pending";

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'}`}>
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100 relative">
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{ backgroundColor: primaryColor }}
        ></div>

        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* CHECKBOX */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              disabled={request.status !== "pending"}
              className={`w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer ${request.status !== "pending" ? "opacity-30 cursor-not-allowed" : ""}`}
            />
            <h3 className="text-xl font-bold text-slate-900 truncate pr-2">
              {request.warrantyCertificateNo}
            </h3>
          </div>

          <div className="flex items-center gap-0.5">

            <StatusBadge status={request.status} className="mr-8" />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-start text-sm text-slate-500 gap-2 mb-1 pl-8">
          <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: primaryColor }} />
          <span>{request.officeAddress}</span>
        </div>

        {/* Summary (Visible when collapsed) */}
        {!isExpanded && !isEditing && (
          <div className="mt-4 text-xs text-slate-400 flex gap-4 pl-8">
            <span className="flex items-center gap-1"><User size={12} /> {request.contactPerson}</span>
            <span className="flex items-center gap-1"><Hash size={12} /> {request.serialNumbers?.length || 0} Serial Nos</span>
          </div>
        )}
      </div>

      {/* Card Body - Collapsible */}
      {isExpanded && (
        <div className="p-6 space-y-6 grow text-sm animate-in slide-in-from-top-2 duration-200">

          {/* Section: Integrator Contact */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Integrator Details</p>
            <div className="flex items-center gap-2">
              <User size={16} className="text-slate-400" />
              {!isEditing ? (
                <p>{editData.contactPerson}</p>
              ) : (
                <input
                  value={editData.contactPerson || ""}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-full"
                />
              )}

            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-slate-400" />
              {!isEditing ? (
                <p>{editData.contactNo}</p>
              ) : (
                <input
                  value={editData.contactNo || ""}
                  onChange={(e) => handleChange("contactNo", e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-full"
                />
              )}

            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-slate-400" />
              {!isEditing ? (
                <p>{editData.officeAddress}</p>
              ) : (
                <textarea
                  value={editData.officeAddress || ""}
                  onChange={(e) => handleChange("Mail", e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-full"
                  rows={2}
                />
              )}

            </div>
          </div>

          {/* Section: Customer Info */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Building size={16} style={{ color: primaryColor }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>Customer Site</p>
            </div>

            {!isEditing ? (
              <>
                <p className="font-medium text-slate-900">{editData.customerProjectSite}</p>

                <div className="grid grid-cols-1 gap-2 text-slate-600">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Contact:</span>
                    <span className="font-medium text-right">{editData.customerContact}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Phone:</span>
                    <span className="text-right">{editData.customerAlternate}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Email:</span>
                    <span className="text-right truncate max-w-[150px]" title={editData.customerEmail}>{editData.customerEmail}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <input
                  value={editData.customerProjectSite || ""}
                  onChange={(e) => handleChange("customerProjectSite", e.target.value)}
                  placeholder="Project Site Address"
                  className="border rounded px-2 py-1 text-sm w-full"
                />
                <input
                  value={editData.customerContact || ""}
                  onChange={(e) => handleChange("customerContact", e.target.value)}
                  placeholder="Contact Person"
                  className="border rounded px-2 py-1 text-sm w-full"
                />
                <input
                  value={editData.customerAlternate || ""}
                  onChange={(e) => handleChange("customerAlternate", e.target.value)}
                  placeholder="Phone Number"
                  className="border rounded px-2 py-1 text-sm w-full"
                />
                <input
                  value={editData.customerEmail || ""}
                  onChange={(e) => handleChange("customerEmail", e.target.value)}
                  placeholder="Email Address"
                  className="border rounded px-2 py-1 text-sm w-full"
                />
              </div>
            )}
          </div>

          {/* Section: Tech Specs */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Assets & Evidence</p>
            <div className="flex items-start gap-2 mb-3">
              <Hash size={16} className="text-slate-400 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {!isEditing ? (
                  editData.serialNumbers?.map((sn, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono border border-gray-200">
                      {sn}
                    </span>
                  ))
                ) : (
                  <textarea
                    value={editData.serialNumbers?.join(", ") || ""}
                    onChange={(e) => handleChange("serialNumbers", e.target.value.split(",").map(s => s.trim()))}
                    placeholder="Serial Numbers (comma separated)"
                    className="border rounded px-2 py-1 text-sm w-full font-mono"
                    rows={3}
                  />
                )}
              </div>
            </div>

            {request.sitePictures.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {request.sitePictures.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group shrink-0 cursor-pointer"
                    onClick={() => onViewImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Site Proof ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                      <ImageIcon size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-xs italic flex items-center gap-1">
                <ImageIcon size={14} /> No images uploaded
              </div>
            )}
          </div>
          {/* ===== ADMIN CERTIFICATE SECTION ===== */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
            <p className="text-xs font-bold uppercase text-slate-500 mb-3">
              Certificate Details (Admin)
            </p>

            {!isEditing ? (
              <div className="space-y-1 text-sm">
                <p><strong>Warranty No:</strong> {editData.warrantyCertificateNo || "—"}</p>
                <p><strong>Invoice No:</strong> {editData.premierInvoiceNo || "—"}</p>
                <p><strong>Issue Date:</strong> {editData.certificateIssueDate || "—"}</p>
                <p className="text-slate-00"><strong>Description:</strong> {editData.productDescription || "—"}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  name="warrantyCertificateNo"
                  value={editData.warrantyCertificateNo || ""}
                  onChange={(e) => handleChange("warrantyCertificateNo", e.target.value)}
                  placeholder="Warranty Certificate No"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <input
                  name="premierInvoiceNo"
                  value={editData.premierInvoiceNo || ""}
                  onChange={(e) => handleChange("premierInvoiceNo", e.target.value)}
                  placeholder="Premier Invoice No"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  name="certificateIssueDate"
                  value={editData.certificateIssueDate || ""}
                  onChange={(e) => handleChange("certificateIssueDate", e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <textarea
                  name="productDescription"
                  value={editData.productDescription || ""}
                  onChange={(e) => handleChange("productDescription", e.target.value)}
                  rows={10}
                  placeholder="Product Description"
                  className="w-full border rounded px-3 py-2 text-sm resize-none"
                />
              </div>
            )}
          </div>
        </div>
      )
      }
      {/* Card Footer / Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-3 gap-3">
        {isPending ? (
          <>
            <button
              onClick={async () => {
                // 2. Background Process: Generate Doc & Email
                // We pass a tailored onError callback to revert the status if it fails
                if (editData.warrantyCertificateNo && editData.premierInvoiceNo && editData.certificateIssueDate && editData.productDescription) {
                  onGenerate(request, async () => {
                    console.warn("Background process failed, reverting status...");
                    await onAction(request.id, "pending");
                  });
                  toast.success("Email drafting started");
                  await onAction(request.id, "accepted");
                } else {
                  toast.error("Please fill all the fields");
                  return;
                }
              }}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-green-600 hover:bg-green-50 hover:border-green-200 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm"
            >
              <CheckCircle size={18} />
              Accept
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm"
            >
              <XCircle size={18} />
              Reject
            </button>

            <button
              onClick={() => isEditing ? saveChanges() : setIsEditing(true)}
              className={`px-4 py-2 rounded-lg text-blue font-medium bg-white border border-gray-200 shadow-sm
              ${isEditing ? "bg-green-600 text-white hover:bg-green-700" : "text-slate-600 hover:bg-gray-50"}
              `}
            >
              {isEditing ? "Save" : "Edit"}
            </button>

          </>
        ) : (
          <>
            <div className="col-span-2 text-center py-2 text-sm text-slate-500 bg-slate-100 rounded-lg border border-transparent">
              Request {request.status}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="col-span-1 text-center py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
            >
              {isExpanded ? "Hide Details" : "View Details"}
            </button>
          </>
        )}
      </div>

      {/* Reject Reason Modal */}
      {
        showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Reason for Rejection</h3>
              <p className="text-sm text-slate-500">Please provide a reason for rejecting this request.</p>

              <textarea
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                rows={4}
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!rejectReason.trim()) {
                      toast.error("Please provide a reason");
                      return;
                    }

                    // Send email
                    try {
                      await sendRejectionEmail({
                        email: request.email,
                        name: request.integratorName,
                        reason: rejectReason,
                        WARR_No: request.warrantyCertificateNo,
                      });

                      toast.success("Rejection email sent successfully");

                      const requestRef = doc(db, "requests", request.id);
                      await updateDoc(requestRef, {
                        status: "rejected",
                        rejectReason: rejectReason,
                        updatedAt: serverTimestamp()
                      });
                      console.log("Rejection email sent via Server");

                    } catch (err) {
                      console.error("Failed to send rejection email:", err);
                      // alert("Failed to send rejection email, but request will still be rejected."); // Optional: don't block rejection
                      toast.error("Failed to send rejection email");
                    }

                    await onAction(request.id, "rejected", rejectReason);
                    setShowRejectModal(false);
                    toast.success("Request rejected successfully");
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  const icons = {
    pending: null,
    accepted: <CheckCircle size={12} className="mr-1" />,
    rejected: <XCircle size={12} className="mr-1" />,
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center capitalize ${styles[status] || styles.pending}`}>
      {icons[status]}
      {status}
    </span>
  );
}