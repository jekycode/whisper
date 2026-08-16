import { ReactNode } from "react";
import Footer from "../components/footer";
import Header from "../components/header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
