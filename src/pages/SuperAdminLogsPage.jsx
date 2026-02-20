import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Clock, UserCircle, Activity, LayoutDashboard, Calendar } from 'lucide-react';
import { fetchAdminLogs } from '../services/api';

export default function SuperAdminLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await fetchAdminLogs('superadmin@truesuntradingcompany.com');

                if (data.success) {
                    setLogs(data.logs);
                } else {
                    toast.error(data.error || 'Failed to fetch logs');
                }
            } catch (error) {
                console.error('Error fetching admin logs:', error);
                toast.error('Network error while fetching logs');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        // Firestore timestamp to JS Date
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString();
    };

    const getActionColor = (action) => {
        switch (action?.toUpperCase()) {
            case 'LOGIN': return 'text-blue-600 bg-blue-100';
            case 'ACCEPTED': return 'text-green-600 bg-green-100';
            case 'REJECTED': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 rounded-xl">
                            <Activity className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Activity Logs</h1>
                            <p className="text-sm text-gray-500">View detailed interactions and decisions made by administrators</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        <Calendar size={16} />
                        {new Date().toLocaleDateString()}
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center space-y-4">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500 animate-pulse">Loading activity logs...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LayoutDashboard className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No logs found</h3>
                            <p className="text-gray-500 mt-1">There are no admin activities recorded yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Timestamp</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/2">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                            {/* Timestamp */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock size={14} className="text-gray-400" />
                                                    {formatDate(log.timestamp)}
                                                </div>
                                            </td>

                                            {/* Admin Email */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                                    <UserCircle size={16} className="text-gray-400" />
                                                    {log.adminEmail}
                                                </div>
                                            </td>

                                            {/* Action */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getActionColor(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Details */}
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {log.details && Object.keys(log.details).length > 0 ? (
                                                    <div className="flex flex-col gap-1">
                                                        {log.details.warrantyCertificateNo && (
                                                            <span><span className="font-semibold text-gray-800">Warranty No:</span> {log.details.warrantyCertificateNo}</span>
                                                        )}
                                                        {log.details.integratorName && (
                                                            <span><span className="font-semibold text-gray-800">Integrator:</span> {log.details.integratorName}</span>
                                                        )}
                                                        {log.details.reason && (
                                                            <span className="text-red-500 mt-1 pl-2 border-l-2 border-red-200 block bg-red-50 p-1 rounded">
                                                                <span className="font-semibold">Reason:</span> {log.details.reason}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic">No additional details</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
