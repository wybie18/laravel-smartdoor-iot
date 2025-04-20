import Modal from "@/Components/Modal"
import { useForm, usePage } from "@inertiajs/react"
import toast from "react-hot-toast"
import { FiX } from "react-icons/fi"

export default function CreateForm({ openModal, closeModal }) {
    const doors = usePage().props.doors.data;
    const { data, setData, post, processing, errors, reset } = useForm({
        rfid_uid: '',
        name: '',
        description: '',
        active: true,
        door_ids: []
    })

    const handleErrors = (errors) => {
        if (errors) {
            let delay = 0
            for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                    setTimeout(() => {
                        toast.error(errors[key])
                    }, delay)
                }
                delay += 150
            }
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        post(route("cards.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Card created successfully!")
                reset()
                closeModal()
            },
            onError: (errors) => handleErrors(errors),
        })
    }

    const toggleDoor = (doorId) => {
        setData("door_ids",
            data.door_ids.includes(doorId)
                ? data.door_ids.filter(id => id !== doorId)
                : [...data.door_ids, doorId]
        )
    }

    return (
        <Modal show={openModal} onClose={closeModal}>
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                    <h2 className="text-lg font-medium text-gray-900">Create New Card</h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                        aria-label="Close"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="rfid_uid" className="block text-sm font-medium text-gray-700">
                            RFID UID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="rfid_uid"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter RFID unique identifier"
                            value={data.rfid_uid}
                            onChange={e => setData('rfid_uid', e.target.value)}
                            required
                        />
                        {errors.rfid_uid && <p className="mt-1 text-xs text-red-500">{errors.rfid_uid}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Card Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter card name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter card description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows="3"
                        ></textarea>
                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                id="active"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={data.active}
                                onChange={e => setData('active', e.target.checked)}
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                Active
                            </label>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Inactive cards will not grant access to doors</p>
                        {errors.active && <p className="mt-1 text-xs text-red-500">{errors.active}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Door Access Permissions
                        </label>
                        <div className="mt-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                            {doors.length === 0 ? (
                                <p className="text-sm text-gray-500 p-2">No doors available</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {doors.map((door) => (
                                        <li key={door.id} className="py-2 px-1">
                                            <div className="flex items-center">
                                                <input
                                                    id={`door-${door.id}`}
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={data.door_ids.includes(door.id)}
                                                    onChange={() => toggleDoor(door.id)}
                                                />
                                                <label htmlFor={`door-${door.id}`} className="ml-2 block text-sm text-gray-700">
                                                    {door.name}
                                                </label>
                                                {door.description && (
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        {door.description}
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">Select which doors this card can access</p>
                        {errors.door_ids && <p className="mt-1 text-xs text-red-500">{errors.door_ids}</p>}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-5 gap-3 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={processing}
                            className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                "Create Card"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

