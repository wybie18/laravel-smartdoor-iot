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
        Schema::create('access_permissions', function (Blueprint $table) {
            $table->foreignId('rfid_tag_id')->constrained('rfid_tags')->cascadeOnDelete();
            $table->foreignId('door_id')->constrained('doors')->cascadeOnDelete();
            $table->primary(['rfid_tag_id', 'door_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access_permissions');
    }
};
