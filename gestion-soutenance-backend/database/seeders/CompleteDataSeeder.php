<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rapport;
use App\Models\Remarque;
use App\Models\Jury;
use App\Models\Soutenance;
use App\Models\Etudiant;

class CompleteDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Créer des rapports pour les étudiants
        echo "Création des rapports...\n";
        
        $rapport1 = Rapport::create([
            'titre' => 'Développement d\'une application mobile de gestion des patients',
            'date_depot' => '2025-11-15',
            'commentaire' => 'Rapport complet avec analyse et implémentation',
            'etat' => 'validé',
            'etudiant_id' => 1
        ]);

        $rapport2 = Rapport::create([
            'titre' => 'Sécurisation d\'un réseau d\'entreprise avec pare-feu nouvelle génération',
            'date_depot' => '2025-11-20',
            'commentaire' => 'Étude de cas réelle avec mise en place de solutions',
            'etat' => 'en_attente',
            'etudiant_id' => 2
        ]);

        $rapport3 = Rapport::create([
            'titre' => 'Analyse prédictive des ventes avec Machine Learning',
            'date_depot' => '2025-11-18',
            'commentaire' => 'Implémentation de modèles de prédiction avec Python',
            'etat' => 'validé',
            'etudiant_id' => 3
        ]);

        echo "✅ Rapports créés: " . Rapport::count() . "\n";

        // 2. Créer des remarques sur les rapports
        echo "Création des remarques...\n";
        
        Remarque::create([
            'contenu' => 'Excellent travail sur l\'architecture de l\'application. Pensez à améliorer la section sécurité.',
            'date_remarque' => '2025-11-16',
            'rapport_id' => $rapport1->id,
            'professeur_id' => 1
        ]);

        Remarque::create([
            'contenu' => 'La méthodologie est bien présentée. Ajoutez plus de tests unitaires dans l\'annexe.',
            'date_remarque' => '2025-11-17',
            'rapport_id' => $rapport1->id,
            'professeur_id' => 3
        ]);

        Remarque::create([
            'contenu' => 'Bon travail sur l\'analyse des risques. Il manque quelques détails sur la configuration du pare-feu.',
            'date_remarque' => '2025-11-21',
            'rapport_id' => $rapport2->id,
            'professeur_id' => 2
        ]);

        Remarque::create([
            'contenu' => 'Excellente implémentation des algorithmes ML. Les résultats sont bien documentés.',
            'date_remarque' => '2025-11-19',
            'rapport_id' => $rapport3->id,
            'professeur_id' => 1
        ]);

        Remarque::create([
            'contenu' => 'Très bon choix de datasets. Pensez à ajouter une analyse de performance comparative.',
            'date_remarque' => '2025-11-20',
            'rapport_id' => $rapport3->id,
            'professeur_id' => 4
        ]);

        echo "✅ Remarques créées: " . Remarque::count() . "\n";

        // 3. Créer des jurys
        echo "Création des jurys...\n";
        
        $jury1 = Jury::create([
            'president_id' => 2,      // Prof. Tazi
            'rapporteur_id' => 3,     // Prof. Sabri
            'encadrant_id' => 1,      // Prof. Bennani
            'examinateur_id' => 4     // Prof. Hamdi
        ]);

        $jury2 = Jury::create([
            'president_id' => 4,      // Prof. Hamdi
            'rapporteur_id' => 1,     // Prof. Bennani
            'encadrant_id' => 2,      // Prof. Tazi
            'examinateur_id' => 3     // Prof. Sabri
        ]);

        echo "✅ Juries créés: " . Jury::count() . "\n";

        // 4. Créer des soutenances
        echo "Création des soutenances...\n";
        
        Soutenance::create([
            'date' => '2025-12-10',
            'heure' => '09:00:00',
            'salle' => 'Amphi A',
            'note_finale' => 16.5,
            'etudiant_id' => 1,  // Hassan Benali
            'jury_id' => $jury1->id
        ]);

        Soutenance::create([
            'date' => '2025-12-10',
            'heure' => '14:00:00',
            'salle' => 'Salle B12',
            'note_finale' => null,  // Pas encore notée
            'etudiant_id' => 2,  // Fatima Idrissi
            'jury_id' => $jury2->id
        ]);

        Soutenance::create([
            'date' => '2025-12-11',
            'heure' => '10:00:00',
            'salle' => 'Amphi A',
            'note_finale' => 17.0,
            'etudiant_id' => 3,  // Mohammed Alaoui
            'jury_id' => $jury1->id
        ]);

        echo "✅ Soutenances créées: " . Soutenance::count() . "\n";

        // 5. Mettre à jour les étudiants avec encadrant et rapporteur
        echo "Affectation des encadrants et rapporteurs...\n";
        
        Etudiant::find(1)->update([
            'encadrant_id' => 1,   // Prof. Bennani
            'rapporteur_id' => 3   // Prof. Sabri
        ]);

        Etudiant::find(2)->update([
            'encadrant_id' => 2,   // Prof. Tazi
            'rapporteur_id' => 1   // Prof. Bennani
        ]);

        Etudiant::find(3)->update([
            'encadrant_id' => 1,   // Prof. Bennani
            'rapporteur_id' => 4   // Prof. Hamdi
        ]);

        echo "✅ Étudiants mis à jour avec leurs encadrants\n";
        echo "\n🎉 Base de données complètement peuplée avec succès!\n";
    }
}
