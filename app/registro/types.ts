export type RegistroStep = 0 | 1 | 2 | 3;

export type Genero =
  | "hombre"
  | "mujer"
  | "otro"
  | "prefiero_no_decir"
  | "";

export interface PerfilData {
  nombre: string;
  dia: string;
  mes: string;
  anio: string;
  genero: Genero;
}