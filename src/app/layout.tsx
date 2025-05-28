// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Autêntica",
  description: "Plataforma com login, dashboard de assistentes e chat IA GPT"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  );
}
