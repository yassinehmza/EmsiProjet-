<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Professeur;
use Illuminate\Support\Facades\Hash;

class ProfesseurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $professeurs = [
            [
                'nom' => 'Bennani',
                'prenom' => 'Ahmed',
                'email' => 'professeur@gmail.com',
                'mot_de_passe' => Hash::make('professeur123'),
                'role_soutenance' => 'encadrant',
            ],
            [
                'nom' => 'Tazi',
                'prenom' => 'Karim',
                'email' => 'karim.tazi@emsi.ma',
                'mot_de_passe' => Hash::make('pass123'),
                'role_soutenance' => 'president',
            ],
            [
                'nom' => 'Sabri',
                'prenom' => 'Laila',
                'email' => 'laila.sabri@emsi.ma',
                'mot_de_passe' => Hash::make('pass123'),
                'role_soutenance' => 'rapporteur',
            ],
            [
                'nom' => 'Hamdi',
                'prenom' => 'Youssef',
                'email' => 'youssef.hamdi@emsi.ma',
                'mot_de_passe' => Hash::make('pass123'),
                'role_soutenance' => 'examinateur',
            ],
        ];

        foreach ($professeurs as $professeur) {
            Professeur::firstOrCreate(
                ['email' => $professeur['email']],
                $professeur
            );
        }
    }
}
