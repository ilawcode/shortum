import Link from 'next/link';
import { Play } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] md:min-h-screen p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-indigo-500">ShortcutHub</h1>
        <p className="text-xl text-slate-400 max-w-lg mx-auto">
          The Web-to-iOS Engine for Apple Shortcuts. Drag and drop elements on web, execute them natively on your iPhone.
        </p>
      </div>

      <div className="flex sm:flex-row flex-col items-center justify-center gap-4 pt-8 w-full max-w-sm mx-auto">
        <Link href="/dashboard" className="w-full px-8 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 text-white font-medium transition-colors flex items-center justify-center gap-2">
          <Play size={18} /> Get Started
        </Link>
        <Link href="/login" className="w-full px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300 font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
}
