import { promises as fs } from "fs"
import path from "path"
import type { Catalogo } from "./catalogo"

/** Carrega o catálogo gerado (data/catalogo.json). Server-only. */
export async function carregarCatalogo(): Promise<Catalogo> {
  const file = path.join(process.cwd(), "data", "catalogo.json")
  return JSON.parse(await fs.readFile(file, "utf-8")) as Catalogo
}
