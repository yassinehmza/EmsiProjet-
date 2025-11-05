<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Professeur extends Model
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'role_soutenance',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    public function remarques(): HasMany
    {
        return $this->hasMany(Remarque::class);
    }

    public function juriesAsPresident(): HasMany
    {
        return $this->hasMany(Jury::class, 'president_id');
    }

    public function juriesAsRapporteur(): HasMany
    {
        return $this->hasMany(Jury::class, 'rapporteur_id');
    }

    public function juriesAsEncadrant(): HasMany
    {
        return $this->hasMany(Jury::class, 'encadrant_id');
    }

    public function juriesAsExaminateur(): HasMany
    {
        return $this->hasMany(Jury::class, 'examinateur_id');
    }
}
