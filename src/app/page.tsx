import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-xl text-gray-900">
                HighLanders
              </span>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Iniciar Sesión
              </Link>
              <Link href="/formulario">
                <Button>Solicitar Uniforme</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">H</span>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Sistema de Solicitud de Uniformes
              </h1>
              <p className="text-lg sm:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
                Gestiona la solicitud del uniforme de tu jugador de forma rápida
                y sencilla. Validamos automáticamente la disponibilidad del
                número de camiseta en tiempo real.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/formulario">
                  <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">
                    <Icons.shirt />
                    Solicitar Uniforme
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Panel Administrativo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Cómo funciona?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Proceso simple y rápido para solicitar el uniforme de tu jugador
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Completa el formulario
                </h3>
                <p className="text-gray-600">
                  Ingresa los datos del jugador, el nombre y número que deseas
                  en la camiseta.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Validación automática
                </h3>
                <p className="text-gray-600">
                  El sistema verifica al instante si el número está disponible
                  en la categoría y sede seleccionadas.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recibe confirmación
                </h3>
                <p className="text-gray-600">
                  Una vez aprobada tu solicitud, recibirás un ticket de
                  seguimiento para tu trámite.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rules */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Reglas de disponibilidad del número
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold">✕</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      No puede repetirse
                    </h3>
                    <p className="text-gray-600">
                      Dentro de una misma sede y categoría, el número de
                      camiseta debe ser único.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Sí puede repetirse
                    </h3>
                    <p className="text-gray-600">
                      El mismo número puede usarse en diferentes categorías
                      (aunque sea la misma sede) o en diferentes sedes (aunque
                      sea la misma categoría).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HighLanders - Sistema Formativo de Alto
            Rendimiento en Fútbol. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
