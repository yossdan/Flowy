"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/app/services/auth.service";
import { saveToken } from "@/app/services/http.service";
import { useAuth } from "@/app/context/AuthContext";

export function useLoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");

  const [userTouched, setUserTouched] = useState(false);
  const [passTouched, setPassTouched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const cleanValue = value.trim();

  const canContinue = cleanValue.length >= 3;
  const canLogin = cleanValue.length >= 3 && password.trim().length > 0;

  const showUserError = userTouched && !canContinue;
  const showPassError =
    passTouched && step === 2 && password.trim().length === 0;

  function handleUserChange(newValue: string) {
    setValue(newValue);
    setServerError("");
  }

  function handlePasswordChange(newValue: string) {
    setPassword(newValue);
    setServerError("");
  }

  function handleUserBlur() {
    setUserTouched(true);
  }

  function handlePasswordBlur() {
    setPassTouched(true);
  }

  function goBack() {
    setStep(1);
    setPassword("");
    setPassTouched(false);
    setServerError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setServerError("");

    if (step === 1) {
      setUserTouched(true);

      if (!canContinue) return;

      setStep(2);
      return;
    }

    setUserTouched(true);
    setPassTouched(true);

    if (!canLogin) return;

    try {
      setLoading(true);

      const response = await login({
        usernameOrEmail: cleanValue,
        password,
      });

      setUser(response.user);
      saveToken(response.token || "flowy-session");

      router.replace("/dashboard");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    step,
    value,
    password,
    showUserError,
    showPassError,
    canContinue,
    canLogin,
    loading,
    serverError,
    handleSubmit,
    handleUserChange,
    handlePasswordChange,
    handleUserBlur,
    handlePasswordBlur,
    goBack,
  };
}