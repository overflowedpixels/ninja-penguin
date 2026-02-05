// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch requests from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/requests") // replace with your API
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAction = (id, action) => {
    fetch(`http://localhost:5000/api/requests/${id}/${action}`, {
      method: "POST",
    })
      .then(res => res.json())
      .then(updated => {
        setRequests(prev =>
          prev.map(req => (req.id === id ? { ...req, status: action } : req))
        );
      })
      .catch(err => console.error(err));
  };

  if (loading) return <p className="text-purple-700 text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-purple-50 p-8 text-purple-900">
      <h1 className="text-3xl font-bold mb-6">New Requests List</h1>

      {requests.length === 0 && <p>No requests found.</p>}

      <div className="space-y-6">
        {requests.map(request => (
          <div
            key={request.id}
            className="bg-white p-6 rounded-2xl shadow-md border border-purple-200"
          >
            <h2 className="text-xl font-semibold mb-2">{request.integratorName}</h2>
            <p><strong>Office Address:</strong> {request.officeAddress}</p>
            <p><strong>Contact Person:</strong> {request.contactPerson}</p>
            <p><strong>Contact No:</strong> {request.contactNo}</p>
            <p><strong>Email:</strong> {request.email}</p>
            <p><strong>Customer Project Site:</strong> {request.customerProjectSite}</p>
            <p><strong>Customer Contact:</strong> {request.customerContact}</p>
            <p><strong>Customer Alternate:</strong> {request.customerAlternate}</p>
            <p><strong>Customer Email:</strong> {request.customerEmail}</p>
            <p><strong>Customer Alternate Email:</strong> {request.customerAlternateEmail}</p>
            <p><strong>Serial Numbers:</strong> {request.serialNumbers.join(", ")}</p>
            <p className="mt-2"><strong>Site Pictures:</strong></p>
            <div className="flex gap-2 mt-1 overflow-x-auto">
              {request.sitePictures.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Site Pic ${idx + 1}`}
                  className="w-32 h-24 object-cover rounded-md border"
                />
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleAction(request.id, "accept")}
                disabled={request.status === "accepted"}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction(request.id, "reject")}
                disabled={request.status === "rejected"}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                Reject
              </button>
              <span className="ml-auto font-semibold">
                Status: {request.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
