import type { PerfilData } from "./types";

export function canContinueEmail(email: string): boolean {
  return email.trim().length > 3 && email.includes("@");
}

export function canContinuePassword(pass: string): boolean {
  return pass.length >= 8;
}

export function canContinuePerfil(data: PerfilData): boolean {
  return (
    data.nombre.trim().length >= 2 &&
    data.dia.trim().length >= 1 &&
    data.mes.trim().length >= 1 &&
    data.anio.trim().length === 4 &&
    data.genero !== ""
  );
}