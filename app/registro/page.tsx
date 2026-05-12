"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import RegistroHeader from "@/app/components/registro/RegistroHeader";
import StepEmail from "@/app/components/registro/StepEmail";
import StepPassword from "@/app/components/registro/StepPassword";
import StepPerfil from "@/app/components/registro/StepPerfil";
import StepTerminos from "@/app/components/registro/StepTerminos";

import { register } from "@/app/services/auth.service";
import type { Genero, RegistroStep } from "./types";

export default function RegistroPage() {
  const router = useRouter();

  const [step, setStep] = useState<RegistroStep>(0);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [nombre, setNombre] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [genero, setGenero] = useState<Genero>("");

  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = nombre.trim();

  const progress = useMemo(() => {
    if (step === 0) return 0;
    if (step === 1) return 1 / 3;
    if (step === 2) return 2 / 3;
    return 1;
  }, [step]);

  const canContinueEmail = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
  }, [cleanEmail]);

  const canContinuePassword = useMemo(() => {
    const hasLetter = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(pass);
    const hasNumberOrSpecial = /[\d#?!&@$%^*.,_\-]/.test(pass);
    const hasLength = pass.length >= 8;

    return hasLetter && hasNumberOrSpecial && hasLength;
  }, [pass]);

  const canContinueProfile = useMemo(() => {
    if (cleanName.length < 2) return false;
    if (!dia || !mes || !anio) return false;
    if (!genero) return false;

    const day = Number(dia);
    const month = Number(mes);
    const year = Number(anio);

    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
      return false;
    }

    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900) return false;

    const birthDate = new Date(year, month - 1, day);

    if (
      birthDate.getFullYear() !== year ||
      birthDate.getMonth() !== month - 1 ||
      birthDate.getDate() !== day
    ) {
      return false;
    }

    const today = new Date();
    const age = today.getFullYear() - year;
    const hasHadBirthday =
      today.getMonth() > month - 1 ||
      (today.getMonth() === month - 1 && today.getDate() >= day);

    const realAge = hasHadBirthday ? age : age - 1;

    return realAge >= 13;
  }, [cleanName, dia, mes, anio, genero]);

  function next() {
    setServerError("");

    setStep((prev) => {
      if (prev >= 3) return prev;
      return (prev + 1) as RegistroStep;
    });
  }

  function back() {
    setServerError("");

    setStep((prev) => {
      if (prev <= 0) return prev;
      return (prev - 1) as RegistroStep;
    });
  }

  function formatBirthDate() {
    const day = dia.padStart(2, "0");
    const month = mes.padStart(2, "0");

    return `${anio}-${month}-${day}`;
  }

  async function empezar() {
    if (!aceptaTerminos) return;

    if (!canContinueEmail) {
      setStep(0);
      setServerError("Ingresa un correo válido.");
      return;
    }

    if (!canContinuePassword) {
      setStep(1);
      setServerError("La contraseña no cumple con los requisitos.");
      return;
    }

    if (!canContinueProfile) {
      setStep(2);
      setServerError("Completa correctamente tu perfil.");
      return;
    }

    try {
      setLoading(true);
      setServerError("");

      await register({
        email: cleanEmail,
        password: pass,
        name: cleanName,
        birthDate: formatBirthDate(),
        gender: genero,
        acceptedTerms: aceptaTerminos,
      });

      router.replace("/dashboard");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "No se pudo crear la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#121212] text-white">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col px-6 py-8">
        <RegistroHeader step={step} progress={progress} onBack={back} />

        {serverError && (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            {serverError}
          </div>
        )}

        {loading && (
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white/70">
            Creando tu cuenta...
          </div>
        )}

        <div className="relative min-h-[720px] flex-1">
          <StepEmail
            step={step}
            email={email}
            setEmail={setEmail}
            canContinue={canContinueEmail && !loading}
            next={next}
          />

          <StepPassword
            step={step}
            pass={pass}
            setPass={setPass}
            showPass={showPass}
            setShowPass={setShowPass}
            canContinue={canContinuePassword && !loading}
            next={next}
          />

          <StepPerfil
            step={step}
            nombre={nombre}
            setNombre={setNombre}
            dia={dia}
            setDia={setDia}
            mes={mes}
            setMes={setMes}
            anio={anio}
            setAnio={setAnio}
            genero={genero}
            setGenero={setGenero}
            canContinue={canContinueProfile && !loading}
            next={next}
          />

          <StepTerminos
            step={step}
            aceptaTerminos={aceptaTerminos}
            setAceptaTerminos={setAceptaTerminos}
            empezar={empezar}
          />
        </div>
      </div>
    </main>
  );
}
