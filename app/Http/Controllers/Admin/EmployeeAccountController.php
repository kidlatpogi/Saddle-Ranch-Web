<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeAccountController extends Controller
{
    public function index(): Response
    {
        $employees = User::orderBy('id', 'desc')->get();

        return Inertia::render('Admin/Employees', [
            'employees' => $employees,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:user,employee,kitchen,cashier,admin',
            'password' => 'required|string|min:6',
        ]);

        $employee = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Created Account '{$employee->email}' as role '{$employee->role}'",
            'ip_address' => $request->ip(),
            'payload' => ['employee_id' => $employee->id, 'email' => $employee->email, 'role' => $employee->role],
        ]);

        return back()->with('success', 'Account created successfully.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $employee = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$id}",
            'role' => 'required|in:user,employee,kitchen,cashier,admin',
            'password' => 'nullable|string|min:6',
        ]);

        $employee->name = $validated['name'];
        $employee->email = $validated['email'];
        $employee->role = $validated['role'];

        if (!empty($validated['password'])) {
            $employee->password = Hash::make($validated['password']);
        }

        $employee->save();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Updated Account '{$employee->email}' (Role: {$employee->role})",
            'ip_address' => $request->ip(),
            'payload' => ['employee_id' => $employee->id, 'email' => $employee->email],
        ]);

        return back()->with('success', 'Account details updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $userToDelete = User::findOrFail($id);
        
        if ($userToDelete->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own active admin account.']);
        }

        $email = $userToDelete->email;
        $userToDelete->delete();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Deleted Account '{$email}'",
            'ip_address' => request()->ip(),
            'payload' => ['deleted_user_id' => $id, 'email' => $email],
        ]);

        return back()->with('success', "Account '{$email}' deleted successfully.");
    }
}
