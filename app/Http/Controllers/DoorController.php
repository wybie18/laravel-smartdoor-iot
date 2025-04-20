<?php
namespace App\Http\Controllers;

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

        $sortField     = request("sort_field", "start");
        $sortDirection = request("sort_direction", "desc");

        $doors = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return Inertia::render('Door/Index', [
            'doors'       => $doors,
            'queryParams' => request()->query() ?: null,
        ]);
    }
}
