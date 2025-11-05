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
        Schema::create('juries', function (Blueprint $table) {
        $table->id();
        // Références vers les professeurs composant le jury
        $table->foreignId('president_id')->constrained('professeurs')->onDelete('restrict');
        $table->foreignId('rapporteur_id')->constrained('professeurs')->onDelete('restrict');
        $table->foreignId('encadrant_id')->constrained('professeurs')->onDelete('restrict');
        $table->foreignId('examinateur_id')->constrained('professeurs')->onDelete('restrict');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('juries');
    }
};
