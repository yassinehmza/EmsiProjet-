<?php

// Script pour afficher le flux complet de l'application

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Etudiant;
use App\Models\Professeur;
use App\Models\Rapport;
use App\Models\Soutenance;

echo "═══════════════════════════════════════════════════════════════\n";
echo "            📊 FLUX COMPLET DE L'APPLICATION\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

// Étudiant 1
$etudiant1 = Etudiant::with(['rapports.remarques.professeur', 'soutenance.jury'])->find(1);
echo "🎓 ÉTUDIANT 1: {$etudiant1->prenom} {$etudiant1->nom}\n";
echo "   Email: {$etudiant1->email}\n";
echo "   Filière: {$etudiant1->filiere}\n";
echo "   Type de stage: {$etudiant1->type_stage}\n";
if ($etudiant1->encadrant_id) {
    $enc = Professeur::find($etudiant1->encadrant_id);
    echo "   Encadrant: Prof. {$enc->prenom} {$enc->nom}\n";
}
if ($etudiant1->rapporteur_id) {
    $rap = Professeur::find($etudiant1->rapporteur_id);
    echo "   Rapporteur: Prof. {$rap->prenom} {$rap->nom}\n";
}
echo "\n   📄 RAPPORT:\n";
foreach ($etudiant1->rapports as $rapport) {
    echo "      Titre: {$rapport->titre}\n";
    echo "      Date dépôt: {$rapport->date_depot}\n";
    echo "      État: {$rapport->etat}\n";
    echo "      Remarques: {$rapport->remarques->count()}\n";
    foreach ($rapport->remarques as $remarque) {
        $prof = $remarque->professeur;
        echo "         - [{$remarque->date_remarque}] Prof. {$prof->nom}: {$remarque->contenu}\n";
    }
}
if ($etudiant1->soutenance) {
    $s = $etudiant1->soutenance;
    echo "\n   🎯 SOUTENANCE:\n";
    echo "      Date: {$s->date} à {$s->heure}\n";
    echo "      Salle: {$s->salle}\n";
    echo "      Note finale: " . ($s->note_finale ?? 'En attente') . "\n";
    if ($s->jury) {
        echo "      Jury:\n";
        $pres = Professeur::find($s->jury->president_id);
        $rapp = Professeur::find($s->jury->rapporteur_id);
        $enca = Professeur::find($s->jury->encadrant_id);
        $exam = Professeur::find($s->jury->examinateur_id);
        echo "         Président: Prof. {$pres->nom}\n";
        echo "         Rapporteur: Prof. {$rapp->nom}\n";
        echo "         Encadrant: Prof. {$enca->nom}\n";
        echo "         Examinateur: Prof. {$exam->nom}\n";
    }
}
echo "\n" . str_repeat("─", 63) . "\n\n";

// Étudiant 2
$etudiant2 = Etudiant::with(['rapports.remarques', 'soutenance'])->find(2);
echo "🎓 ÉTUDIANT 2: {$etudiant2->prenom} {$etudiant2->nom}\n";
echo "   Email: {$etudiant2->email}\n";
echo "   Filière: {$etudiant2->filiere}\n";
echo "   Type de stage: {$etudiant2->type_stage}\n";
echo "\n   📄 RAPPORT:\n";
foreach ($etudiant2->rapports as $rapport) {
    echo "      Titre: {$rapport->titre}\n";
    echo "      État: {$rapport->etat}\n";
    echo "      Remarques: {$rapport->remarques->count()}\n";
}
if ($etudiant2->soutenance) {
    $s = $etudiant2->soutenance;
    echo "\n   🎯 SOUTENANCE:\n";
    echo "      Date: {$s->date} à {$s->heure}\n";
    echo "      Salle: {$s->salle}\n";
    echo "      Note finale: " . ($s->note_finale ?? 'En attente') . "\n";
}
echo "\n" . str_repeat("─", 63) . "\n\n";

// Étudiant 3
$etudiant3 = Etudiant::with(['rapports.remarques', 'soutenance'])->find(3);
echo "🎓 ÉTUDIANT 3: {$etudiant3->prenom} {$etudiant3->nom}\n";
echo "   Email: {$etudiant3->email}\n";
echo "   Filière: {$etudiant3->filiere}\n";
echo "   Type de stage: {$etudiant3->type_stage}\n";
echo "\n   📄 RAPPORT:\n";
foreach ($etudiant3->rapports as $rapport) {
    echo "      Titre: {$rapport->titre}\n";
    echo "      État: {$rapport->etat}\n";
    echo "      Remarques: {$rapport->remarques->count()}\n";
}
if ($etudiant3->soutenance) {
    $s = $etudiant3->soutenance;
    echo "\n   🎯 SOUTENANCE:\n";
    echo "      Date: {$s->date} à {$s->heure}\n";
    echo "      Salle: {$s->salle}\n";
    echo "      Note finale: " . ($s->note_finale ?? 'En attente') . "\n";
}

echo "\n═══════════════════════════════════════════════════════════════\n";
echo "✅ Flux complet affiché avec succès!\n";
echo "═══════════════════════════════════════════════════════════════\n";
