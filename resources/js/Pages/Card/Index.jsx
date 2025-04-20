import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FaCreditCard, FaDoorClosed, FaDoorOpen } from 'react-icons/fa';
import { FiEdit, FiPlus, FiSearch, FiTrash2, FiX, FiCheck, FiAlertTriangle, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import CreateForm from './Modal/CreateForm';
import EditForm from './Modal/EditForm';
import DeleteForm from './Modal/DeleteForm';
import DoorAccessBadge from '@/Components/DoorAccessBadge';

export default function Index({ cards, queryParams, flash }) {
    queryParams = queryParams || {};
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showOnlyActive, setShowOnlyActive] = useState(queryParams.active || false);

    const openCreateModal = () => {
        setCreateModalOpen(true);
    }

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const openEditModal = (card) => {
        setSelectedCard(card);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedCard(null);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedCard(null);
    };

    const openDeleteModal = (card) => {
        setDeleteModalOpen(true);
        setSelectedCard(card);
    };

    if (flash?.success) {
        toast.success(flash.success);
    }

    if (flash?.error) {
        toast.error(flash.error);
    }

    const toggleActiveFilter = () => {
        if (queryParams.active) {
            delete queryParams.active;
            setShowOnlyActive(false);
        } else {
            queryParams.active = true;
            setShowOnlyActive(true);
        }
        router.get(route("cards.index"), queryParams);
    };

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
        router.get(route("cards.index"), queryParams);
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
        router.get(route("cards.index"), queryParams);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Cards
                </h2>
            }
        >
            <Head title="Cards" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-600">
                                        RFID Card Management
                                    </h5>
                                    <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                        Manage access cards for smart doors
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={openCreateModal}
                                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                    >
                                        <FiPlus className="mr-2 h-4 w-4" />
                                        <span>Add Card</span>
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
                                        placeholder="Search by RFID or name..."
                                        defaultValue={queryParams.search || ''}
                                        onBlur={e => searchFieldChanged('search', e.target.value)}
                                        onKeyUp={e => onKeyPress('search', e)}
                                    />
                                </div>

                                <button
                                    onClick={toggleActiveFilter}
                                    className={`inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${showOnlyActive
                                        ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {showOnlyActive ? <FiToggleRight className="mr-2 h-4 w-4" /> : <FiToggleLeft className="mr-2 h-4 w-4" />}
                                    <span>{showOnlyActive ? 'Active Only' : 'Show All'}</span>
                                </button>
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
                                                    RFID UID
                                                </TableHeading>
                                                <TableHeading>
                                                    Description
                                                </TableHeading>
                                                <TableHeading
                                                    fieldName="active"
                                                    sortable={true}
                                                    sortField={queryParams.sort_field}
                                                    sortDirection={queryParams.sort_direction}
                                                    onSortChange={onSortChange}
                                                >
                                                    Status
                                                </TableHeading>
                                                <TableHeading>
                                                    Door Access
                                                </TableHeading>
                                                <TableHeading
                                                    fieldName="created_at"
                                                    sortable={true}
                                                    sortField={queryParams.sort_field}
                                                    sortDirection={queryParams.sort_direction}
                                                    onSortChange={onSortChange}
                                                >
                                                    Created
                                                </TableHeading>
                                                <TableHeading className="text-right">Actions</TableHeading>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {cards.data.length > 0 ? (
                                                cards.data.map((card) => (
                                                    <tr key={card.id} className="hover:bg-blue-50 transition-colors">
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 font-medium">
                                                            #{card.id}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                                            <div className="flex items-center">
                                                                <FaCreditCard className="mr-2 h-4 w-4 text-blue-500" />
                                                                {card.name}
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 font-mono">
                                                            {card.rfid_uid}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700">
                                                            {card.description || <span className="text-gray-400 italic">No description</span>}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${card.active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {card.active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <DoorAccessBadge doors={card.doors} />
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                            {card.created_at}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <button
                                                                    onClick={() => openEditModal(card)}
                                                                    type="button"
                                                                    className="inline-flex items-center rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors"
                                                                    title="Edit card"
                                                                >
                                                                    <FiEdit className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => openDeleteModal(card)}
                                                                    type="button"
                                                                    className="inline-flex items-center rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                                                                    title="Delete card"
                                                                >
                                                                    <FiTrash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FaCreditCard className="h-12 w-12 text-gray-300 mb-3" />
                                                            <p className="font-medium text-gray-600">No cards found</p>
                                                            <p className="text-gray-500 mt-1">
                                                                {showOnlyActive
                                                                    ? 'No active cards found. Try showing all cards or add a new one.'
                                                                    : 'Try adjusting your search filters or add a new card.'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border-t border-gray-200 px-4 py-3">
                                    <Pagination pagination={cards.meta} queryParams={queryParams} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CreateForm openModal={createModalOpen} closeModal={closeCreateModal} />
            <EditForm openModal={editModalOpen} closeModal={closeEditModal} card={selectedCard} />
            <DeleteForm openModal={deleteModalOpen} closeModal={closeDeleteModal} card={selectedCard} />
        </AuthenticatedLayout>
    );
}