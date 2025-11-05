<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use App\Models\Etudiant;
use App\Models\Soutenance;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class EtudiantSoutenanceController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/etudiants/{etudiant}/soutenance",
     *   tags={"Soutenances"},
     *   summary="Afficher la soutenance d'un étudiant",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="etudiant", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Détails de la soutenance"),
     *   @OA\Response(response=404, description="Aucune soutenance")
     * )
     */
    public function show(Request $request, Etudiant $etudiant)
    {
        $user = $request->user();
        if ($user instanceof Etudiant && $user->id !== $etudiant->id) {
            abort(403, 'Accès interdit');
        }
        // L'admin peut consulter; les professeurs consulteront via leur propre endpoint dédié
        if (!($user instanceof Administrateur) && !($user instanceof Etudiant)) {
            abort(403, 'Accès interdit');
        }

        $soutenance = Soutenance::with(['jury', 'etudiant:id,nom,prenom,email'])
            ->where('etudiant_id', $etudiant->id)
            ->first();

        if (!$soutenance) {
            return response()->json(['message' => 'Aucune soutenance planifiée'], 404);
        }

        return response()->json(['soutenance' => $soutenance]);
    }
}