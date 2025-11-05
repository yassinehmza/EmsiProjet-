<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use App\Models\Rapport;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class EtudiantRapportController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/etudiants/{etudiant}/rapports",
     *   tags={"Rapports"},
     *   summary="Lister les rapports d'un étudiant",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="etudiant", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Liste des rapports")
     * )
     */
    public function index(Request $request, Etudiant $etudiant)
    {
        $user = $request->user();
        if ($user instanceof Etudiant && $user->id !== $etudiant->id) {
            abort(403, 'Accès interdit');
        }
        $rapports = Rapport::where('etudiant_id', $etudiant->id)->orderByDesc('date_depot')->get();
        return response()->json(['rapports' => $rapports]);
    }

    /**
     * @OA\Post(
     *   path="/api/etudiants/{etudiant}/rapports",
     *   tags={"Rapports"},
     *   summary="Dépôt de rapport par étudiant",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="etudiant", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"titre","date_depot"},
     *       @OA\Property(property="titre", type="string"),
     *       @OA\Property(property="date_depot", type="string", format="date"),
     *       @OA\Property(property="commentaire", type="string")
     *     )
     *   ),
     *   @OA\Response(response=201, description="Rapport créé"),
     *   @OA\Response(response=400, description="Validation échouée")
     * )
     */
    public function store(Request $request, Etudiant $etudiant)
    {
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'date_depot' => 'required|date',
            'commentaire' => 'nullable|string',
        ]);

        $rapport = Rapport::create([
            'titre' => $data['titre'],
            'date_depot' => $data['date_depot'],
            'commentaire' => $data['commentaire'] ?? null,
            'etat' => 'en_attente',
            'etudiant_id' => $etudiant->id,
        ]);

        return response()->json(['rapport' => $rapport], 201);
    }
}