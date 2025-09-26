<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attachment>
 */
class AttachmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $mimeTypes = [
            'application/pdf' => 'pdf',
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            'text/plain' => 'txt',
        ];

        $mime = fake()->randomElement(array_keys($mimeTypes));
        $extension = $mimeTypes[$mime];
        $filename = fake()->word() . '.' . $extension;

        return [
            'name' => $filename,
            'path' => 'attachments/' . fake()->uuid() . '_' . $filename,
            'mime' => $mime,
            'size' => fake()->numberBetween(1024, 5242880), // 1KB to 5MB
            'uploaded_by' => User::factory(),
        ];
    }
}
