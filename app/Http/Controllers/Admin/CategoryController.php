<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/categories/Index', [
            'categories' => Category::withCount('products')
                ->orderBy('name')
                ->get()
                ->map(fn (Category $c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                    'products_count' => $c->products_count,
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
        ]);

        Category::create(['name' => $request->string('name')->trim()->value()]);

        return back()->with('success', 'Category added.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,'.$category->id],
        ]);

        // Regenerate the slug from the new name.
        $category->update([
            'name' => $request->string('name')->trim()->value(),
            'slug' => null,
        ]);

        return back()->with('success', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        // Products keep working: their category_id is set to null on delete
        // (see the products table foreign key), so no orphaned data.
        $category->delete();

        return back()->with('success', 'Category deleted.');
    }
}
