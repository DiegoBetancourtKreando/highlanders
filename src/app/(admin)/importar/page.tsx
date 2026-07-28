"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Icons } from "@/components/ui/Icons";

export default function ImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: {
      totalRows: number;
      successRows: number;
      errorRows: number;
      errors?: Array<{ row: number; message: string }>;
    };
  } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
        setResult({ success: false, message: "El archivo debe ser un Excel (.xlsx o .xls)" });
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/import", { method: "POST", credentials: "include", body: formData });
      const data = await res.json();

      if (res.status === 401) {
        setResult({ success: false, message: "Tu sesión expiró. Por favor, inicia sesión nuevamente." });
        return;
      }

      if (data.success) {
        setResult({
          success: true,
          message: `Importación completada: ${data.data.successRows} de ${data.data.totalRows} registros importados exitosamente.`,
          details: data.data,
        });
      } else {
        setResult({ success: false, message: data.error || "Error al importar el archivo" });
      }
    } catch {
      setResult({ success: false, message: "Error de conexión. Verifica e intenta nuevamente." });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-[#1a3c2a] flex items-center gap-2">
            <Icons.upload />
            Importar Jugadores desde Excel
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Selecciona el archivo Excel con la matriz de jugadores. El sistema importará o actualizará los registros automáticamente.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="glass-card p-10 text-center cursor-pointer hover:border-[#C8A84E]/40 transition-all flex flex-col items-center gap-3"
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileSelect} />
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center">
              <Icons.upload />
            </div>
            <p className="text-sm text-gray-600">
              {file ? (
                <span className="font-semibold text-[#1a3c2a]">{file.name}</span>
              ) : (
                <>Haz clic para seleccionar el archivo <span className="font-semibold text-[#C8A84E]">Excel</span></>
              )}
            </p>
            <p className="text-xs text-gray-400">Archivos .xlsx o .xls</p>
          </div>

          {file && (
            <div className="flex justify-center">
              <Button onClick={handleImport} loading={importing} disabled={importing} variant="gold" size="lg">
                <Icons.upload />
                Importar Datos
              </Button>
            </div>
          )}

          {result && (
            <Alert type={result.success ? "success" : "error"}>
              <p className="font-medium">{result.message}</p>
              {result.details?.errors && result.details.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Errores encontrados:</p>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {result.details.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>Fila {err.row}: {err.message}</li>
                    ))}
                    {result.details.errors.length > 5 && (
                      <li className="text-gray-500">...y {result.details.errors.length - 5} errores más</li>
                    )}
                  </ul>
                </div>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-md font-semibold text-[#1a3c2a]">Instrucciones</h3>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>El archivo debe contener las hojas de categoría (<strong className="text-gray-900">Sub-4 a Sub-22</strong>).</li>
            <li>El sistema es <strong className="text-[#1a3c2a]">idempotente</strong>: si un jugador ya existe (por código), se actualizarán sus datos.</li>
            <li>Las categorías y sedes nuevas se crearán automáticamente si no existen.</li>
            <li>La importación no afecta las solicitudes de uniforme existentes.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
