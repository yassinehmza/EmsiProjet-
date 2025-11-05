<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Remarque extends Model
{
    use HasFactory;

    protected $fillable = [
        'contenu',
        'date_remarque',
        'rapport_id',
        'professeur_id',
    ];

    protected $casts = [
        'date_remarque' => 'date',
    ];

    public function rapport(): BelongsTo
    {
        return $this->belongsTo(Rapport::class);
    }

    public function professeur(): BelongsTo
    {
        return $this->belongsTo(Professeur::class);
    }
}
