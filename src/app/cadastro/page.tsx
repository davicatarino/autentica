"use client"
import { useState } from "react"

export default function CadastroPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", instagram: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    if (res.ok) setSuccess(true)
    else setError((await res.json()).error || "Erro ao cadastrar")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col justify-center items-center bg-white shadow-md rounded-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Cadastro - Autêntica</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <input name="name" className="mb-3 w-full p-2 border rounded" value={form.name} onChange={handleChange} placeholder="Nome completo" required />
          <input name="email" className="mb-3 w-full p-2 border rounded" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input name="password" className="mb-3 w-full p-2 border rounded" type="password" value={form.password} onChange={handleChange} placeholder="Senha" required />
          <input name="phone" className="mb-3 w-full p-2 border rounded" value={form.phone} onChange={handleChange} placeholder="Telefone" />
          <input name="instagram" className="mb-3 w-full p-2 border rounded" value={form.instagram} onChange={handleChange} placeholder="Instagram" />
          <button className="w-full py-2 bg-blue-600 text-white rounded" type="submit">Cadastrar</button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          {success && <p className="text-green-600 mt-2">Cadastro realizado com sucesso!</p>}
        </form>
        <div className="mt-4">
          <a href="/login" className="text-blue-500">Já tem conta? Faça login</a>
        </div>
      </div>
    </div>
  )
}
