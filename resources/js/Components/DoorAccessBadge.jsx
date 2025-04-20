import { useState } from 'react';
import { FaDoorOpen } from 'react-icons/fa';

export default function DoorAccessBadge({ doors }) {
    const [showDoors, setShowDoors] = useState(false);
    
    if (!doors || doors.length === 0) {
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                <FaDoorOpen className="mr-1" /> No access
            </span>
        );
    }
    
    return (
        <div className="relative">
            <button 
                onClick={() => setShowDoors(!showDoors)}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <FaDoorOpen className="mr-1" /> {doors.length} door{doors.length !== 1 ? 's' : ''}
            </button>
            
            {showDoors && (
                <div className="fixed z-20 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1 max-h-48 overflow-y-auto">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-900 bg-gray-50 border-b border-gray-200">
                            Access to:
                        </div>
                        {doors.map(door => (
                            <div key={door.id} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                {door.name}
                                {door.description && (
                                    <p className="text-xs text-gray-500 truncate">{door.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}