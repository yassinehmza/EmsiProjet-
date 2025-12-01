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

        return response()->json([
            'message' => 'Étudiant créé avec succès',
            'etudiant' => $etudiant
        ], 201);
    }

    
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
        return response()->json([
            'message' => 'Étudiant mis à jour avec succès',
            'etudiant' => $etudiant
        ]);
    }

    
    public function deleteEtudiant(Request $request, Etudiant $etudiant)
    {
        $this->ensureAdmin($request);
        $etudiant->delete();
        return response()->json(['message' => 'Étudiant supprimé avec succès'], 200);
    }

    
    public function assignEtudiantRoles(Request $request, Etudiant $etudiant)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'encadrant_id' => 'nullable|exists:professeurs,id',
            'rapporteur_id' => 'nullable|exists:professeurs,id',
        ]);

        $etudiant->update($data);
        return response()->json([
            'message' => 'Affectations mises à jour avec succès',
            'etudiant' => $etudiant
        ]);
    }

   
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

        return response()->json([
            'message' => 'Professeur créé avec succès',
            'professeur' => $prof
        ], 201);
    }

    
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
        return response()->json([
            'message' => 'Professeur mis à jour avec succès',
            'professeur' => $professeur
        ]);
    }


    public function deleteProfesseur(Request $request, Professeur $professeur)
    {
        $this->ensureAdmin($request);
        $professeur->delete();
        return response()->json(['message' => 'Professeur supprimé avec succès'], 200);
    }
}