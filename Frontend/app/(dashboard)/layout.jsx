import Sidebar from '@/components/Sidebar';
import { ThemeColors } from '@/components/ThemeColors';

export default function DashboardLayout({ children }) {
  return (
    <main className="flex h-screen overflow-hidden gap-2">
      <aside className="w-62.5 shrink-0 border-r border-zinc-800 h-full">
        <Sidebar />
      </aside>

      <section 
        style={{ backgroundColor: ThemeColors.bgBlue }} 
        className="flex-1 h-full overflow-y-auto text-zinc-300 font-sans"
      >
        {children}
      </section>
    </main>
  );
}