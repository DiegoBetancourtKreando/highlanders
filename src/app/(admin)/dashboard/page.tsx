import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, StatCard } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from "@/components/ui/Table";
import { Icons } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

async function getStats() {
  const [totalPlayers, activePlayers, totalRequests, pendingRequests] =
    await Promise.all([
      prisma.player.count(),
      prisma.player.count({ where: { status: "Activo" } }),
      prisma.uniformRequest.count(),
      prisma.uniformRequest.count({ where: { status: "Pendiente" } }),
    ]);

  const playersByCategory = await prisma.player.groupBy({
    by: ["categoryId"],
    where: { status: "Activo" },
    _count: { id: true },
  });

  const playersByVenue = await prisma.player.groupBy({
    by: ["venueId"],
    where: { status: "Activo" },
    _count: { id: true },
  });

  const requestsByStatus = await prisma.uniformRequest.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const recentRequests = await prisma.uniformRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      ticket: true,
      playerFullName: true,
      jerseyNumber: true,
      status: true,
      createdAt: true,
      category: { select: { name: true } },
      venue: { select: { name: true } },
    },
  });

  const categoryIds = playersByCategory.map((c) => c.categoryId);
  const venueIds = playersByVenue.map((v) => v.venueId);

  const [categories, venues] = await Promise.all([
    prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    }),
    prisma.venue.findMany({
      where: { id: { in: venueIds } },
      select: { id: true, name: true },
    }),
  ]);

  const catMap = new Map(categories.map((c) => [c.id, c.name]));
  const venMap = new Map(venues.map((v) => [v.id, v.name]));

  return {
    totalPlayers,
    activePlayers,
    totalRequests,
    pendingRequests,
    playersByCategory: playersByCategory.map((c) => ({
      name: catMap.get(c.categoryId) || c.categoryId,
      count: c._count.id,
    })),
    playersByVenue: playersByVenue.map((v) => ({
      name: venMap.get(v.venueId) || v.venueId,
      count: v._count.id,
    })),
    requestsByStatus,
    recentRequests,
  };
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

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Jugadores"
          value={stats.totalPlayers}
          icon={<Icons.users />}
          color="emerald"
        />
        <StatCard
          title="Jugadores Activos"
          value={stats.activePlayers}
          icon={<Icons.football />}
          color="blue"
        />
        <StatCard
          title="Total Solicitudes"
          value={stats.totalRequests}
          icon={<Icons.shirt />}
          color="purple"
        />
        <StatCard
          title="Pendientes"
          value={stats.pendingRequests}
          icon={<Icons.chart />}
          color="amber"
        />
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Últimas Solicitudes
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Jugador</TableHead>
                <TableHead>#</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No hay solicitudes registradas
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {req.ticket}
                    </TableCell>
                    <TableCell className="font-medium">
                      {req.playerFullName}
                    </TableCell>
                    <TableCell>{req.jerseyNumber}</TableCell>
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
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Jugadores por Categoría
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.playersByCategory.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20">{cat.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full transition-all"
                      style={{
                        width: `${(cat.count / stats.activePlayers) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-8 text-right">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Jugadores por Sede
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.playersByVenue.map((ven) => (
                <div key={ven.name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-28">{ven.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full transition-all"
                      style={{
                        width: `${(ven.count / stats.activePlayers) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-8 text-right">
                    {ven.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
