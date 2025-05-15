<?php

namespace App\Http\Controllers;

use App\Models\AccessLog;
use App\Models\Door;
use App\Models\RfidTag;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){
        $user = Auth::user();
        $totalDoors = Door::count();
        $totalActiveCards = RfidTag::where('active', true)->count();
        $userCards = $user->rfidTags()->count();

        $recentLogs = AccessLog::with(['door', 'rfidTag.user'])
            ->where('access_time', '>=', Carbon::now()->subDays(7))
            ->latest('access_time')
            ->take(10)
            ->get();
        
        $successfulAccess = AccessLog::where('success', true)
            ->where('access_time', '>=', Carbon::now()->subDays(30))
            ->count();

        $deniedAccess = AccessLog::where('success', false)
            ->where('access_time', '>=', Carbon::now()->subDays(30))
            ->count();

        $dailyStats = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $displayDate = Carbon::now()->subDays($i)->format('M d');
            
            $successCount = AccessLog::where('success', true)
                ->whereDate('access_time', $date)
                ->count();
                
            $failCount = AccessLog::where('success', false)
                ->whereDate('access_time', $date)
                ->count();
                
            $dailyStats[] = [
                'date' => $displayDate,
                'successful' => $successCount,
                'denied' => $failCount,
            ];
        }

        $topDoors = Door::withCount(['accessLogs' => function ($query) {
                $query->where('access_time', '>=', Carbon::now()->subDays(30));
            }])
            ->orderByDesc('access_logs_count')
            ->take(5)
            ->get()
            ->map(function ($door) {
                return [
                    'id' => $door->id,
                    'name' => $door->name,
                    'count' => $door->access_logs_count,
                ];
            });
        
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalDoors' => $totalDoors,
                'totalActiveCards' => $totalActiveCards,
                'userCards' => $userCards,
                'successfulAccess' => $successfulAccess,
                'deniedAccess' => $deniedAccess,
            ],
            'recentLogs' => $recentLogs,
            'dailyStats' => $dailyStats,
            'topDoors' => $topDoors,
        ]);
    }
}
