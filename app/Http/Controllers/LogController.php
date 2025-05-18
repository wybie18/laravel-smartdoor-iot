<?php
namespace App\Http\Controllers;

use App\Http\Resources\LogResource;
use App\Models\AccessLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogController extends Controller
{
    public function index()
    {
        $query = AccessLog::with(['door', 'rfidTag.user']);
        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('rfid_tags.name', 'like', "%{$search}%")
                    ->orWhere('doors.name', 'like', "%{$search}%");
            });
        }

        if (request('success')) {
            $query->where('success', true);
        }

        if (request('failed')) {
            $query->where('success', false);
        }

        $sortField     = request("sort_field", "access_time");
        $sortDirection = request("sort_direction", "desc");

        $logs = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return Inertia::render('Log/Index', [
            'logs'        => LogResource::collection($logs),
            'queryParams' => request()->query() ?: null,
        ]);
    }
}
