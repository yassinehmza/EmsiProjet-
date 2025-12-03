<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Etudiant extends Model
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'filiere',
        'type_stage',
        'encadrant_id',
        'rapporteur_id',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    public function rapports(): HasMany
    {
        return $this->hasMany(Rapport::class);
    }

    public function soutenance(): HasOne
    {
        return $this->hasOne(Soutenance::class);
    }

    public function encadrant(): BelongsTo
    {
        return $this->belongsTo(Professeur::class, 'encadrant_id');
    }

    public function rapporteur(): BelongsTo
    {
        return $this->belongsTo(Professeur::class, 'rapporteur_id');
    }
}
