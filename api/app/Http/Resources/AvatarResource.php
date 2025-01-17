<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AvatarResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
   */
  public function toArray($request)
  {
    return [
      'fileName' => $this->first()->file_name ? $this->first()->file_name : '',
      'url' => $this->first()->getUrl() ? $this->first()->getUrl() : '#',
    ];
  }
}
