"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Genero, RegistroStep } from "../registro/types";
import {
  canContinueEmail,
  canContinuePassword,
  canContinuePerfil,
} from "../registro/validators";
import { register } from "@/app/services/auth.service";

export function useRegistroForm() {
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

  const progress = useMemo(() => {
    if (step === 0) return 0;
    if (step === 1) return 1 / 3;
    if (step === 2) return 2 / 3;
    return 1;
  }, [step]);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return canContinueEmail(email);
    }

    if (step === 1) {
      return canContinuePassword(pass);
    }

    if (step === 2) {
      return canContinuePerfil({
        nombre,
        dia,
        mes,
        anio,
        genero,
      });
    }

    if (step === 3) {
      return aceptaTerminos && !loading;
    }

    return false;
  }, [step, email, pass, nombre, dia, mes, anio, genero, aceptaTerminos, loading]);

  function next() {
    if (!canContinue) return;
    setServerError("");
    setStep((current) => Math.min(3, current + 1) as RegistroStep);
  }

  function back() {
    setServerError("");
    setStep((current) => Math.max(0, current - 1) as RegistroStep);
  }

  async function empezar() {
    if (!aceptaTerminos) return;

    try {
      setLoading(true);
      setServerError("");

      const birthDate = `${anio.padStart(4, "0")}-${mes.padStart(
        2,
        "0",
      )}-${dia.padStart(2, "0")}`;

      await register({
        email: email.trim(),
        password: pass,
        name: nombre.trim(),
        birthDate,
        gender: genero,
        acceptedTerms: aceptaTerminos,
      });

      router.push("/dashboard");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    step,
    setStep,

    email,
    setEmail,

    pass,
    setPass,

    showPass,
    setShowPass,

    nombre,
    setNombre,

    dia,
    setDia,

    mes,
    setMes,

    anio,
    setAnio,

    genero,
    setGenero,

    aceptaTerminos,
    setAceptaTerminos,

    progress,
    canContinue,
    loading,
    serverError,

    next,
    back,
    empezar,
  };
}