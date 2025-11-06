<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Administrateur;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Administrateur::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'nom' => 'Admin',
                'prenom' => 'Principal',
                'mot_de_passe' => Hash::make('admin123'),
            ]
        );
    }
}