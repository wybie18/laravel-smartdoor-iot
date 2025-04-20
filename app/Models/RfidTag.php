<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RfidTag extends Model
{
    protected $fillable = [
        'user_id',
        'rfid_uid',
        'description',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function doors()
    {
        return $this->belongsToMany(Door::class, 'access_permissions');
    }

    public function accessLogs()
    {
        return $this->hasMany(AccessLog::class);
    }
}
