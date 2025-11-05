<?php

namespace App;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="API Gestion des Soutenances",
 *     version="1.0.0",
 *     description="Documentation OpenAPI pour le backend Laravel"
 * )
 *
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Serveur local"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Saisir uniquement le jeton d'accès"
 * )
 */
class OpenApi {}