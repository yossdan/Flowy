"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/services/auth.service";

export function useLoginForm() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");

  const [touchedUser, setTouchedUser] = useState(false);
  const [touchedPass, setTouchedPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const cleanValue = value.trim();

  const canContinue = useMemo(() => {
    return cleanValue.length >= 3;
  }, [cleanValue]);

  const canLogin = useMemo(() => {
    return cleanValue.length >= 3 && password.trim().length > 0 && !loading;
  }, [cleanValue, password, loading]);

  const showUserError = touchedUser && !canContinue;
  const showPassError = touchedPass && step === 2 && password.trim().length === 0;

  function handleUserChange(nextValue: string) {
    setValue(nextValue);
    setServerError("");
  }

  function handlePasswordChange(nextPassword: string) {
    setPassword(nextPassword);
    setServerError("");
  }

  function handleUserBlur() {
    setTouchedUser(true);
  }

  function handlePasswordBlur() {
    setTouchedPass(true);
  }

  function goBack() {
    setStep(1);
    setPassword("");
    setTouchedPass(false);
    setServerError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === 1) {
      setTouchedUser(true);

      if (!canContinue) return;

      setStep(2);
      return;
    }

    setTouchedUser(true);
    setTouchedPass(true);

    if (!canLogin) return;

    try {
      setLoading(true);
      setServerError("");

      await login({
        usernameOrEmail: cleanValue,
        password,
      });

      router.replace("/dashboard");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "No se pudo iniciar sesión.",
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