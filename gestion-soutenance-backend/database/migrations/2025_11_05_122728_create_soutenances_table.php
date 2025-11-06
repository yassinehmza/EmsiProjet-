<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('soutenances', function (Blueprint $table) {
        $table->id();
        $table->date('date');
        $table->time('heure');
        $table->string('salle');
        $table->float('note_finale')->nullable();
        $table->foreignId('etudiant_id')->constrained('etudiants')->onDelete('cascade');
        // Le jury est facultatif au moment de la planification ; conserver une clé nullable sans contrainte FK pour éviter l'ordre de migration.
        $table->unsignedBigInteger('jury_id')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('soutenances');
    }
};
