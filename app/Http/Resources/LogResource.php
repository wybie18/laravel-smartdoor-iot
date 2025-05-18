<?php
namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'success'     => $this->success,
            'notes'       => $this->notes,
            'rfid_tag'    => new CardResource($this->rfidTag),
            'door'        => new DoorResource($this->door),
            'access_time' => (new Carbon($this->access_time))->format('M d, Y H:i:s'),
            'created_at'  => (new Carbon($this->created_at))->format('M d, Y H:i:s'),
            'updated_at'  => (new Carbon($this->updated_at))->format('M d, Y H:i:s'),
        ];
    }
}
