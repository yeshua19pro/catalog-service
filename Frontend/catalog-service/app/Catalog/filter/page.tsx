"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function CatalogPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    book_name: "",
    author: "",
    book_type: "",
  });

    async function fetchBooks(applyFilters = false) {
      setLoading(true);
      try {
        const res = await fetch("/api/Catalog/Filter_Book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(applyFilters ? filters : {}),
        });

        if (!res.ok) throw new Error("Error al obtener libros");
        const data = await res.json();
        setBooks(data.book_info?.books || []);
      } catch (error) {
        console.error(error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }


  useEffect(() => {
    fetchBooks();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetchBooks(true);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Catálogo de Libros
        </h1>

        {/* Formulario de filtros */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            name="book_name"
            placeholder="Buscar por nombre..."
            value={filters.book_name}
            onChange={handleChange}
            className="text-black border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="author"
            placeholder="Autor..."
            value={filters.author}
            onChange={handleChange}
            className="text-black border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="book_type"
            placeholder="Género..."
            value={filters.book_type}
            onChange={handleChange}
            className="text-black border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Filtrar
          </button>
        </form>


        {/* Lista de libros */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : books.length === 0 ? (
          <p className="text-center text-gray-500">
            No se encontraron libros.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="p-6 border rounded-xl shadow hover:shadow-lg transition bg-white"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {book.name}
                </h2>
                <p className="text-gray-700">
                  <span className="font-semibold">Autor:</span> {book.author}
                </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Nombre:</span> {book.book_name}
                  </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Género:</span> {book.book_type}
                </p>
                  <p className="text-gray-700">
                  <span className="font-semibold">Precio:</span> ${book.price}
                </p>

                <p className="text-gray-600 text-sm mt-2">
                  Publicado: {book.publication_date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
