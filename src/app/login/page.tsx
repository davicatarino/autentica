"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    })
    if (res?.error) setError("Credenciais inválidas!")
    else window.location.href = "/dashboard"
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col justify-center items-center bg-white shadow-md rounded-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Autêntica</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <input className="mb-3 w-full p-2 border rounded" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <input className="mb-3 w-full p-2 border rounded" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" required />
          <button className="w-full py-2 bg-blue-600 text-white rounded" type="submit">Entrar</button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
        <div className="mt-4">
          <a href="/cadastro" className="text-blue-500">Primeiro login? Cadastre-se aqui</a>
        </div>
      </div>
    </div>
  )
}
