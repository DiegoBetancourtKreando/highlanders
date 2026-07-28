import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
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

function getBadgeVariant(status: string) {
  switch (status) {
    case "Pendiente":
      return "warning" as const;
    case "Aprobada":
      return "success" as const;
    case "Rechazada":
      return "danger" as const;
    case "Entregada":
      return "info" as const;
    default:
      return "default" as const;
  }
}

export default async function RequestsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const pageSize = 20;
  const search = params.search || "";
  const categoryId = params.categoryId || "";
  const venueId = params.venueId || "";
  const status = params.status || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { playerFullName: { contains: search, mode: "insensitive" } },
      { ticket: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (venueId) where.venueId = venueId;
  if (status) where.status = status;

  const [requests, total, categories, venues] = await Promise.all([
    prisma.uniformRequest.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ticket: true,
        playerFullName: true,
        uniformName: true,
        jerseyNumber: true,
        status: true,
        category: { select: { id: true, name: true } },
        venue: { select: { id: true, name: true } },
        createdAt: true,
      },
    }),
    prisma.uniformRequest.count({ where }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.venue.findMany({ orderBy: { order: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
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
                placeholder="Ticket o nombre..."
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
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
                <option value="Entregada">Entregada</option>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-gray-500 py-8"
                  >
                    No se encontraron solicitudes
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {req.ticket}
                    </TableCell>
                    <TableCell className="font-medium">
                      {req.playerFullName}
                    </TableCell>
                    <TableCell>{req.uniformName}</TableCell>
                    <TableCell className="font-bold">
                      {req.jerseyNumber}
                    </TableCell>
                    <TableCell>{req.category.name}</TableCell>
                    <TableCell>{req.venue.name}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(req.status)}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString("es-EC")}
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
        />
      </Card>

      <p className="text-sm text-gray-500">Total: {total} solicitudes</p>
    </div>
  );
}
