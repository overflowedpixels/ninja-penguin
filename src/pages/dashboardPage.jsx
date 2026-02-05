import React, { useEffect, useState } from "react";
import axios from "axios"; // ✅ ADDED
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
  Filter
} from "lucide-react";
import { collection, query, getDocs, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// --- Mock Data Generator (For Preview Purposes) ---
// MOck data removed


export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");

  // --- Theme Constants ---
  const PRIMARY_COLOR = "#ff7f50"; // Coral

  useEffect(() => {
    const loadData = async () => {
      try {
        const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ================= UPDATE STATUS =================
  const handleAction = async (id, action) => {

    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: action } : req
      )
    );

    try {

      const ref = doc(db, "requests", id);

      await updateDoc(ref, {
        status: action
      });

    } catch (err) {
      console.error("Update error:", err);
    }
  };


  // ================= GENERATE DOCX =================
  const generateDocx = async (request) => {
    try {

      const payload = {

        // Integrator
        Name_Id: request.integratorName,
        EPC_Addr: request.officeAddress,
        EPC_Per: request.contactPerson,
        EPC_Con: request.contactNo,
        EPC_Email: request.email,

        // Customer
        Cust_Addr: request.customerProjectSite,
        Phone_Number: request.customerContact,
        Alter_Number: request.customerAlternate,

        Cust_Email: request.customerEmail,
        Alter_Email: request.customerAltEmail || "",
      };


      // Serial Numbers (1–50)
      for (let i = 1; i <= 50; i++) {
        payload[`Serial_No${i}`] =
          request.serialNumbers?.[i - 1] || "";
      }


      // Call backend
      const res = await axios.post(
        "http://localhost:5000/test",
        payload,
        {
          responseType: "blob",
        }
      );


      // Download
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${request.id}.docx`;
      a.click();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("DOCX error:", err);
      alert("Failed to generate certificate");
    }
  };


  const filteredRequests = requests.filter(req =>
    filter === "all" ? true : req.status === filter
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">

      {/* --- Header --- */}
      {/* <header 
        className="shadow-lg sticky top-0 z-40 transition-all duration-300"
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="text-white h-6 w-6" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Service Integrator Portal
            </h1>
          </div>
          <div className="text-white/80 text-sm font-medium hidden sm:block">
            Admin Dashboard
          </div>
        </div>
      </header> */}

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">New Requests</h2>
            <p className="text-slate-500 mt-1">Manage incoming installation verifications</p>
          </div>

          <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            {['all', 'pending', 'accepted', 'rejected'].map((status) => (
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
            {filteredRequests.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
                <p className="text-gray-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onAction={handleAction}
                    onGenerate={generateDocx} // ✅
                    primaryColor={PRIMARY_COLOR}
                    onViewImage={setSelectedImage}
                  />
                ))}
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

function RequestCard({ request, onAction, primaryColor, onViewImage, onGenerate, }) {
  const isAccepted = request.status === "accepted";
  const isRejected = request.status === "rejected";
  const isPending = request.status === "pending";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100 relative">
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{ backgroundColor: primaryColor }}
        ></div>

        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 truncate pr-2">
            {request.integratorName}
          </h3>
          <StatusBadge status={request.status} />
        </div>

        <div className="flex items-start text-sm text-slate-500 gap-2 mb-1">
          <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: primaryColor }} />
          <span>{request.officeAddress}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-6 flex-grow text-sm">

        {/* Section: Integrator Contact */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Integrator Details</p>
          <div className="flex items-center gap-2">
            <User size={16} className="text-slate-400" />
            <span className="font-medium text-slate-700">{request.contactPerson}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-slate-400" />
            <a href={`tel:${request.contactNo}`} className="text-slate-600 hover:text-blue-600 transition-colors">
              {request.contactNo}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-slate-400" />
            <a href={`mailto:${request.email}`} className="text-slate-600 hover:text-blue-600 transition-colors">
              {request.email}
            </a>
          </div>
        </div>

        {/* Section: Customer Info */}
        <div className="bg-slate-50 p-4 rounded-xl space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Building size={16} style={{ color: primaryColor }} />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>Customer Site</p>
          </div>

          <p className="font-medium text-slate-900">{request.customerProjectSite}</p>

          <div className="grid grid-cols-1 gap-2 text-slate-600">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span>Contact:</span>
              <span className="font-medium text-right">{request.customerContact}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span>Phone:</span>
              <span className="text-right">{request.customerAlternate}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>Email:</span>
              <span className="text-right truncate max-w-[150px]" title={request.customerEmail}>{request.customerEmail}</span>
            </div>
          </div>
        </div>

        {/* Section: Tech Specs */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Assets & Evidence</p>
          <div className="flex items-start gap-2 mb-3">
            <Hash size={16} className="text-slate-400 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {request.serialNumbers.map((sn, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono border border-gray-200">
                  {sn}
                </span>
              ))}
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
      </div>

      {/* Card Footer / Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
        {isPending ? (
          <>
            <button
              onClick={() => {
                onAction(request.id,"accepted");
                onGenerate(request);
              }}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-green-600 hover:bg-green-50 hover:border-green-200 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm"
            >
              <CheckCircle size={18} />
              Accept
            </button>
            <button
              onClick={() => onAction(request.id, "reject")}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm"
            >
              <XCircle size={18} />
              Reject
            </button>
          </>
        ) : (
          <div className="col-span-2 text-center py-2 text-sm text-slate-500 bg-slate-100 rounded-lg border border-transparent">
            Request {request.status}
          </div>
        )}
      </div>
    </div>
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