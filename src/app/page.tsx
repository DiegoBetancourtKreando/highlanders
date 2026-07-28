import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header flotante tipo Dynamic Island */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="island-nav flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-3">
            <Image src="/logoHIGHH.png" alt="HighLanders" width={36} height={36} className="object-contain" />
            <span className="font-bold text-base text-white">HighLanders</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-1.5">
              Iniciar Sesión
            </Link>
            <Link href="/formulario">
              <Button variant="gold" size="sm">
                Solicitar Uniforme
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Elementos decorativos flotantes */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#C8A84E]/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-[#C8A84E]/8 rounded-full blur-2xl animate-float" style={{ animationDelay: "-1.5s" }} />

          <div className="relative max-w-6xl mx-auto px-6 py-32 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#C8A84E] animate-pulse" />
                  <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Sistema de Uniformes</span>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Solicita el uniforme<br />
                  <span className="gold-text">de tu jugador</span>
                </h1>
                <p className="text-lg text-white/60 mb-8 max-w-lg leading-relaxed">
                  Gestión rápida y sencilla de solicitudes de uniformes. Validación automática del número de camiseta en tiempo real.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/formulario">
                    <Button size="lg" variant="gold" className="text-base px-8">
                      <Icons.shirt />
                      Solicitar Uniforme
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="secondary" className="text-white/80 bg-white/10 hover:bg-white/20 text-base px-8">
                      Panel Admin
                    </Button>
                  </Link>
                </div>


              </div>

              {/* Right: Logo */}
              <div className="flex justify-center lg:justify-end animate-float">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#C8A84E]/20 blur-[80px] rounded-full" />
                  <Image
                    src="/logoHIGHH.png"
                    alt="HighLanders Logo"
                    width={400}
                    height={400}
                    className="relative z-10 w-72 lg:w-96 object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1a3c2a] mb-4">¿Cómo funciona?</h2>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">Tres pasos simples para solicitar el uniforme de tu jugador</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: "01", title: "Completa el formulario", desc: "Ingresa los datos del jugador, el nombre y número que deseas en la camiseta." },
                { num: "02", title: "Validación automática", desc: "El sistema verifica al instante si el número está disponible en la categoría y sede seleccionadas." },
                { num: "03", title: "Recibe confirmación", desc: "Una vez aprobada tu solicitud, recibirás un ticket de seguimiento para tu trámite." },
              ].map((item) => (
                <div key={item.num} className="glass-card p-8 animate-fade-in-up">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center mb-5">
                    <span className="text-white font-bold text-sm">{item.num}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a3c2a] mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rules Section */}
        <section className="py-24 px-6 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#1a3c2a] mb-4">Reglas de disponibilidad</h2>
              <p className="text-gray-500">La combinación Número + Categoría + Sede debe ser única</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-8 border-red-200/30">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <span className="text-red-500 font-bold">✕</span>
                </div>
                <h3 className="font-semibold text-[#1a3c2a] mb-2">No puede repetirse</h3>
                <p className="text-sm text-gray-500">Dentro de una misma sede y categoría, el número de camiseta debe ser único.</p>
              </div>
              <div className="glass-card p-8 border-emerald-200/30">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <span className="text-emerald-500 font-bold">✓</span>
                </div>
                <h3 className="font-semibold text-[#1a3c2a] mb-2">Sí puede repetirse</h3>
                <p className="text-sm text-gray-500">El mismo número puede usarse en diferentes categorías o en diferentes sedes.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="hero-gradient py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-white/40">© {new Date().getFullYear()} HighLanders — Sistema Formativo de Alto Rendimiento en Fútbol</p>
        </div>
      </footer>
    </div>
  );
}
