<?php

namespace App\Http\Controllers;

use App\Models\Professeur;
use App\Models\Rapport;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class ProfesseurRapportController extends Controller
{
    private function ensureProfesseur(Request $request): Professeur
    {
        $user = $request->user();
        if (!($user instanceof Professeur)) {
            abort(403, "Accès réservé au professeur");
        }
        return $user;
    }

    /**
     * @OA\Get(
     *   path="/api/professeurs/{professeur}/rapports",
     *   tags={"Rapports"},
     *   summary="Lister les rapports des étudiants assignés (encadrant ou rapporteur)",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="professeur", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Liste des rapports")
     * )
     */
    public function index(Request $request, Professeur $professeur)
    {
        $user = $this->ensureProfesseur($request);
        if ($user->id !== $professeur->id) {
            abort(403, 'Accès interdit');
        }

        $rapports = Rapport::whereHas('etudiant', function ($q) use ($professeur) {
            $q->where('encadrant_id', $professeur->id)
              ->orWhere('rapporteur_id', $professeur->id);
        })->with('etudiant:id,nom,prenom,email')->orderByDesc('date_depot')->get();

        return response()->json(['rapports' => $rapports]);
    }

    /**
     * Get students assigned to this professor (as encadrant or rapporteur)
     */
    public function getEtudiants(Request $request, Professeur $professeur)
    {
        $user = $this->ensureProfesseur($request);
        if ($user->id !== $professeur->id) {
            abort(403, 'Accès interdit');
        }

        $etudiants = \App\Models\Etudiant::where(function($q) use ($professeur) {
            $q->where('encadrant_id', $professeur->id)
              ->orWhere('rapporteur_id', $professeur->id);
        })
        ->with(['encadrant:id,nom,prenom', 'rapporteur:id,nom,prenom'])
        ->select('id', 'nom', 'prenom', 'email', 'filiere', 'type_stage', 'encadrant_id', 'rapporteur_id')
        ->get();

        return response()->json(['etudiants' => $etudiants]);
    }
}