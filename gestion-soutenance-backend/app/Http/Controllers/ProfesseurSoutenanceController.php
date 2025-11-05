<?php

namespace App\Http\Controllers;

use App\Models\Professeur;
use App\Models\Soutenance;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class ProfesseurSoutenanceController extends Controller
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
     *   path="/api/professeurs/{professeur}/soutenances",
     *   tags={"Soutenances"},
     *   summary="Lister les soutenances où le professeur est membre du jury",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="professeur", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Liste des soutenances")
     * )
     */
    public function index(Request $request, Professeur $professeur)
    {
        $user = $this->ensureProfesseur($request);
        if ($user->id !== $professeur->id) {
            abort(403, 'Accès interdit');
        }

        $soutenances = Soutenance::with(['etudiant:id,nom,prenom,email','jury'])
            ->whereHas('jury', function ($q) use ($professeur) {
                $q->where('president_id', $professeur->id)
                  ->orWhere('rapporteur_id', $professeur->id)
                  ->orWhere('encadrant_id', $professeur->id)
                  ->orWhere('examinateur_id', $professeur->id);
            })
            ->orderByDesc('date')
            ->orderByDesc('heure')
            ->get();

        return response()->json(['soutenances' => $soutenances]);
    }
}