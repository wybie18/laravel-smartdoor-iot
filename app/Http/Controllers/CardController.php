<?php
namespace App\Http\Controllers;

use App\Models\RfidTag;
use Illuminate\Http\Request;
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
            'cards'       => $cards,
            'queryParams' => request()->query() ?: null,
        ]);
    }
}
