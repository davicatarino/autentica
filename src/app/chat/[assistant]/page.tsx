"use client"
import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"

type Message = { sender: "user" | "assistant", content: string }

export default function ChatPage() {
  const params = useParams()
  const [chat, setChat] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [assistant, setAssistant] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Buscar assistente e chat
  useEffect(() => {
    fetch("/api/assistants")
      .then(res => res.json())
      .then(data => {
        console.log("Assistants recebidos:", data.assistants)
        const slug = typeof params.assistant === "string"
          ? params.assistant
          : Array.isArray(params.assistant) ? params.assistant[0] : ""
        console.log("Slug vindo da URL:", slug)
        const found = data.assistants.find((a: any) => a.slug === slug)
        console.log("Assistant encontrado:", found)
        if (!found) {
          alert("Assistente não encontrado!")
          return
        }
        setAssistant(found)
        fetch(`/api/chat/${found.id}`)
          .then(res => res.json())
          .then(data => {
            if (!data || !data.chat) {
              setChat(null)
              setMessages([])
              return
            }
            setChat(data.chat)
            setMessages(data.chat.messages || [])
          })
      })
  }, [params.assistant])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    let chatId = chat?.id
    // Se não tem chat, cria
    if (!chatId && assistant?.id) {
      const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistantId: assistant.id, userId: 1 }) // sempre passar userId válido aqui
    })
        const data = await res.json()
        chatId = data.chat.id
        setChat(data.chat)
    }

    if (!assistant || !chatId) {
      alert("Erro: chat ou assistente não encontrado.")
      return
    }

    setMessages(msgs => [...msgs, { sender: "user", content: input }])
    setInput("")
    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, sender: "user", content: input, assistantId: assistant.id })
      })
      if (!res.ok) throw new Error("Erro ao enviar mensagem")
      const data = await res.json()
      setMessages(msgs => [...msgs, { sender: "assistant", content: data.assistantMessage.content }])
    } catch (error) {
      alert("Erro ao enviar mensagem. Tente novamente.")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#22243A]">
      <div className="bg-[#293252] p-4 flex items-center">
        <img src={assistant?.avatar || "/images/default-profile.png"} className="w-10 h-10 rounded-full mr-3" />
        <span className="text-white font-semibold text-lg">{assistant?.name || "Assistente"}</span>
        <span className="ml-4 text-green-400 text-xs">● Online</span>
        <button className="ml-auto bg-red-500 px-3 py-1 rounded text-white" onClick={() => window.location.href = "/dashboard"}>Sair</button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-lg max-w-lg ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-black"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="p-4 flex bg-[#293252]" onSubmit={handleSend} autoComplete="off">
        <input
          name="message"
          className="flex-1 p-2 rounded border focus:outline-none"
          placeholder="Digite sua mensagem aqui..."
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          autoComplete="off"
        />
        <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded" type="submit">Enviar</button>
      </form>
    </div>
  )
}
