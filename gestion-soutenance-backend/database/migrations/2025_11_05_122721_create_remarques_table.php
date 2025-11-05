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
           Schema::create('remarques', function (Blueprint $table) {
        $table->id();
        $table->text('contenu');
        $table->date('date_remarque');
        $table->foreignId('rapport_id')->constrained('rapports')->onDelete('cascade');
        $table->foreignId('professeur_id')->constrained('professeurs')->onDelete('cascade');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remarques');
    }
};
