<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccessLog extends Model
{
    protected $fillable = [
        'rfid_tag_id',
        'door_id',
        'access_time',
        'success',
        'notes'
    ];

    protected $casts = [
        'success' => 'boolean',
        'access_time' => 'datetime'
    ];

    public function door(){
        return $this->belongsTo(Door::class);
    }

    public function rfidTag(){
        return $this->belongsTo(RfidTag::class);
    }
}
