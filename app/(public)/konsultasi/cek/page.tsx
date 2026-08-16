"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { checkConsultationToken } from "@/app/actions/consultations";

function CekKodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Inisialisasi state awal langsung dari searchParams (mencegah cascading renders)
  const [token, setToken] = useState(
    () => searchParams.get("token")?.toUpperCase() || "",
  );
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const didAutoCheck = useRef(false);

  // 2. Deklarasikan handleCheck TERLEBIH DAHULU sebelum dipanggil di useEffect
  const handleCheck = async (value?: string) => {
    const t = (value ?? token).trim().toUpperCase();
    if (!t) return;

    setIsChecking(true);
    setErrorMsg(null);
    try {
      await checkConsultationToken(t);
      router.push(`/consultation/${t}`);
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Kode nggak ketemu, coba cek lagi ya.",
      );
      setIsChecking(false);
    }
  };

  // 3. Panggil handleCheck di dalam useEffect setelah fungsinya dideklarasikan
  useEffect(() => {
    if (didAutoCheck.current) return;
    const urlToken = searchParams.get("token");
    if (urlToken) {
      didAutoCheck.current = true;
      handleCheck(urlToken.toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-4 py-10">
      <div className="w-full max-w-lg mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Balik ke Beranda
        </Link>
      </div>

      <div className="w-full max-w-lg text-center mb-8">
        <div className="w-14 h-14 bg-blue-50 text-[#1BA0E2] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-7 h-7" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Masukin Kode Kamu
        </h1>
        <p className="text-sm text-gray-500">
          Kode yang kamu dapet waktu kirim cerita kemarin. Kalau bener, kamu
          langsung masuk ke ruang chat sama guru BK.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCheck();
        }}
        className="w-full max-w-lg flex items-center bg-white border border-gray-200 rounded-full p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[#1BA0E2]/20 focus-within:border-[#1BA0E2] transition-all"
      >
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value.toUpperCase())}
          disabled={isChecking}
          placeholder="Contoh: A8B3X9C1"
          autoFocus
          className="flex-1 bg-transparent px-4 text-sm focus:outline-none text-gray-900 font-medium tracking-wide uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!token.trim() || isChecking}
          className="bg-[#1BA0E2] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1588c2] disabled:bg-gray-200 disabled:text-gray-400 transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Masuk"}
        </button>
      </form>

      {errorMsg && (
        <p className="text-sm text-red-500 mt-3 font-medium">{errorMsg}</p>
      )}

      <p className="mt-8 text-xs text-gray-400 text-center max-w-sm">
        Simpan kode ini baik-baik, cuma kamu yang punya. Kalau kamu lagi butuh
        bantuan cepat, langsung cerita ke guru BK atau orang dewasa yang kamu
        percaya ya.
      </p>
    </div>
  );
}

export default function CekKodePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
        </div>
      }
    >
      <CekKodeContent />
    </Suspense>
  );
}
