"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [assistants, setAssistants] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/assistants")
      .then(res => res.json())
      .then(data => setAssistants(data.assistants))
  }, [])

  return (
    <div className="max-w-6xl mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-2">Bem-vindo!</h1>
      <p className="mb-8 text-gray-700">Selecione uma das opções disponíveis abaixo:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {assistants.map(a => (
          <div
            key={a.id}
            onClick={() => router.push(`/chat/${a.slug}`)}
            className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-xl transition flex flex-col items-center"
          >
            <img src={a.avatar || "/images/default-profile.png"} alt={a.name} className="w-44 h-32 object-cover rounded-lg mb-3" />
            <div className="font-semibold text-lg text-center">{a.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
