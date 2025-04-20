<?php
namespace App\Http\Controllers;

use App\Models\AccessLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogController extends Controller
{
    public function index()
    {
        $query = AccessLog::query();
        
        if (request('success')) {
            $query->where('success', true);
        }

        if (request('failed')) {
            $query->where('success', false);
        }

        $sortField     = request("sort_field", "start");
        $sortDirection = request("sort_direction", "desc");

        $logs = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return Inertia::render('Card/Index', [
            'logs'        => $logs,
            'queryParams' => request()->query() ?: null,
        ]);
    }
}
