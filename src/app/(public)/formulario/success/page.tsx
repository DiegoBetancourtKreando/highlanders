import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface Props {
  searchParams: Promise<{ ticket?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { ticket } = await searchParams;

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-card p-8 text-center">
          <Image src="/logoHIGHH.png" alt="HighLanders" width={72} height={72} className="mx-auto mb-6" />

          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#1a3c2a] mb-2">¡Solicitud Enviada!</h1>
          <p className="text-gray-500 mb-6">Tu solicitud de uniforme ha sido registrada exitosamente.</p>

          {ticket && (
            <div className="glass-dark rounded-2xl p-5 mb-6">
              <p className="text-xs text-gray-500 mb-1">Número de seguimiento</p>
              <p className="text-2xl font-bold gold-text font-mono">{ticket}</p>
              <p className="text-xs text-gray-400 mt-2">Guarda este número para dar seguimiento a tu solicitud.</p>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-6">Recibirás una confirmación cuando tu solicitud sea revisada y aprobada.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/formulario"><Button variant="outline">Nueva Solicitud</Button></Link>
            <Link href="/"><Button variant="gold">Volver al Inicio</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
