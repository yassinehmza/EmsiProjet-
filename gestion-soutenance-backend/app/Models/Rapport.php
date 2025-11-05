<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rapport extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'date_depot',
        'commentaire',
        'etat',
        'etudiant_id',
    ];

    protected $casts = [
        'date_depot' => 'date',
    ];

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function remarques(): HasMany
    {
        return $this->hasMany(Remarque::class);
    }
}
