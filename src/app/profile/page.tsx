"use client"
import { useEffect, useState, useRef } from "react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", instagram: "" })
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [success, setSuccess] = useState(false)

  // Substitua o fetch por sua lógica de autenticação real
  useEffect(() => {
    fetch("/api/user/1")
      .then(res => res.json())
      .then(data => {
        setUser(data.user)
        setForm({
          name: data.user.name ?? "",
          phone: data.user.phone ?? "",
          instagram: data.user.instagram ?? ""
        })
        setImage(data.user.image ?? null)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEdit = () => setEditing(true)
  const handleCancel = () => setEditing(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/user/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      setSuccess(true)
      setEditing(false)
      setTimeout(() => setSuccess(false), 2000)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("image", file)
    const res = await fetch("/api/user/1/upload-image", {
      method: "POST",
      body: formData
    })
    if (res.ok) {
      const data = await res.json()
      setImage(data.url)
    }
  }

  if (!user) return <div>Carregando...</div>
  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Perfil do Usuário</h2>
      <div className="flex flex-col items-center mb-6">
        <img src={image || "/images/default-profile.png"} alt="Foto de perfil" className="w-32 h-32 rounded-full object-cover border mb-3" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? "Alterar Foto de Perfil" : "Salvar Foto de Perfil"}
        </button>
      </div>
      {editing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label>Nome:</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label>Telefone:</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label>Instagram:</label>
            <input name="instagram" value={form.instagram} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
            <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded" onClick={handleCancel}>Cancelar</button>
          </div>
          {success && <span className="text-green-600">Dados salvos com sucesso!</span>}
        </form>
      ) : (
        <div>
          <div className="mb-2"><strong>Nome:</strong> {user.name}</div>
          <div className="mb-2"><strong>Telefone:</strong> {user.phone}</div>
          <div className="mb-2"><strong>Instagram:</strong> {user.instagram}</div>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={handleEdit}>Editar Perfil</button>
        </div>
      )}
    </div>
  )
}
