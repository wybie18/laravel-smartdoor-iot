<?php
namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardResource extends JsonResource
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
            'user'        => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ],
            'rfid_uid'    => $this->rfid_uid,
            'name'        => $this->name,
            'description' => $this->description,
            'active'      => $this->active,
            'created_at'  => (new Carbon($this->created_at))->format('M d, Y'),
            'updated_at'  => (new Carbon($this->updated_at))->format('M d, Y'),
        ];
    }
}
