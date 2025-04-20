<?php
namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoorResource extends JsonResource
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
            'name'        => $this->name,
            'description' => $this->description,
            'key'         => $this->key,
            'created_at'  => (new Carbon($this->created_at))->format('M d, Y g:i A'),
            'updated_at'  => (new Carbon($this->updated_at))->format('M d, Y g:i A'),
        ];
    }
}
