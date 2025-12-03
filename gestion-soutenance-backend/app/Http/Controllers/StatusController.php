<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class StatusController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/status",
     *     tags={"Status"},
     *     summary="Vérifier le statut de l'API",
     *     description="Vérifie que le serveur est en ligne et que la connexion à la base de données est établie",
     *     @OA\Response(
     *         response=200,
     *         description="API et base de données fonctionnent correctement",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="API is running properly"),
     *             @OA\Property(property="server", type="boolean", example=true),
     *             @OA\Property(property="database", type="boolean", example=true),
     *             @OA\Property(property="database_name", type="string", example="gestion_sout"),
     *             @OA\Property(property="timestamp", type="string", example="2025-12-03 12:30:45")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erreur de connexion à la base de données",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Database connection failed"),
     *             @OA\Property(property="server", type="boolean", example=true),
     *             @OA\Property(property="database", type="boolean", example=false),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function check()
    {
        $status = [
            'server' => true,
            'database' => false,
            'database_name' => null,
            'timestamp' => now()->format('Y-m-d H:i:s')
        ];

        try {
            // Vérifier la connexion à la base de données
            DB::connection()->getPdo();
            $status['database'] = true;
            $status['database_name'] = DB::connection()->getDatabaseName();
            
            // Test d'une requête simple
            DB::select('SELECT 1');
            
            return response()->json([
                'status' => 'success',
                'message' => 'API is running properly',
                'server' => $status['server'],
                'database' => $status['database'],
                'database_name' => $status['database_name'],
                'timestamp' => $status['timestamp']
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Database connection failed',
                'server' => $status['server'],
                'database' => $status['database'],
                'error' => $e->getMessage(),
                'timestamp' => $status['timestamp']
            ], 500);
        }
    }
}
