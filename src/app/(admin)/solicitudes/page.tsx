"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Pagination,
} from "@/components/ui/Table";
import { Alert } from "@/components/ui/Alert";

interface RequestItem {
  id: string;
  ticket: string;
  playerFullName: string;
  uniformName: string;
  jerseyNumber: string;
  status: string;
  category: { id: string; name: string };
  venue: { id: string; name: string };
  createdAt: string;
}

interface CatalogItem {
  id: string;
  name: string;
}

function getBadgeVariant(status: string) {
  switch (status) {
    case "Pendiente": return "warning" as const;
    case "Aprobada": return "success" as const;
    case "Rechazada": return "danger" as const;
    case "Entregada": return "info" as const;
    default: return "default" as const;
  }
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [venues, setVenues] = useState<CatalogItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterVenue, setFilterVenue] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const pageSize = 20;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      if (search) params.set("search", search);
      if (filterCategory) params.set("categoryId", filterCategory);
      if (filterVenue) params.set("venueId", filterVenue);
      if (filterStatus) params.set("status", filterStatus);

      const res = await fetch(`/api/requests/list?${params}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data.data);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      }
    } catch {
      setFeedback({ type: "error", message: "Error al cargar solicitudes" });
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCategory, filterVenue, filterStatus]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    async function loadFilters() {
      try {
        const res = await fetch("/api/catalog");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data.categories);
          setVenues(data.data.venues);
        }
      } catch {}
    }
    loadFilters();
  }, []);

  const handleAction = async (id: string, newStatus: string) => {
    setActionLoading(id);
    setFeedback(null);
    try {
      const res = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: `Solicitud ${newStatus.toLowerCase()} exitosamente` });
        fetchRequests();
      } else {
        setFeedback({ type: "error", message: data.error || "Error al actualizar" });
      }
    } catch {
      setFeedback({ type: "error", message: "Error de conexión" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRequests();
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <Alert type={feedback.type} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ticket o nombre..." className="glass-input w-full px-3 py-2 text-sm" />
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="glass-input w-full px-3 py-2 text-sm">
                <option value="">Todas</option>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
              <select value={filterVenue} onChange={(e) => setFilterVenue(e.target.value)} className="glass-input w-full px-3 py-2 text-sm">
                <option value="">Todas</option>
                {venues.map((v) => (<option key={v.id} value={v.id}>{v.name}</option>))}
              </select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="glass-input w-full px-3 py-2 text-sm">
                <option value="">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
                <option value="Entregada">Entregada</option>
              </select>
            </div>
            <button type="submit" className="px-4 py-2 bg-[#1a3c2a] text-white rounded-full text-sm font-medium hover:bg-[#2d5a3f] transition-colors">Filtrar</button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Jugador</TableHead>
                <TableHead>Nombre Uniforme</TableHead>
                <TableHead>#</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500 py-8">Cargando...</TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500 py-8">No se encontraron solicitudes</TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-medium">{req.ticket}</TableCell>
                    <TableCell className="font-medium">{req.playerFullName}</TableCell>
                    <TableCell>{req.uniformName}</TableCell>
                    <TableCell className="font-bold">{req.jerseyNumber}</TableCell>
                    <TableCell>{req.category.name}</TableCell>
                    <TableCell>{req.venue.name}</TableCell>
                    <TableCell><Badge variant={getBadgeVariant(req.status)}>{req.status}</Badge></TableCell>
                    <TableCell className="text-gray-500">{new Date(req.createdAt).toLocaleDateString("es-EC")}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        {req.status === "Pendiente" && (
                          <>
                            <button
                              onClick={() => handleAction(req.id, "Aprobada")}
                              disabled={actionLoading === req.id}
                              className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleAction(req.id, "Rechazada")}
                              disabled={actionLoading === req.id}
                              className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                        {req.status === "Aprobada" && (
                          <button
                            onClick={() => handleAction(req.id, "Entregada")}
                            disabled={actionLoading === req.id}
                            className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
                          >
                            Marcar Entregada
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <Pagination page={page} totalPages={totalPages} />
      </Card>

      <p className="text-sm text-gray-500">Total: {total} solicitudes</p>
    </div>
  );
}
