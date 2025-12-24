<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EtudiantRapportController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RemarqueController;
use App\Http\Controllers\ProfesseurRapportController;
use App\Http\Controllers\ProfesseurSoutenanceController;
use App\Http\Controllers\JuryController;
use App\Http\Controllers\SoutenanceController;
use App\Http\Controllers\EtudiantSoutenanceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Status endpoint (public)
Route::get('/status', [App\Http\Controllers\StatusController::class, 'check']);

// Auth endpoints par rôle
Route::post('/auth/etudiant/login', [AuthController::class, 'loginEtudiant']);
Route::post('/auth/professeur/login', [AuthController::class, 'loginProfesseur']);
Route::post('/auth/admin/login', [AuthController::class, 'loginAdministrateur']);

// Rapports étudiants (dépôt + liste)
Route::post('/etudiants/{etudiant}/rapports', [EtudiantRapportController::class, 'store']);
Route::middleware('auth:sanctum')->get('/etudiants/{etudiant}/rapports', [EtudiantRapportController::class, 'index']);
Route::middleware('auth:sanctum')->get('/rapports/{rapport}/download', [EtudiantRapportController::class, 'download']);
// Soutenance de l'étudiant (consultation)
Route::middleware('auth:sanctum')->get('/etudiants/{etudiant}/soutenance', [EtudiantSoutenanceController::class, 'show']);

// --- Routes protégées Admin ---
Route::middleware('auth:sanctum')->group(function () {
    // Étudiants
    Route::get('/admin/etudiants', [AdminController::class, 'listEtudiants']);
    Route::post('/admin/etudiants', [AdminController::class, 'createEtudiant']);
    Route::put('/admin/etudiants/{etudiant}', [AdminController::class, 'updateEtudiant']);
    Route::delete('/admin/etudiants/{etudiant}', [AdminController::class, 'deleteEtudiant']);
    Route::put('/admin/etudiants/{etudiant}/affectations', [AdminController::class, 'assignEtudiantRoles']);

    // Professeurs
    Route::get('/admin/professeurs', [AdminController::class, 'listProfesseurs']);
    Route::post('/admin/professeurs', [AdminController::class, 'createProfesseur']);
    Route::put('/admin/professeurs/{professeur}', [AdminController::class, 'updateProfesseur']);
    Route::delete('/admin/professeurs/{professeur}', [AdminController::class, 'deleteProfesseur']);

    // Remarques sur rapport (professeur)
    Route::get('/rapports/{rapport}/remarques', [RemarqueController::class, 'indexByRapport']);
    Route::post('/rapports/{rapport}/remarques', [RemarqueController::class, 'store']);

    // Rapports visibles par un professeur (étudiants assignés)
    Route::get('/professeurs/{professeur}/rapports', [ProfesseurRapportController::class, 'index']);
    Route::get('/professeurs/{professeur}/etudiants', [ProfesseurRapportController::class, 'getEtudiants']);
    // Soutenances où le professeur est membre du jury
    Route::get('/professeurs/{professeur}/soutenances', [ProfesseurSoutenanceController::class, 'index']);

    // Gestion Juries (Admin)
    Route::get('/admin/juries', [JuryController::class, 'index']);
    Route::get('/admin/juries/{jury}', [JuryController::class, 'show']);
    Route::post('/admin/juries', [JuryController::class, 'store']);
    Route::put('/admin/juries/{jury}', [JuryController::class, 'update']);
    Route::delete('/admin/juries/{jury}', [JuryController::class, 'destroy']);
    Route::put('/admin/juries/{jury}/annuler', [JuryController::class, 'cancel']);

    // Planification Soutenances (Admin)
    Route::get('/admin/soutenances', [SoutenanceController::class, 'index']);
    Route::get('/admin/soutenances/{soutenance}', [SoutenanceController::class, 'show']);
    Route::post('/admin/soutenances', [SoutenanceController::class, 'store']);
    Route::put('/admin/soutenances/{soutenance}', [SoutenanceController::class, 'update']);
    Route::delete('/admin/soutenances/{soutenance}', [SoutenanceController::class, 'destroy']);
    Route::put('/admin/soutenances/{soutenance}/note', [SoutenanceController::class, 'updateNote']);
    Route::put('/admin/soutenances/{soutenance}/annuler', [SoutenanceController::class, 'cancel']);
});
