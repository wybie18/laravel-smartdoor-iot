import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FaCreditCard, FaDoorClosed, FaDoorOpen } from 'react-icons/fa';
import { FiEdit, FiPlus, FiSearch, FiTrash2, FiX, FiCheck, FiAlertTriangle, FiList, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Index({ logs, queryParams, flash }) {
    queryParams = queryParams || {};

    if (flash?.success) {
        toast.success(flash.success);
    }

    if (flash?.error) {
        toast.error(flash.error);
    }

    const searchFieldChanged = (name, value) => {
        if (!value && !queryParams[name]) {
            return;
        }
        if (value) {
            queryParams[name] = value;
        }
        if (queryParams[name] && !value) {
            delete queryParams[name];
        }
        router.get(route("logs.index"), queryParams);
    };

    const onKeyPress = (name, e) => {
        if (e.key !== "Enter") return;
        searchFieldChanged(name, e.target.value);
    };

    const onSortChange = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("logs.index"), queryParams);
    };

    const toggleFilter = (name) => {
        if (queryParams[name]) {
            delete queryParams[name];
        } else {
            queryParams[name] = true;
            if (name === 'success' && queryParams.failed) {
                delete queryParams.failed;
            } else if (name === 'failed' && queryParams.success) {
                delete queryParams.success;
            }
        }
        router.get(route("logs.index"), queryParams);
    };

    const clearFilters = () => {
        const newParams = { ...queryParams };
        ['success', 'failed', 'search'].forEach(param => {
            if (newParams[param]) delete newParams[param];
        });
        router.get(route("logs.index"), newParams);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Logs
                </h2>
            }
        >
            <Head title="Logs" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-600">
                                        Access Logs Record
                                    </h5>
                                    <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                        View records of user access
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 mb-6">
                                <div className="relative w-full sm:w-64">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FiSearch className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Search by door/card name..."
                                        defaultValue={queryParams.search || ''}
                                        onBlur={e => searchFieldChanged('search', e.target.value)}
                                        onKeyUp={e => onKeyPress('search', e)}
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleFilter('success')}
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md 
                                            ${queryParams.success
                                                ? 'bg-green-100 text-green-800 border border-green-300'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <FiCheck className={`mr-2 h-4 w-4 ${queryParams.success ? 'text-green-600' : 'text-gray-500'}`} />
                                        Success
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => toggleFilter('failed')}
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md 
                                            ${queryParams.failed
                                                ? 'bg-red-100 text-red-800 border border-red-300'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <FiX className={`mr-2 h-4 w-4 ${queryParams.failed ? 'text-red-600' : 'text-gray-500'}`} />
                                        Failed
                                    </button>

                                    {(queryParams.success || queryParams.failed || queryParams.search) && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            <FiFilter className="mr-2 h-4 w-4 text-gray-500" />
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </div>

                            {(queryParams.success || queryParams.failed || queryParams.search) && (
                                <div className="mb-4 flex items-center bg-blue-50 p-3 rounded-md">
                                    <FiFilter className="h-5 w-5 text-blue-500 mr-2" />
                                    <span className="text-sm text-blue-700">
                                        Active filters:
                                        {queryParams.success && <span className="ml-1 font-medium">Success</span>}
                                        {queryParams.failed && <span className="ml-1 font-medium">Failed</span>}
                                        {queryParams.search && <span className="ml-1 font-medium">Search: "{queryParams.search}"</span>}
                                    </span>
                                </div>
                            )}

                            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-blue-50">
                                            <tr>
                                                <TableHeading
                                                    fieldName="id"
                                                    sortable={true}
                                                    sortField={queryParams.sort_field}
                                                    sortDirection={queryParams.sort_direction}
                                                    onSortChange={onSortChange}
                                                >
                                                    ID
                                                </TableHeading>
                                                <TableHeading>
                                                    RFID UID
                                                </TableHeading>
                                                <TableHeading>
                                                    Card Name
                                                </TableHeading>
                                                <TableHeading>
                                                    Door Name
                                                </TableHeading>
                                                <TableHeading
                                                    fieldName="success"
                                                    sortable={true}
                                                    sortField={queryParams.sort_field}
                                                    sortDirection={queryParams.sort_direction}
                                                    onSortChange={onSortChange}
                                                >
                                                    Status
                                                </TableHeading>
                                                <TableHeading
                                                    fieldName="access_time"
                                                    sortable={true}
                                                    sortField={queryParams.sort_field}
                                                    sortDirection={queryParams.sort_direction}
                                                    onSortChange={onSortChange}
                                                >
                                                    Access Time
                                                </TableHeading>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {logs.data.length > 0 ? (
                                                logs.data.map((log) => (
                                                    <tr key={log.id} className="hover:bg-blue-50 transition-colors">
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 font-medium">
                                                            #{log.id}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 font-mono">
                                                            {log.rfid_tag?.rfid_uid || "Manual"}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                                            <div className="flex items-center">
                                                                <FaCreditCard className="mr-2 h-4 w-4 text-blue-500" />
                                                                {log.rfid_tag?.name || "Manual"}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                                            <div className="flex items-center">
                                                                <FaDoorOpen className="mr-2 h-4 w-4 text-blue-500" />
                                                                {log.door.name}
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${log.success
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {log.success ? 'Success' : 'Failed'}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                            {log.access_time}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiList className="h-12 w-12 text-gray-300 mb-3" />
                                                            <p className="font-medium text-gray-600">No logs found</p>
                                                            <p className="text-gray-500 mt-1">
                                                                Try adjusting your search filters
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border-t border-gray-200 px-4 py-3">
                                    <Pagination pagination={logs.meta} queryParams={queryParams} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}