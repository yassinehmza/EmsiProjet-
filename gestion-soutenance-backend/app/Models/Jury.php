<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Jury extends Model
{
    use HasFactory;

    protected $fillable = [
        'president_id',
        'rapporteur_id',
        'encadrant_id',
        'examinateur_id',
    ];

    public function president(): BelongsTo
    {
        return $this->belongsTo(Professeur::class, 'president_id');
    }

    public function rapporteur(): BelongsTo
    {
        return $this->belongsTo(Professeur::class, 'rapporteur_id');
    }

    public function encadrant(): BelongsTo
    {
        return $this->belongsTo(Professeur::class, 'encadrant_id');
    }

    public function examinateur(): BelongsTo
    {
        return $this->belongsTo(Professeur::class, 'examinateur_id');
    }

    public function soutenance(): HasOne
    {
        return $this->hasOne(Soutenance::class);
    }
}
