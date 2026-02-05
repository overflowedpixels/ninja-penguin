// HomePage.jsx
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-purple-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 shadow-sm">
        <h1 className="text-2xl font-bold text-purple-700">PurpleUI</h1>
        <nav>
          <Link
            to="/dashboard"
            className="text-white bg-purple-700 px-4 py-2 rounded-md font-medium hover:bg-purple-800 transition"
          >
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-purple-50">
        <div className="border-2 border-dashed border-purple-300 rounded-2xl p-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to PurpleUI</h2>
          <p className="text-purple-700">
            Click the button above to go to your Dashboard
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-purple-600">
        © {new Date().getFullYear()} PurpleUI
      </footer>
    </div>
  );
}
