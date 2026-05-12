// redirigir al login
import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/login")
}