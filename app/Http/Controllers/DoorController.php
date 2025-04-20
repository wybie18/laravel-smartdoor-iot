<?php
namespace App\Http\Controllers;

use App\Http\Resources\DoorResource;
use App\Models\Door;
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
}
