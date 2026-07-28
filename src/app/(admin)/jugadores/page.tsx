import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
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

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    venueId?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function PlayersPage({ searchParams }: Props) {
  try {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const pageSize = 20;
    const search = params.search || "";
    const categoryId = params.categoryId || "";
    const venueId = params.venueId || "";
    const status = params.status || "";

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        ...(isNaN(Number(search)) ? [] : [{ code: Number(search) }]),
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (venueId) where.venueId = venueId;
    if (status) where.status = status;

    const [players, total, categories, venues] = await Promise.all([
      prisma.player.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { code: "asc" },
        select: {
          id: true,
          code: true,
          fullName: true,
          preferredName: true,
          uniformName: true,
          jerseyNumber: true,
          status: true,
          category: { select: { id: true, name: true } },
          venue: { select: { id: true, name: true } },
          createdAt: true,
        },
      }),
      prisma.player.count({ where }),
      prisma.category.findMany({ orderBy: { order: "asc" } }),
      prisma.venue.findMany({ orderBy: { order: "asc" } }),
    ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                name="search"
                defaultValue={search}
                placeholder="Nombre o código..."
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                name="categoryId"
                defaultValue={categoryId}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sede
              </label>
              <select
                name="venueId"
                defaultValue={venueId}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Todas</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="status"
                defaultValue={status}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Pasivo">Pasivo</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
            >
              Filtrar
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Players Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Uniforme</TableHead>
                <TableHead>#</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-500 py-8"
                  >
                    No se encontraron jugadores
                  </TableCell>
                </TableRow>
              ) : (
                players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-mono text-sm">
                      {player.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {player.fullName}
                      {player.preferredName && (
                        <span className="text-gray-400 ml-1">
                          ({player.preferredName})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{player.uniformName || "-"}</TableCell>
                    <TableCell className="font-bold">
                      {player.jerseyNumber || "-"}
                    </TableCell>
                    <TableCell>{player.category.name}</TableCell>
                    <TableCell>{player.venue.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          player.status === "Activo" ? "success" : "default"
                        }
                      >
                        {player.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            // Client-side navigation handled by form
          }}
        />
      </Card>

      <p className="text-sm text-gray-500">
        Total: {total} jugadores
      </p>
    </div>
  );
  } catch (error) {
    console.error("Error en página de jugadores:", error);
    return (
      <div className="p-6">
        <Alert type="error" title="Error al cargar jugadores">
          Ocurrió un error al consultar la base de datos. Por favor, verifica
          que la migración se haya ejecutado correctamente y que la base de
          datos esté conectada.
        </Alert>
      </div>
    );
  }
}
