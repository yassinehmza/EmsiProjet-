<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Soutenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'heure',
        'salle',
        'note_finale',
        'etudiant_id',
        'jury_id',
    ];

    protected $casts = [
        'date' => 'date',
        'heure' => 'datetime:H:i',
        'note_finale' => 'float',
    ];

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function jury(): BelongsTo
    {
        return $this->belongsTo(Jury::class);
    }
}
