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
        // Le jury est facultatif au moment de la planification ; si supprimé, mettre la valeur à NULL
        $table->foreignId('jury_id')->nullable()->constrained('juries')->nullOnDelete();
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
