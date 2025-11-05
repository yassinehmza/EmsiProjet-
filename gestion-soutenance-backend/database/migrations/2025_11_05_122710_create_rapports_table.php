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
        Schema::create('rapports', function (Blueprint $table) {
        $table->id();
        $table->string('titre');
        $table->date('date_depot');
        $table->text('commentaire')->nullable();
        $table->string('etat')->default('en_attente');
        $table->foreignId('etudiant_id')->constrained('etudiants')->onDelete('cascade');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapports');
    }
};
