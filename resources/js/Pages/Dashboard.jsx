import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    FiUsers,
    FiAlertCircle,
    FiCheckCircle,
    FiCreditCard,
    FiClock,
    FiInfo,
} from "react-icons/fi";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import { format } from "date-fns";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

export default function Dashboard({ stats, recentLogs, dailyStats, topDoors }) {
    // Format date-time for logs
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return format(date, "MMM dd, yyyy - h:mm a");
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Dashboard
                                </h1>
                                <p className="text-gray-600">
                                    Welcome to your SmartDoor access control
                                    system
                                </p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                                <StatCard
                                    title="Total Doors"
                                    value={stats.totalDoors}
                                    icon={
                                        <FaDoorOpen className="h-6 w-6 text-blue-500" />
                                    }
                                    bgColor="bg-blue-50"
                                />
                                <StatCard
                                    title="Active Cards"
                                    value={stats.totalActiveCards}
                                    icon={
                                        <FiCreditCard className="h-6 w-6 text-green-500" />
                                    }
                                    bgColor="bg-green-50"
                                />
                                <StatCard
                                    title="Your Cards"
                                    value={stats.userCards}
                                    icon={
                                        <FiUsers className="h-6 w-6 text-indigo-500" />
                                    }
                                    bgColor="bg-indigo-50"
                                />
                                <StatCard
                                    title="Successful Access"
                                    value={stats.successfulAccess}
                                    icon={
                                        <FiCheckCircle className="h-6 w-6 text-green-500" />
                                    }
                                    bgColor="bg-green-50"
                                />
                                <StatCard
                                    title="Denied Access"
                                    value={stats.deniedAccess}
                                    icon={
                                        <FiAlertCircle className="h-6 w-6 text-red-500" />
                                    }
                                    bgColor="bg-red-50"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Access Chart */}
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-lg font-semibold mb-4">
                                        Access Trends (Last 7 Days)
                                    </h2>
                                    <div className="h-64">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <LineChart data={dailyStats}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="successful"
                                                    name="Successful"
                                                    stroke="#10b981"
                                                    activeDot={{ r: 8 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="denied"
                                                    name="Denied"
                                                    stroke="#ef4444"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Top Doors */}
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-lg font-semibold mb-4">
                                        Most Accessed Doors (Last 30 Days)
                                    </h2>
                                    <div className="h-64">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart data={topDoors}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar
                                                    dataKey="count"
                                                    name="Access Count"
                                                    fill="#3b82f6"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-lg shadow mb-8">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold">
                                        Recent Activity
                                    </h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Time
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Door
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Card
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Notes
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recentLogs.length > 0 ? (
                                                recentLogs.map((log) => (
                                                    <tr key={log.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                                                                {formatDateTime(
                                                                    log.access_time
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            <div className="flex items-center">
                                                                <FaDoorOpen className="mr-2 h-4 w-4 text-blue-500" />
                                                                {log.door.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            <div className="flex items-center">
                                                                <FiUsers className="mr-2 h-4 w-4 text-indigo-500" />
                                                                {log.rfid_tag
                                                                    ?.user
                                                                    ?.name ||
                                                                    "Unknown User"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            <div className="flex items-center">
                                                                <FiCreditCard className="mr-2 h-4 w-4 text-green-500" />
                                                                {log.rfid_tag
                                                                    ?.name ||
                                                                    "Unknown Card"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {log.success ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    <FiCheckCircle className="mr-1 h-4 w-4" />
                                                                    Granted
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                    <FiAlertCircle className="mr-1 h-4 w-4" />
                                                                    Denied
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {log.notes ? (
                                                                <div className="flex items-center">
                                                                    <FiInfo className="mr-2 h-4 w-4 text-gray-400" />
                                                                    {log.notes}
                                                                </div>
                                                            ) : (
                                                                <span>-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="6"
                                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                                    >
                                                        No recent activity found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {recentLogs.length > 0 && (
                                    <div className="px-6 py-4 border-t border-gray-200">
                                        <Link
                                            href={route("logs.index")}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            View all logs →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon, bgColor = "bg-blue-50" }) {
    return (
        <div className={`${bgColor} p-6 rounded-lg shadow`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className="rounded-full p-3 bg-white bg-opacity-60">
                    {icon}
                </div>
            </div>
        </div>
    );
}
