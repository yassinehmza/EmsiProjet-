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
     *   summary="Lister les soutenances (filtres + pagination)",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="date", in="query", required=false, @OA\Schema(type="string", format="date")),
     *   @OA\Parameter(name="salle", in="query", required=false, @OA\Schema(type="string")),
     *   @OA\Parameter(name="jury_id", in="query", required=false, @OA\Schema(type="integer")),
     *   @OA\Parameter(name="etudiant_id", in="query", required=false, @OA\Schema(type="integer")),
     *   @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer", default=1)),
     *   @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=10)),
     *   @OA\Response(response=200, description="Liste des soutenances")
     * )
     */
    public function index(Request $request)
    {
        $this->ensureAdmin($request);
        $query = Soutenance::with(['etudiant:id,nom,prenom','jury'])->orderByDesc('date')->orderByDesc('heure');

        if ($request->filled('date')) {
            $query->whereDate('date', $request->query('date'));
        }
        if ($request->filled('salle')) {
            $query->where('salle', $request->query('salle'));
        }
        if ($request->filled('jury_id')) {
            $query->where('jury_id', $request->query('jury_id'));
        }
        if ($request->filled('etudiant_id')) {
            $query->where('etudiant_id', $request->query('etudiant_id'));
        }

        $perPage = (int) $request->query('per_page', 10);
        $page = (int) $request->query('page', 1);
        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    /**
     * @OA\Get(
     *   path="/api/admin/soutenances/{soutenance}",
     *   tags={"Admin"},
     *   summary="Afficher une soutenance",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="soutenance", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Détails de la soutenance")
     * )
     */
    public function show(Request $request, Soutenance $soutenance)
    {
        $this->ensureAdmin($request);
        $soutenance->load(['etudiant:id,nom,prenom,email','jury']);
        return response()->json(['soutenance' => $soutenance]);
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
        // Conflit: l'étudiant a déjà une soutenance
        $existsStudent = Soutenance::where('etudiant_id', $data['etudiant_id'])->exists();
        if ($existsStudent) {
            return response()->json(['message' => "L'étudiant a déjà une soutenance planifiée"], 409);
        }
        // Conflit: salle occupée à la même date/heure
        $existsSalle = Soutenance::whereDate('date', $data['date'])
            ->where('heure', $data['heure'])
            ->where('salle', $data['salle'])
            ->exists();
        if ($existsSalle) {
            return response()->json(['message' => 'Conflit de salle: déjà occupée à cette date/heure'], 409);
        }
        // Conflit: jury déjà utilisé à la même date/heure
        if (!empty($data['jury_id'])) {
            $existsJury = Soutenance::where('jury_id', $data['jury_id'])
                ->whereDate('date', $data['date'])
                ->where('heure', $data['heure'])
                ->exists();
            if ($existsJury) {
                return response()->json(['message' => 'Le jury est déjà planifié à cette date/heure'], 409);
            }
        }

        $soutenance = Soutenance::create($data);
        return response()->json([
            'message' => 'Soutenance planifiée avec succès',
            'soutenance' => $soutenance
        ], 201);
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
        // Valeurs effectives après mise à jour
        $date = $data['date'] ?? $soutenance->date;
        $heure = $data['heure'] ?? $soutenance->heure;
        $salle = $data['salle'] ?? $soutenance->salle;
        $etudiantId = $data['etudiant_id'] ?? $soutenance->etudiant_id;
        $juryId = array_key_exists('jury_id', $data) ? $data['jury_id'] : $soutenance->jury_id;

        // Conflit: l'étudiant a déjà une autre soutenance
        $existsStudent = Soutenance::where('etudiant_id', $etudiantId)
            ->where('id', '!=', $soutenance->id)
            ->exists();
        if ($existsStudent) {
            return response()->json(['message' => "L'étudiant a déjà une autre soutenance planifiée"], 409);
        }
        // Conflit: salle occupée à la même date/heure
        $existsSalle = Soutenance::whereDate('date', $date)
            ->where('heure', $heure)
            ->where('salle', $salle)
            ->where('id', '!=', $soutenance->id)
            ->exists();
        if ($existsSalle) {
            return response()->json(['message' => 'Conflit de salle: déjà occupée à cette date/heure'], 409);
        }
        // Conflit: jury déjà utilisé à la même date/heure
        if (!empty($juryId)) {
            $existsJury = Soutenance::where('jury_id', $juryId)
                ->whereDate('date', $date)
                ->where('heure', $heure)
                ->where('id', '!=', $soutenance->id)
                ->exists();
            if ($existsJury) {
                return response()->json(['message' => 'Le jury est déjà planifié à cette date/heure'], 409);
            }
        }

        $soutenance->update($data);
        return response()->json(['soutenance' => $soutenance]);
    }

    /**
     * @OA\Delete(
     *   path="/api/admin/soutenances/{soutenance}",
     *   tags={"Admin"},
     *   summary="Annuler une soutenance",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="soutenance", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=204, description="Annulée")
     * )
     */
    public function destroy(Request $request, Soutenance $soutenance)
    {
        $this->ensureAdmin($request);
        $soutenance->delete();
        return response()->json([], 204);
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

    /**
     * @OA\Put(
     *   path="/api/admin/soutenances/{soutenance}/annuler",
     *   tags={"Admin"},
     *   summary="Annuler une soutenance (alias)",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="soutenance", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=204, description="Annulée")
     * )
     */
    public function cancel(Request $request, Soutenance $soutenance)
    {
        $this->ensureAdmin($request);
        $soutenance->delete();
        return response()->json([], 204);
    }
}