<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EtudiantRapportController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RemarqueController;
use App\Http\Controllers\ProfesseurRapportController;
use App\Http\Controllers\JuryController;
use App\Http\Controllers\SoutenanceController;

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

// Auth endpoints par rôle
Route::post('/auth/etudiant/login', [AuthController::class, 'loginEtudiant']);
Route::post('/auth/professeur/login', [AuthController::class, 'loginProfesseur']);
Route::post('/auth/admin/login', [AuthController::class, 'loginAdministrateur']);

// Rapports étudiants (dépôt + liste)
Route::post('/etudiants/{etudiant}/rapports', [EtudiantRapportController::class, 'store']);
Route::middleware('auth:sanctum')->get('/etudiants/{etudiant}/rapports', [EtudiantRapportController::class, 'index']);

// --- Routes protégées Admin ---
Route::middleware('auth:sanctum')->group(function () {
    // Étudiants
    Route::post('/admin/etudiants', [AdminController::class, 'createEtudiant']);
    Route::put('/admin/etudiants/{etudiant}', [AdminController::class, 'updateEtudiant']);
    Route::delete('/admin/etudiants/{etudiant}', [AdminController::class, 'deleteEtudiant']);
    Route::put('/admin/etudiants/{etudiant}/affectations', [AdminController::class, 'assignEtudiantRoles']);

    // Professeurs
    Route::post('/admin/professeurs', [AdminController::class, 'createProfesseur']);
    Route::put('/admin/professeurs/{professeur}', [AdminController::class, 'updateProfesseur']);
    Route::delete('/admin/professeurs/{professeur}', [AdminController::class, 'deleteProfesseur']);

    // Remarques sur rapport (professeur)
    Route::get('/rapports/{rapport}/remarques', [RemarqueController::class, 'indexByRapport']);
    Route::post('/rapports/{rapport}/remarques', [RemarqueController::class, 'store']);

    // Rapports visibles par un professeur (étudiants assignés)
    Route::get('/professeurs/{professeur}/rapports', [ProfesseurRapportController::class, 'index']);

    // Gestion Juries (Admin)
    Route::get('/admin/juries', [JuryController::class, 'index']);
    Route::post('/admin/juries', [JuryController::class, 'store']);
    Route::put('/admin/juries/{jury}', [JuryController::class, 'update']);
    Route::delete('/admin/juries/{jury}', [JuryController::class, 'destroy']);

    // Planification Soutenances (Admin)
    Route::get('/admin/soutenances', [SoutenanceController::class, 'index']);
    Route::post('/admin/soutenances', [SoutenanceController::class, 'store']);
    Route::put('/admin/soutenances/{soutenance}', [SoutenanceController::class, 'update']);
    Route::put('/admin/soutenances/{soutenance}/note', [SoutenanceController::class, 'updateNote']);
});
