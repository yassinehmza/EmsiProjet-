<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use App\Models\Etudiant;
use App\Models\Professeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Annotations as OA;

class AdminController extends Controller
{
    private function ensureAdmin(Request $request): void
    {
        if (!($request->user() instanceof Administrateur)) {
            abort(403, 'Accès réservé à l\'administrateur');
        }
    }

    // --- Étudiants ---
    /**
     * @OA\Post(
     *   path="/api/admin/etudiants",
     *   tags={"Admin"},
     *   summary="Créer un étudiant",
     *   security={{"sanctum":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"nom","prenom","email","mot_de_passe","filiere","type_stage"}
     *     )
     *   ),
     *   @OA\Response(response=201, description="Étudiant créé")
     * )
     */
    public function createEtudiant(Request $request)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:etudiants,email',
            'mot_de_passe' => 'required|string|min:6',
            'filiere' => 'required|string|max:255',
            'type_stage' => 'required|string|max:255',
        ]);

        $etudiant = Etudiant::create([
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'email' => $data['email'],
            'mot_de_passe' => Hash::make($data['mot_de_passe']),
            'filiere' => $data['filiere'],
            'type_stage' => $data['type_stage'],
        ]);

        return response()->json(['etudiant' => $etudiant], 201);
    }

    /**
     * @OA\Put(
     *   path="/api/admin/etudiants/{etudiant}",
     *   tags={"Admin"},
     *   summary="Mettre à jour un étudiant",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="etudiant", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function updateEtudiant(Request $request, Etudiant $etudiant)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:etudiants,email,' . $etudiant->id,
            'mot_de_passe' => 'sometimes|string|min:6',
            'filiere' => 'sometimes|string|max:255',
            'type_stage' => 'sometimes|string|max:255',
        ]);

        if (isset($data['mot_de_passe'])) {
            $data['mot_de_passe'] = Hash::make($data['mot_de_passe']);
        }

        $etudiant->update($data);
        return response()->json(['etudiant' => $etudiant]);
    }

    /**
     * @OA\Delete(
     *   path="/api/admin/etudiants/{etudiant}",
     *   tags={"Admin"},
     *   summary="Supprimer un étudiant",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="etudiant", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=204, description="Supprimé")
     * )
     */
    public function deleteEtudiant(Request $request, Etudiant $etudiant)
    {
        $this->ensureAdmin($request);
        $etudiant->delete();
        return response()->json([], 204);
    }

    /**
     * @OA\Put(
     *   path="/api/admin/etudiants/{etudiant}/affectations",
     *   tags={"Admin"},
     *   summary="Affecter encadrant/rapporteur",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="etudiant", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(@OA\JsonContent(
     *       @OA\Property(property="encadrant_id", type="integer", nullable=true),
     *       @OA\Property(property="rapporteur_id", type="integer", nullable=true)
     *   )),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function assignEtudiantRoles(Request $request, Etudiant $etudiant)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'encadrant_id' => 'nullable|exists:professeurs,id',
            'rapporteur_id' => 'nullable|exists:professeurs,id',
        ]);

        $etudiant->update($data);
        return response()->json(['etudiant' => $etudiant]);
    }

    // --- Professeurs ---
    /**
     * @OA\Post(
     *   path="/api/admin/professeurs",
     *   tags={"Admin"},
     *   summary="Créer un professeur",
     *   security={{"sanctum":{}}},
     *   @OA\Response(response=201, description="Professeur créé")
     * )
     */
    public function createProfesseur(Request $request)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:professeurs,email',
            'mot_de_passe' => 'required|string|min:6',
            'role_soutenance' => 'nullable|string|max:255',
        ]);

        $prof = Professeur::create([
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'email' => $data['email'],
            'mot_de_passe' => Hash::make($data['mot_de_passe']),
            'role_soutenance' => $data['role_soutenance'] ?? null,
        ]);

        return response()->json(['professeur' => $prof], 201);
    }

    /**
     * @OA\Put(
     *   path="/api/admin/professeurs/{professeur}",
     *   tags={"Admin"},
     *   summary="Mettre à jour un professeur",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="professeur", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function updateProfesseur(Request $request, Professeur $professeur)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:professeurs,email,' . $professeur->id,
            'mot_de_passe' => 'sometimes|string|min:6',
            'role_soutenance' => 'sometimes|nullable|string|max:255',
        ]);

        if (isset($data['mot_de_passe'])) {
            $data['mot_de_passe'] = Hash::make($data['mot_de_passe']);
        }

        $professeur->update($data);
        return response()->json(['professeur' => $professeur]);
    }

    /**
     * @OA\Delete(
     *   path="/api/admin/professeurs/{professeur}",
     *   tags={"Admin"},
     *   summary="Supprimer un professeur",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="professeur", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=204, description="Supprimé")
     * )
     */
    public function deleteProfesseur(Request $request, Professeur $professeur)
    {
        $this->ensureAdmin($request);
        $professeur->delete();
        return response()->json([], 204);
    }
}