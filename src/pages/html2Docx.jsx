import React, { useState } from "react";
import axios from "axios";

export default function HtmlToDocx() {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMsg("");

      const response = await axios.post(
        "http://localhost:5000/test",
        {
          "NameId":"Jithu",
          "PhoneNumber":"1234567890",
        },
        {
          responseType: "blob" // Important for file download
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "document.docx");
      document.body.appendChild(link);
      link.click();

      link.remove();

      setMsg("✅ DOCX downloaded successfully!");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to convert document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>HTML to DOCX Converter</h2>

      <textarea
        placeholder="Enter HTML here..."
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        rows={10}
        style={styles.textarea}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Processing..." : "Convert & Download"}
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px"
  },
  textarea: {
    width: "100%",
    marginBottom: "10px"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};
