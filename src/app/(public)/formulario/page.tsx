// ============================================================
// FORMULARIO PÚBLICO DE SOLICITUD DE UNIFORME
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { Icons } from "@/components/ui/Icons";
import { uniformFormSchema, type UniformFormData } from "@/lib/validations";
import { submitUniformForm } from "./actions";
import type { SelectOption } from "@/types";

export default function UniformFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [numberStatus, setNumberStatus] = useState<{
    available: boolean | null;
    message: string;
    checking: boolean;
  }>({ available: null, message: "", checking: false });

  // Catálogos desde API
  const [catalogs, setCatalogs] = useState<{
    categories: SelectOption[];
    venues: SelectOption[];
    uniformTypes: SelectOption[];
    uniformStyles: SelectOption[];
    sizes: SelectOption[];
  }>({
    categories: [],
    venues: [],
    uniformTypes: [],
    uniformStyles: [],
    sizes: [],
  });

  // Cargar catálogos al montar
  useEffect(() => {
    async function loadCatalogs() {
      try {
        const res = await fetch("/api/catalog");
        const data = await res.json();
        if (data.success) {
          setCatalogs({
            categories: data.data.categories.map((c: { id: string; name: string }) => ({
              value: c.id,
              label: c.name,
            })),
            venues: data.data.venues.map((v: { id: string; name: string }) => ({
              value: v.id,
              label: v.name,
            })),
            uniformTypes: data.data.uniformTypes.map(
              (u: { id: string; name: string }) => ({
                value: u.id,
                label: u.name,
              })
            ),
            uniformStyles: data.data.uniformStyles.map(
              (s: { id: string; name: string }) => ({
                value: s.id,
                label: s.name,
              })
            ),
            sizes: data.data.uniformSizes.map(
              (s: { id: string; name: string }) => ({
                value: s.id,
                label: s.name,
              })
            ),
          });
        }
      } catch (error) {
        console.error("Error loading catalogs:", error);
      }
    }
    loadCatalogs();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<UniformFormData>({
    resolver: zodResolver(uniformFormSchema),
    defaultValues: {
      playerFullName: "",
      uniformName: "",
      nameMeaning: "",
      jerseyNumber: "",
      categoryId: "",
      venueId: "",
      uniformTypeIds: [],
      size: "",
      celebrationDesc: "",
      additionalNotes: "",
    },
  });

  // Watch para validación de número
  const jerseyNumber = watch("jerseyNumber");
  const categoryId = watch("categoryId");
  const venueId = watch("venueId");

  // Validación en tiempo real del número
  const validateNumber = useCallback(async () => {
    const num = jerseyNumber?.trim();
    const cat = categoryId;
    const ven = venueId;

    if (!num || !cat || !ven) {
      setNumberStatus({ available: null, message: "", checking: false });
      return;
    }

    // Validar formato básico
    if (!/^\d+$/.test(num)) {
      setNumberStatus({
        available: false,
        message: "El número debe contener solo dígitos",
        checking: false,
      });
      return;
    }

    const parsedNum = parseInt(num, 10);
    if (parsedNum < 1 || parsedNum > 99) {
      setNumberStatus({
        available: false,
        message: "El número debe estar entre 1 y 99",
        checking: false,
      });
      return;
    }

    setNumberStatus((prev) => ({ ...prev, checking: true }));

    try {
      const res = await fetch("/api/validate-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jerseyNumber: num,
          categoryId: cat,
          venueId: ven,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setNumberStatus({
          available: data.data.available,
          message: data.data.message,
          checking: false,
        });
      }
    } catch {
      setNumberStatus({
        available: null,
        message: "",
        checking: false,
      });
    }
  }, [jerseyNumber, categoryId, venueId]);

  // Efecto para validar cuando cambian número, categoría o sede
  useEffect(() => {
    const timer = setTimeout(() => {
      validateNumber();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [validateNumber]);

  // Manejar selección de tipos de uniforme
  const handleUniformTypeChange = (values: string[]) => {
    setValue("uniformTypeIds", values as [string, ...string[]], {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: UniformFormData) => {
    // Verificar disponibilidad antes de enviar
    if (numberStatus.available !== true) {
      setError("jerseyNumber", {
        message: "Debes elegir un número disponible",
      });
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "uniformTypeIds") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "agreeToTerms") {
          formData.append(key, "true");
        } else {
          formData.append(key, String(value || ""));
        }
      });

      const result = await submitUniformForm(formData);

      if (result.success && result.data) {
        router.push(
          `/formulario/success?ticket=${result.data.ticket}`
        );
      } else {
        if (result.errors?._form) {
          setServerError(result.errors._form);
        } else if (result.errors) {
          Object.entries(result.errors).forEach(([key, msg]) => {
            if (msg) setError(key as keyof UniformFormData, { message: msg });
          });
        }
      }
    } catch {
      setServerError("Error de conexión. Verifica tu internet e intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Dynamic Island Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
        <div className="island-nav flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logoHIGHH.png" alt="H" width={28} height={28} className="object-contain" />
            <span className="font-semibold text-sm text-white">HighLanders</span>
          </div>
          <span className="text-xs text-white/60">Solicitud de Uniforme</span>
        </div>
      </header>

      <div className="h-20" />

      <main className="max-w-3xl mx-auto px-4 pb-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <Alert type="error" title="Error" onClose={() => setServerError(null)}>
              {serverError}
            </Alert>
          )}

          {/* Sección 1: Datos del Jugador */}
          <section className="glass-card p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-semibold text-[#1a3c2a] flex items-center gap-2">
              <Icons.football />
              Datos del Jugador
            </h2>

            <Input
              label="Nombre completo del jugador"
              placeholder="Ej: Juan Andrés Pérez López"
              {...register("playerFullName")}
              error={errors.playerFullName?.message}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Nombre en la camiseta"
                placeholder="Ej: El Rayo, Torito"
                {...register("uniformName")}
                error={errors.uniformName?.message}
                required
              />
              <Input
                label="Número en la camiseta"
                placeholder="Ej: 10"
                {...register("jerseyNumber")}
                error={errors.jerseyNumber?.message}
                required
              />
            </div>

            {numberStatus.message && (
              <div className={`p-4 rounded-2xl text-sm backdrop-blur-sm border ${
                numberStatus.available
                  ? "bg-emerald-50/80 border-emerald-200/50 text-emerald-700"
                  : "bg-red-50/80 border-red-200/50 text-red-700"
              }`}>
                {numberStatus.checking ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Verificando disponibilidad...
                  </span>
                ) : numberStatus.available ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                    {numberStatus.message}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    {numberStatus.message}
                  </span>
                )}
              </div>
            )}

            <Input
              label="Contexto o significado del nombre en la camiseta"
              placeholder="Explica brevemente el origen o significado del nombre elegido"
              {...register("nameMeaning")}
              error={errors.nameMeaning?.message}
              required
            />
          </section>

          {/* Sección 2: Categoría y Sede */}
          <section className="glass-card p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-semibold text-[#1a3c2a]">Categoría y Sede</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select label="Categoría" options={catalogs.categories} placeholder="Seleccionar categoría..." {...register("categoryId")} error={errors.categoryId?.message} required />
              <Select label="Sede de entrenamiento" options={catalogs.venues} placeholder="Seleccionar sede..." {...register("venueId")} error={errors.venueId?.message} required />
            </div>
          </section>

          {/* Sección 3: Uniforme */}
          <section className="glass-card p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-semibold text-[#1a3c2a] flex items-center gap-2">
              <Icons.shirt />
              Uniforme
            </h2>
            <CheckboxGroup label="Tipo de Uniforme o Prenda" options={catalogs.uniformTypes} selectedValues={watch("uniformTypeIds") || []} onChange={handleUniformTypeChange} error={errors.uniformTypeIds?.message} required columns={2} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select label="Talla" options={catalogs.sizes} placeholder="Seleccionar talla..." {...register("size")} error={errors.size?.message} required />
            </div>
          </section>

          {/* Sección 4: Celebración */}
          <section className="glass-card p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-semibold text-[#1a3c2a]">Celebración del Jugador</h2>
            <Input label="Descripción de la Celebración" placeholder="Describe el gesto o movimiento que te gustaría que haga el jugador..." {...register("celebrationDesc")} error={errors.celebrationDesc?.message} required />
            <Input label="Nota o instrucción adicional (opcional)" placeholder="Cualquier información adicional que quieras agregar..." {...register("additionalNotes")} />
          </section>

          {/* Sección 5: Envío */}
          <section className="glass-card p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pt-2">
              <Button type="button" variant="ghost" onClick={() => router.push("/")}>Cancelar</Button>
              <Button type="submit" loading={isSubmitting} variant="gold" disabled={numberStatus.available !== true && numberStatus.available !== null}>
                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
              </Button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
