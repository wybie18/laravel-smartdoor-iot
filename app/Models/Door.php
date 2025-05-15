<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Door extends Model
{
    protected $fillable = [
        'name',
        'description',
        'last_unlock_at',
        'key',
    ];

    protected $casts = [
        'last_unlock_at' => 'datetime',
    ];

    protected $hidden = [
        'key',
    ];

    public function rfidTags()
    {
        return $this->belongsToMany(RfidTag::class, 'access_permissions');
    }

    public function accessLogs()
    {
        return $this->hasMany(AccessLog::class);
    }
}
