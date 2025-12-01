<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use App\Models\Etudiant;
use App\Models\Professeur;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    
    public function loginEtudiant(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = Etudiant::where('email', $data['email'])->first();
        if (!$user || !(Hash::check($data['password'], $user->mot_de_passe) || $user->mot_de_passe === $data['password'])) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $token = $user->createToken('etudiant')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);
    }

    /**
     * @OA\Post(
     *   path="/api/auth/professeur/login",
     *   tags={"Auth"},
     *   summary="Connexion professeur",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"email","password"},
     *       @OA\Property(property="email", type="string", format="email"),
     *       @OA\Property(property="password", type="string")
     *     )
     *   ),
     *   @OA\Response(response=200, description="Token et profil"),
     *   @OA\Response(response=401, description="Identifiants invalides")
     * )
     */
    public function loginProfesseur(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = Professeur::where('email', $data['email'])->first();
        if (!$user || !(Hash::check($data['password'], $user->mot_de_passe) || $user->mot_de_passe === $data['password'])) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $token = $user->createToken('professeur')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);
    }

    /**
     * @OA\Post(
     *   path="/api/auth/admin/login",
     *   tags={"Auth"},
     *   summary="Connexion administrateur",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"email","password"},
     *       @OA\Property(property="email", type="string", format="email"),
     *       @OA\Property(property="password", type="string")
     *     )
     *   ),
     *   @OA\Response(response=200, description="Token et profil"),
     *   @OA\Response(response=401, description="Identifiants invalides")
     * )
     */
    public function loginAdministrateur(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = Administrateur::where('email', $data['email'])->first();
        if (!$user || !(Hash::check($data['password'], $user->mot_de_passe) || $user->mot_de_passe === $data['password'])) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $token = $user->createToken('administrateur')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);
    }
}