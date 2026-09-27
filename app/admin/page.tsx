import Link from "next/link";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { AdminEditor } from "./admin-editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  return (
    <main className="admin-shell">
      <div className="admin-wrap">
        <header className="admin-header">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-widest text-[#087d43]">Hole in the Wall</p>
            <h1 className="brush-heading mb-1">Menu editor</h1>
            <p className="text-sm text-[#655f56]">Signed in as {user.displayName}</p>
          </div>
          <div className="admin-actions">
            <Link className="outline-button !bg-[#151515]" href="/">View website</Link>
          </div>
        </header>
        <AdminEditor />
      </div>
    </main>
  );
}
