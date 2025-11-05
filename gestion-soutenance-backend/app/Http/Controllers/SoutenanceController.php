<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use App\Models\Soutenance;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class SoutenanceController extends Controller
{
    private function ensureAdmin(Request $request): void
    {
        if (!($request->user() instanceof Administrateur)) {
            abort(403, "Accès réservé à l'administrateur");
        }
    }

    /**
     * @OA\Get(
     *   path="/api/admin/soutenances",
     *   tags={"Admin"},
     *   summary="Lister les soutenances",
     *   security={{"sanctum":{}}},
     *   @OA\Response(response=200, description="Liste des soutenances")
     * )
     */
    public function index(Request $request)
    {
        $this->ensureAdmin($request);
        $soutenances = Soutenance::with(['etudiant:id,nom,prenom','jury'])->orderByDesc('date')->orderByDesc('heure')->get();
        return response()->json(['soutenances' => $soutenances]);
    }

    /**
     * @OA\Post(
     *   path="/api/admin/soutenances",
     *   tags={"Admin"},
     *   summary="Planifier une soutenance",
     *   security={{"sanctum":{}}},
     *   @OA\RequestBody(required=true, @OA\JsonContent(
     *     required={"date","heure","salle","etudiant_id"}
     *   )),
     *   @OA\Response(response=201, description="Soutenance créée")
     * )
     */
    public function store(Request $request)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'date' => 'required|date',
            'heure' => 'required|date_format:H:i',
            'salle' => 'required|string|max:255',
            'etudiant_id' => 'required|exists:etudiants,id',
            'jury_id' => 'nullable|exists:juries,id',
        ]);
        $soutenance = Soutenance::create($data);
        return response()->json(['soutenance' => $soutenance], 201);
    }

    /**
     * @OA\Put(
     *   path="/api/admin/soutenances/{soutenance}",
     *   tags={"Admin"},
     *   summary="Mettre à jour une soutenance",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="soutenance", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function update(Request $request, Soutenance $soutenance)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'date' => 'sometimes|date',
            'heure' => 'sometimes|date_format:H:i',
            'salle' => 'sometimes|string|max:255',
            'etudiant_id' => 'sometimes|exists:etudiants,id',
            'jury_id' => 'sometimes|nullable|exists:juries,id',
        ]);
        $soutenance->update($data);
        return response()->json(['soutenance' => $soutenance]);
    }

    /**
     * @OA\Put(
     *   path="/api/admin/soutenances/{soutenance}/note",
     *   tags={"Admin"},
     *   summary="Mettre à jour la note finale",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="soutenance", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(required=true, @OA\JsonContent(
     *     required={"note_finale"}
     *   )),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function updateNote(Request $request, Soutenance $soutenance)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'note_finale' => 'required|numeric|min:0|max:20',
        ]);
        $soutenance->update($data);
        return response()->json(['soutenance' => $soutenance]);
    }
}