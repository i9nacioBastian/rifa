<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Raffle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'image',
        'number_price',
        'total_numbers',
        'theme',
        'status',
    ];

    protected $casts = [
        'number_price' => 'decimal:2',
        'total_numbers' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function prizes()
    {
        return $this->hasMany(RafflePrize::class)->orderBy('order');
    }

    public function sales()
    {
        return $this->hasMany(RaffleSale::class);
    }

    public function results()
    {
        return $this->hasMany(RaffleResult::class);
    }

    public function winners()
    {
        return $this->hasMany(RaffleResult::class)->where('type', 'winner');
    }

    public function losers()
    {
        return $this->hasMany(RaffleResult::class)->where('type', 'loser');
    }
}
