<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Etudiant;
use Illuminate\Support\Facades\Hash;

class EtudiantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $etudiants = [
            [
                'nom' => 'Benali',
                'prenom' => 'Hassan',
                'email' => 'etudiant@gmail.com',
                'mot_de_passe' => Hash::make('etudiant123'),
                'filiere' => 'Génie Informatique',
                'type_stage' => 'PFE',
            ],
            [
                'nom' => 'Idrissi',
                'prenom' => 'Fatima',
                'email' => 'fatima.idrissi@emsi.ma',
                'mot_de_passe' => Hash::make('pass123'),
                'filiere' => 'Réseaux et Sécurité',
                'type_stage' => 'Stage',
            ],
            [
                'nom' => 'Alaoui',
                'prenom' => 'Mohammed',
                'email' => 'mohammed.alaoui@emsi.ma',
                'mot_de_passe' => Hash::make('pass123'),
                'filiere' => 'Data Science',
                'type_stage' => 'PFE',
            ],
            [
                'nom' => 'choukri',
                'prenom' => 'badr',
                'email' => 'badr.choukri@emsi.ma',
                'mot_de_passe' => Hash::make('pass123'),
                'filiere' => 'Resaux et Sécurité',
                'type_stage' => 'PFE',
            ],
        ];

        foreach ($etudiants as $etudiant) {
            Etudiant::firstOrCreate(
                ['email' => $etudiant['email']],
                $etudiant
            );
        }
    }
}
