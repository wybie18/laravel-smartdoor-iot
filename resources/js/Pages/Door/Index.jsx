import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FaDoorClosed, FaDoorOpen } from 'react-icons/fa';
import { FiEdit, FiPlus, FiSearch, FiTrash2, FiX, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import CreateForm from './Modal/CreateForm';
import EditForm from './Modal/EditForm';
import DeleteForm from './Modal/DeleteForm';

export default function Index({ doors, queryParams, flash }) {
    queryParams = queryParams || {};
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDoor, setSelectedDoor] = useState(null);

    const openCreateModal = () => {
        setCreateModalOpen(true);
    }

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const openEditModal = (door) => {
        setSelectedDoor(door);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedDoor(null);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedDoor(null);
    };

    const openDeleteModal = (door) => {
        setDeleteModalOpen(true);
        setSelectedDoor(door);
    };

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
        router.get(route("doors.index"), queryParams);
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
        router.get(route("doors.index"), queryParams);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Doors
                </h2>
            }
        >
            <Head title="Doors" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-600">
                                        Door Management
                                    </h5>
                                    <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                        Create and manage smart door access
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={openCreateModal}
                                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                    >
                                        <FiPlus className="mr-2 h-4 w-4" />
                                        <span>Add Door</span>
                                    </button>
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
                                        placeholder="Search by door name..."
                                        defaultValue={queryParams.search || ''}
                                        onBlur={e => searchFieldChanged('search', e.target.value)}
                                        onKeyUp={e => onKeyPress('search', e)}
                                    />
                                </div>
                            </div>
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
                                                <TableHeading
                                                    fieldName="name"
                                                    sortable={true}
                                                    sortField={queryParams.sort_field}
                                                    sortDirection={queryParams.sort_direction}
                                                    onSortChange={onSortChange}
                                                >
                                                    Name
                                                </TableHeading>
                                                <TableHeading>
                                                    Description
                                                </TableHeading>
                                                <TableHeading
                                                    fieldName="created_at"
                                                    sortable={true}
                                                    sortField={queryParams.sort_field}
                                                    sortDirection={queryParams.sort_direction}
                                                    onSortChange={onSortChange}
                                                >
                                                    Created At
                                                </TableHeading>
                                                <TableHeading
                                                    fieldName="updated_at"
                                                    sortable={true}
                                                    sortField={queryParams.sort_field}
                                                    sortDirection={queryParams.sort_direction}
                                                    onSortChange={onSortChange}
                                                >
                                                    Updated At
                                                </TableHeading>
                                                <TableHeading className="text-right">Actions</TableHeading>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {doors.data.length > 0 ? (
                                                doors.data.map((door) => (
                                                    <tr key={door.id} className="hover:bg-blue-50 transition-colors">
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 font-medium">
                                                            #{door.id}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                                            <div className="flex items-center">
                                                                <FaDoorOpen className="mr-2 h-4 w-4 text-blue-500" />
                                                                {door.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700">
                                                            {door.description || <span className="text-gray-400 italic">No description</span>}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                            {door.created_at}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                            {door.updated_at}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <button
                                                                    onClick={() => openEditModal(door)}
                                                                    type="button"
                                                                    className="inline-flex items-center rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors"
                                                                    title="Edit door"
                                                                >
                                                                    <FiEdit className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => openDeleteModal(door)}
                                                                    type="button"
                                                                    className="inline-flex items-center rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                                                                    title="Delete door"
                                                                >
                                                                    <FiTrash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FaDoorClosed className="h-12 w-12 text-gray-300 mb-3" />
                                                            <p className="font-medium text-gray-600">No doors found</p>
                                                            <p className="text-gray-500 mt-1">
                                                                Try adjusting your search filters or add a new door
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border-t border-gray-200 px-4 py-3">
                                    <Pagination pagination={doors.meta} queryParams={queryParams} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CreateForm openModal={createModalOpen} closeModal={closeCreateModal} />
            <EditForm openModal={editModalOpen} closeModal={closeEditModal} door={selectedDoor} />
            <DeleteForm openModal={deleteModalOpen} closeModal={closeDeleteModal} door={selectedDoor} />
        </AuthenticatedLayout>
    );
}