<?php
namespace App\Http\Controllers;

use App\Http\Resources\CardResource;
use App\Models\RfidTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CardController extends Controller
{
    public function index()
    {
        $query = RfidTag::query();

        if ($search = request('search')) {
            $query->where('rfid_uid', 'like', '%' . $search . '%')
                ->orWhere('name', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%');
        }
        if (request('active')) {
            $query->where('active', true);
        }
        $sortField     = request("sort_field", "start");
        $sortDirection = request("sort_direction", "desc");

        $cards = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return Inertia::render('Card/Index', [
            'cards'       => CardResource::collection($cards),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rfid_uid'    => 'required|string|unique:rfid_tags,rfid_uid',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'active'      => 'boolean',
        ]);

        RfidTag::create([
             ...$validated,
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('cards.index')->with('success', 'RFID Card created successfully');
    }

    public function update(Request $request, RfidTag $card)
    {
        $validated = $request->validate([
            'rfid_uid'    => 'required|string|unique:rfid_tags,rfid_uid,' . $card->id,
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'active'      => 'boolean',
        ]);

        $card->update($validated);

        return redirect()->route('cards.index')->with('success', 'RFID Card updated successfully');
    }

    public function destroy(RfidTag $card)
    {
        $card->delete();
        return redirect()->route('cards.index')->with('success', 'RFID Card deleted successfully');
    }

}
