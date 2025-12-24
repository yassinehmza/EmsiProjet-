<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use App\Models\Rapport;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Illuminate\Support\Facades\Storage;

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
            'type_rapport' => 'nullable|string|max:100',
            'fichier' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // 10MB max
            'commentaire' => 'nullable|string',
        ]);

        // Handle file upload
        $fichierPath = null;
        if ($request->hasFile('fichier')) {
            $fichierPath = $request->file('fichier')->store('rapports', 'public');
        }

        $rapport = Rapport::create([
            'titre' => $data['titre'],
            'type_rapport' => $data['type_rapport'] ?? 'general',
            'date_depot' => now(),
            'fichier_path' => $fichierPath,
            'commentaire' => $data['commentaire'] ?? null,
            'etat' => 'en_attente',
            'etudiant_id' => $etudiant->id,
        ]);

        return response()->json(['rapport' => $rapport], 201);
    }

    /**
     * Download rapport file
     */
    public function download(Request $request, Rapport $rapport)
    {
        $user = $request->user();
        
        // Check access: etudiant owner, or professeur assigned, or admin
        $canAccess = false;
        if ($user instanceof Etudiant && $user->id === $rapport->etudiant_id) {
            $canAccess = true;
        } elseif ($user instanceof \App\Models\Professeur) {
            $etudiant = Etudiant::find($rapport->etudiant_id);
            if ($etudiant && ($etudiant->encadrant_id === $user->id || $etudiant->rapporteur_id === $user->id)) {
                $canAccess = true;
            }
        } elseif ($user instanceof \App\Models\Administrateur) {
            $canAccess = true;
        }

        if (!$canAccess) {
            abort(403, 'Accès interdit');
        }

        if (!$rapport->fichier_path || !Storage::disk('public')->exists($rapport->fichier_path)) {
            abort(404, 'Fichier non trouvé');
        }

        return Storage::disk('public')->download($rapport->fichier_path, basename($rapport->fichier_path));
    }
}