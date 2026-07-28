import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";

interface Props {
  searchParams: Promise<{ ticket?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { ticket } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icons.check />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Solicitud Enviada!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu solicitud de uniforme ha sido registrada exitosamente.
          </p>

          {ticket && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">
                Número de seguimiento
              </p>
              <p className="text-2xl font-bold text-emerald-600 font-mono">
                {ticket}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Guarda este número para dar seguimiento a tu solicitud.
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-6">
            Recibirás una confirmación cuando tu solicitud sea revisada y
            aprobada por el equipo administrativo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/formulario">
              <Button variant="outline">Nueva Solicitud</Button>
            </Link>
            <Link href="/">
              <Button>Volver al Inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
