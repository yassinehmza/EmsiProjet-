<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use App\Models\Etudiant;
use App\Models\Professeur;
use App\Models\Rapport;
use App\Models\Remarque;
use Carbon\Carbon;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class RemarqueController extends Controller
{
    private function ensureProfesseur(Request $request): Professeur
    {
        $user = $request->user();
        if (!($user instanceof Professeur)) {
            abort(403, "Accès réservé au professeur");
        }
        return $user;
    }

    private function canViewOrComment(Request $request, Rapport $rapport): bool
    {
        $user = $request->user();
        if ($user instanceof Administrateur) {
            return true;
        }
        if ($user instanceof Professeur) {
            $etudiant = $rapport->etudiant;
            return ($etudiant && ($etudiant->encadrant_id === $user->id || $etudiant->rapporteur_id === $user->id));
        }
        if ($user instanceof Etudiant) {
            return $rapport->etudiant_id === $user->id;
        }
        return false;
    }

    /**
     * @OA\Get(
     *   path="/api/rapports/{rapport}/remarques",
     *   tags={"Remarques"},
     *   summary="Lister les remarques d'un rapport",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="rapport", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Liste des remarques")
     * )
     */
    public function indexByRapport(Request $request, Rapport $rapport)
    {
        if (!$this->canViewOrComment($request, $rapport)) {
            abort(403, 'Accès interdit');
        }
        $remarques = $rapport->remarques()->with('professeur:id,nom,prenom,email')->orderByDesc('date_remarque')->get();
        return response()->json(['remarques' => $remarques]);
    }

    /**
     * @OA\Post(
     *   path="/api/rapports/{rapport}/remarques",
     *   tags={"Remarques"},
     *   summary="Ajouter une remarque sur un rapport",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="rapport", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(required=true, @OA\JsonContent(
     *     required={"contenu"},
     *     @OA\Property(property="contenu", type="string")
     *   )),
     *   @OA\Response(response=201, description="Remarque créée")
     * )
     */
    public function store(Request $request, Rapport $rapport)
    {
        $prof = $this->ensureProfesseur($request);
        if (!$this->canViewOrComment($request, $rapport)) {
            abort(403, 'Accès interdit');
        }
        $data = $request->validate([
            'contenu' => 'required|string',
        ]);

        $remarque = Remarque::create([
            'contenu' => $data['contenu'],
            'date_remarque' => Carbon::now()->toDateString(),
            'rapport_id' => $rapport->id,
            'professeur_id' => $prof->id,
        ]);

        return response()->json(['remarque' => $remarque], 201);
    }
}