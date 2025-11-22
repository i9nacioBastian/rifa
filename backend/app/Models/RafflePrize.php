<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RafflePrize extends Model
{
    use HasFactory;

    protected $fillable = [
        'raffle_id',
        'name',
        'description',
        'order',
    ];

    public function raffle()
    {
        return $this->belongsTo(Raffle::class);
    }

    public function results()
    {
        return $this->hasMany(RaffleResult::class);
    }
}
