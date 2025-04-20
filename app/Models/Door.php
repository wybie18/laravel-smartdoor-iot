<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Door extends Model
{
    protected $fillable = [
        'name',
        'description',
        'key',
    ];

    protected $hidden = [
        'key'
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
