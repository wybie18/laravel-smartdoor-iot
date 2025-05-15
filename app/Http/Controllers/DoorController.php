<?php
namespace App\Http\Controllers;

use App\Http\Resources\DoorResource;
use App\Models\AccessLog;
use App\Models\Door;
use App\Models\RfidTag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoorController extends Controller
{
    public function index()
    {
        $query = Door::query();

        if ($search = request('search')) {
            $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%');
        }

        $sortField     = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $doors = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return Inertia::render('Door/Index', [
            'doors'       => DoorResource::collection($doors),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'key' => 'required|string|unique:doors,key'
        ]);
        
        Door::create($validated);

        return redirect()->route('doors.index')->with('success', 'Door created successfully');
    }

    public function update(Request $request, Door $door)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'key' => 'required|string|unique:doors,key,'.$door->id
        ]);

        $door->update($validated);

        return redirect()->route('doors.index')->with('success', 'Door updated successfully');
    }

    public function destroy(Door $door)
    {
        $door->delete();
        return redirect()->route('doors.index')->with('success', 'Door deleted successfully');
    }

    public function handleAccessAttempt(Request $request)
    {
        $validated = $request->validate([
            'api_key' => 'required|string',
            'rfid_uid' => 'required|string',
        ]);

        $door = Door::where('key', $validated['api_key'])->firstOrFail();
        $rfidTag = RfidTag::where('rfid_uid', $validated['rfid_uid'])->first();

        $accessGranted = $rfidTag && $rfidTag->doors()->where('id', $door->id)->exists();

        AccessLog::create([
            'rfid_tag_id' => $rfidTag?->id,
            'door_id' => $door->id,
            'success' => $accessGranted,
            'notes' => 'RFID access attempt',
        ]);

        return response()->json(['success' => $accessGranted]);
    }

    public function manualUnlock(Door $door)
    {
        $door->update(['last_unlock_at' => now()]);

        AccessLog::create([
            'door_id' => $door->id,
            'success' => true,
            'notes' => 'Manual unlock from web interface',
        ]);

        return back()->with('status', 'Door unlocked!');
    }

    public function checkUnlockCommand(Door $door)
    {
        $shouldUnlock = $door->last_unlock_at && $door->last_unlock_at->diffInSeconds() < 5;
        
        if ($shouldUnlock) {
            $door->update(['last_unlock_at' => null]);
            return response()->json(['unlock' => true]);
        }
        
        return response()->json(['unlock' => false]);
    }

}
