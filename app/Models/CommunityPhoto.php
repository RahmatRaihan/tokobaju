<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['image_path', 'caption', 'sort_order', 'is_active'])]
class CommunityPhoto extends Model
{
    protected $appends = ['url'];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    protected function url(): Attribute
    {
        return Attribute::get(fn () => image_url($this->image_path));
    }
}
