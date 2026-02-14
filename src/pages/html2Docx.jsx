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
          "NameId": "Jithu",
          "PhoneNumber": "1234567890",
        }
        // Removed responseType: "blob"
      );

      if (response.data.success && response.data.file) {
        const base64Data = response.data.file;

        // Convert base64 to Blob
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "document.docx");
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

        setMsg("✅ DOCX downloaded successfully!");
      } else {
        setMsg("❌ Failed to convert document: Invalid response");
      }
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
