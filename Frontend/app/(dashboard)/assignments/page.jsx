import { ThemeColors } from '@/components/ThemeColors';

export default function Assignments() {
  const categories = ['All', 'Pending', 'Submitted', 'Graded'];
  
  return (
    <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen text-zinc-300 font-sans p-4 md:p-8">
      
      {/* Top Navigation */}
      <div className="flex max-md:flex-col max-md:gap-3 md:items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-white">Assignments</h1>
        <div className="flex items-center gap-6">
          {categories.map((cat) => (
            <button key={cat} className={`text-sm font-bold ${cat === 'All' ? 'text-white border-b-2 border-blue-500 pb-1' : 'text-zinc-400 hover:text-zinc-200'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 1. PENDING ASSIGNMENT */}
        <section className="border border-slate-400 rounded-2xl p-6 bg-transparent w-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Wireframe Challenge #3 _ E-commerce Checkout Flow</h2>
              <div className="flex gap-2 mt-2">
                <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-full border border-red-500/30 text-center">Due: Feb 26</span>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full text-center">UI/UX Fundamentals</span>
              </div>
            </div>
            <span className="bg-stone-800 text-orange-400 text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
              <span className="text-xs">→</span> Pending
            </span>
          </div>
          
          <p className="text-[11px] text-zinc-500 mb-6">
            Design a complete wireframe for an e-commerce checkout flow. Include cart review, delivery details, payment selection, and confirmation screens. Submit as a Figma link or PDF export.
          </p>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-zinc-800 rounded-2xl py-12 flex flex-col items-center justify-center bg-black/5 mb-4">
             <span className="text-2xl mb-2">☁️</span>
             <p className="text-[10px] text-zinc-400">
               <button className="text-blue-500 underline mr-1">Click to upload</button> or drag and drop
             </p>
             <p className="text-[9px] text-zinc-600 mt-1">PDF, Figma link, PNG, ZIP (max 50MB)</p>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Or paste Figma link here..." 
              className="flex-1 bg-black/20 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-zinc-400 outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 text-white text-xs font-bold px-6 py-2 rounded-lg">Submit</button>
          </div>
        </section>

        {/* 2. SUBMITTED ASSIGNMENT */}
        <section className="border border-slate-400 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">User Journey Map - Food Delivery App</h2>
              <div className="flex gap-2 mt-2">
                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full border border-orange-500/30">Due: Feb 26</span>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">Product Thinking</span>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-4 py-1.5 rounded-full">Submitted</span>
          </div>

          <p className="text-[11px] text-zinc-500 mb-6">Create a detailed user journey map for a food delivery app user. Cover 5 touchpoints minimum, including emotions at each stage.</p>
          
          <div className="space-y-3">
            <div className="border border-zinc-800 rounded-xl p-4 bg-black/10">
              <p className="text-[10px] font-bold text-white mb-1 flex items-center gap-2">📄 Submitted File</p>
              <p className="text-[10px] text-zinc-500 ml-6">Journey_Map_Adaeze.pdf.Submitted Feb 16, 2026</p>
            </div>
            <div className="border border-zinc-800 rounded-xl p-4 bg-blue-900/10">
              <p className="text-[10px] font-bold text-white mb-1 flex items-center gap-2">Instructor Feedback (Pending)</p>
              <p className="text-[10px] text-zinc-500 ml-1">Awaiting review from Chioma Adeyemi...</p>
            </div>
          </div>
        </section>

        {/* 3. GRADED ASSIGNMENT */}
        <section className="border border-slate-400 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Sprint Retrospective Report</h2>
              <div className="flex gap-2 mt-2">
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/30">Due: Jan 25</span>
                <span className="bg-slate-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">Agile & Scrum</span>
              </div>
            </div>
            <span className="bg-blue-600/30 text-blue-400 text-[10px] font-bold px-4 py-1.5 rounded-full border border-blue-500/40 text-center">Graded - 88/100</span>
          </div>

          <p className="text-[11px] text-zinc-500 mb-6">Reflect on the last sprint - what went well, what didn't, and how your team will improve next sprint.</p>

          <div className="border border-blue-900/30 rounded-xl p-4 bg-blue-900/5">
             <p className="text-[11px] font-bold text-green-500 flex items-center gap-2 mb-1">
               <span className="bg-green-500 text-white text-[8px] p-0.5 rounded">✓</span> Grade: 88/100
             </p>
             <p className="text-[11px] text-zinc-400">Great reflection!</p>
          </div>
        </section>

      </div>
    </main>
  );
}