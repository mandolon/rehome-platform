<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        \App\Models\User::create([
            'name' => 'Sarah Johnson',
            'email' => 'admin@rehome.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0101',
            'company' => 'Rehome Platform',
            'job_title' => 'System Administrator',
            'role' => 'admin',
            'bio' => 'System administrator with 15+ years experience in construction technology.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Project Manager
        \App\Models\User::create([
            'name' => 'Michael Chen',
            'email' => 'pm@rehome.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0102',
            'company' => 'Skyline Construction',
            'job_title' => 'Senior Project Manager',
            'role' => 'project_manager',
            'bio' => 'PMP-certified project manager specializing in residential and commercial construction.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Architect
        \App\Models\User::create([
            'name' => 'Emily Rodriguez',
            'email' => 'architect@rehome.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0103',
            'company' => 'Modern Design Studio',
            'job_title' => 'Principal Architect',
            'role' => 'architect',
            'bio' => 'Licensed architect with expertise in sustainable design and BIM modeling.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Structural Engineer
        \App\Models\User::create([
            'name' => 'David Kumar',
            'email' => 'engineer@rehome.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0104',
            'company' => 'Structural Solutions Inc.',
            'job_title' => 'Structural Engineer',
            'role' => 'engineer',
            'bio' => 'PE-licensed structural engineer with focus on high-rise and commercial buildings.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Contractor
        \App\Models\User::create([
            'name' => 'James Miller',
            'email' => 'contractor@rehome.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0105',
            'company' => 'Miller Construction LLC',
            'job_title' => 'General Contractor',
            'role' => 'contractor',
            'bio' => 'Licensed general contractor with 20+ years in residential and commercial construction.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Client
        \App\Models\User::create([
            'name' => 'Lisa Thompson',
            'email' => 'client@rehome.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0106',
            'company' => 'Thompson Real Estate Group',
            'job_title' => 'Real Estate Developer',
            'role' => 'client',
            'bio' => 'Real estate developer focused on sustainable residential developments.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Additional team members
        \App\Models\User::create([
            'name' => 'Robert Garcia',
            'email' => 'supervisor@rehome.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0107',
            'company' => 'Miller Construction LLC',
            'job_title' => 'Site Supervisor',
            'role' => 'contractor',
            'bio' => 'Experienced site supervisor specializing in quality control and safety management.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        \App\Models\User::create([
            'name' => 'Anna Wilson',
            'email' => 'designer@rehome.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0108',
            'company' => 'Modern Design Studio',
            'job_title' => 'Interior Designer',
            'role' => 'architect',
            'bio' => 'Interior designer with expertise in residential and hospitality projects.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Viewer (junior team member)
        \App\Models\User::create([
            'name' => 'Tom Anderson',
            'email' => 'viewer@rehome.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0109',
            'company' => 'Skyline Construction',
            'job_title' => 'Junior Project Coordinator',
            'role' => 'viewer',
            'bio' => 'Junior project coordinator learning the construction management process.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
