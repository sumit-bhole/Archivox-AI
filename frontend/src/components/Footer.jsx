export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 mb-2">Archivox</h2>
          <p className="text-slate-500 text-sm">Automating software architecture discovery.</p>
        </div>
        
        <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Archivox. Built for the Bolna Buildathon.
      </div>
    </footer>
  );
}