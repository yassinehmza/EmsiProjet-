<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use App\Models\Jury;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class JuryController extends Controller
{
    private function ensureAdmin(Request $request): void
    {
        if (!($request->user() instanceof Administrateur)) {
            abort(403, "Accès réservé à l'administrateur");
        }
    }

    private function distinct(array $ids): bool
    {
        $filtered = array_filter($ids, fn($v) => $v !== null);
        return count($filtered) === count(array_unique($filtered));
    }

    /**
     * @OA\Get(
     *   path="/api/admin/juries",
     *   tags={"Admin"},
     *   summary="Lister les juries",
     *   security={{"sanctum":{}}},
     *   @OA\Response(response=200, description="Liste des juries")
     * )
     */
    public function index(Request $request)
    {
        $this->ensureAdmin($request);
        $juries = Jury::with(['president:id,nom,prenom','rapporteur:id,nom,prenom','encadrant:id,nom,prenom','examinateur:id,nom,prenom'])->orderByDesc('id')->get();
        return response()->json(['juries' => $juries]);
    }

    /**
     * @OA\Get(
     *   path="/api/admin/juries/{jury}",
     *   tags={"Admin"},
     *   summary="Afficher un jury",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="jury", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Détails du jury")
     * )
     */
    public function show(Request $request, Jury $jury)
    {
        $this->ensureAdmin($request);
        $jury->load(['president:id,nom,prenom','rapporteur:id,nom,prenom','encadrant:id,nom,prenom','examinateur:id,nom,prenom']);
        return response()->json(['jury' => $jury]);
    }

    /**
     * @OA\Post(
     *   path="/api/admin/juries",
     *   tags={"Admin"},
     *   summary="Créer un jury",
     *   security={{"sanctum":{}}},
     *   @OA\RequestBody(required=true, @OA\JsonContent(
     *     required={"president_id","rapporteur_id","encadrant_id","examinateur_id"}
     *   )),
     *   @OA\Response(response=201, description="Jury créé")
     * )
     */
    public function store(Request $request)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'president_id' => 'required|exists:professeurs,id',
            'rapporteur_id' => 'required|exists:professeurs,id',
            'encadrant_id' => 'required|exists:professeurs,id',
            'examinateur_id' => 'required|exists:professeurs,id',
        ]);
        if (!$this->distinct([$data['president_id'], $data['rapporteur_id'], $data['encadrant_id'], $data['examinateur_id']])) {
            return response()->json(['message' => 'Les membres du jury doivent être distincts'], 422);
        }
        $jury = Jury::create($data);
        return response()->json(['jury' => $jury], 201);
    }

    /**
     * @OA\Put(
     *   path="/api/admin/juries/{jury}",
     *   tags={"Admin"},
     *   summary="Mettre à jour un jury",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="jury", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function update(Request $request, Jury $jury)
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'president_id' => 'sometimes|exists:professeurs,id',
            'rapporteur_id' => 'sometimes|exists:professeurs,id',
            'encadrant_id' => 'sometimes|exists:professeurs,id',
            'examinateur_id' => 'sometimes|exists:professeurs,id',
        ]);
        $merged = array_merge($jury->only(['president_id','rapporteur_id','encadrant_id','examinateur_id']), $data);
        if (!$this->distinct([$merged['president_id'], $merged['rapporteur_id'], $merged['encadrant_id'], $merged['examinateur_id']])) {
            return response()->json(['message' => 'Les membres du jury doivent être distincts'], 422);
        }
        $jury->update($data);
        return response()->json(['jury' => $jury]);
    }

    /**
     * @OA\Delete(
     *   path="/api/admin/juries/{jury}",
     *   tags={"Admin"},
     *   summary="Supprimer un jury",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="jury", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=204, description="Supprimé")
     * )
     */
    public function destroy(Request $request, Jury $jury)
    {
        $this->ensureAdmin($request);
        $jury->delete();
        return response()->json([], 204);
    }

    /**
     * @OA\Put(
     *   path="/api/admin/juries/{jury}/annuler",
     *   tags={"Admin"},
     *   summary="Annuler (supprimer) un jury",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="jury", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=204, description="Annulé")
     * )
     */
    public function cancel(Request $request, Jury $jury)
    {
        $this->ensureAdmin($request);
        $jury->delete();
        return response()->json([], 204);
    }
}