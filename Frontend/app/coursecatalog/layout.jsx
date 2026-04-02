import { Inter } from "next/font/google";
import SideBar from "../../components/SideBar";

const inter = Inter({ subsets: ["latin"] });

export default function CourseLayout({ children }) {
  return (
    <div className={`${inter.className} flex min-h-screen bg-[#0f172a]`}>
      <SideBar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
