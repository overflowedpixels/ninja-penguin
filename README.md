# Ninja Penguine - Solar Installation Verification System

A comprehensive web application for managing solar installation verifications, generating warranty certificates, and automating communication between integrators, customers, and administrators.

## 🚀 Features

- **Dashboard**: Centralized view for managing installation requests (Pending, Accepted, Rejected).
- **Request Form**: User-friendly form for submitting new verification requests with image uploads.
- **Automated Document Generation**: Generates DOCX warranty certificates filled with request data using templates.
- **Email Notifications**:
  - Sends generated certificates to administrators/EPCs via Email.
  - Sends rejection notifications with reasons to integrators.
- **Status Tracking**: Real-time status updates (Pending -> Accepted/Rejected).
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on all devices.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library.
- **Vite**: Build tool and dev server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Firebase SDK**: For Firestore database interactions.
- **Axios**: HTTP client for backend requests.
- **React Router**: Client-side routing.
- **React Hot Toast**: For notifications.

### Backend
- **Node.js & Express**: Server-side runtime and framework.
- **Docxtemplater & PizZip**: For generating DOCX files from templates.
- **Resend**: For transactional emails.
- **Docx-Merger**: Merging multiple DOCX files (templates + images).
- **Firebase Admin/Client**: (If used server-side, though current impl uses client SDK for read/write in frontend).

## 📂 Project Structure

```
ninja-penguine/
├── src/                # Frontend source code
│   ├── components/     # Reusable UI components (Header, Footer, etc.)
│   ├── pages/          # Application pages (Dashboard, Home, Form, etc.)
│   ├── services/       # API and Service abstractions (to be implemented)
│   ├── firebase.js     # Firebase configuration
│   └── App.jsx         # Main application component & Routing
├── server/             # Backend source code
│   ├── index.js        # Main Express server entry point
│   └── template*.docx  # Word document templates
├── public/             # Static assets
└── README.md           # Project documentation
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd ninja-penguine
```

### 2. Frontend Setup
```bash
npm install
```

Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run the frontend:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 3. Backend Setup
Navigate to the server directory:
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
RESEND_API_KEY=your_resend_api_key
```

Run the backend:
```bash
node index.js
# or
npm start
```
The server will run on `http://localhost:5000`.

## 📜 Usage

1. **Submit Request**: Users/Integrators fill out the form on the website.
2. **Review**: Admins Log in to the Dashboard to review requests.
3. **Approve**: 
   - Click "Accept".
   - App fills the templates, merges them, and generates a Warranty Certificate.
   - Emails the certificate to the relevant parties.
4. **Reject**:
   - Click "Reject".
   - Provide a reason.
   - System sends a rejection email to the integrator.

## 🤝 Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License.
