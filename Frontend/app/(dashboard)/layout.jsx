import Sidebar from '@/components/Sidebar';
import { ThemeColors } from '@/components/ThemeColors';

export default function DashboardLayout({ children }) {
  return (
    <main className="flex min-h-screen overflow-hidden">
      <aside className="w-[250px] sticky top-0 left-0 shrink-0 border-r border-zinc-800 h-screen hidden md:block">
        <Sidebar />
      </aside>

      <section 
        style={{ backgroundColor: ThemeColors.bgBlue }} 
        className="min-w-0 flex-1 h-screen overflow-y-auto text-zinc-300 font-sans"
      >
        {children}
      </section>
    </main>
  );
}