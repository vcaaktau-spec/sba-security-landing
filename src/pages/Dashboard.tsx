import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navbar } from "../components/Navbar";
import { motion } from "framer-motion";
import { 
  FileText, Download, Wrench, Server, MapPin, 
  Key, Eye, EyeOff, Cctv, Network, ShieldCheck, 
  Info, Flame, CheckCircle2, AlertTriangle, Loader2 
} from "lucide-react";
import { GlobalBackground } from "../components/GlobalBackground";

type ProjectCategory = 'cctv' | 'network' | 'access' | 'fire';

interface Project {
  id: string;
  category: ProjectCategory;
  name: string;
  address: string;
  status: 'active' | 'warning' | 'offline';
  equipment: string[];
  credentials: { label: string; value: string; isSecret: boolean }[];
  maintenanceDays?: number;
  documents?: { id: number; name: string; date: string; size: string }[];
}

const getCategoryConfig = (category: ProjectCategory) => {
  switch (category) {
    case 'cctv': return { icon: <Cctv size={16} />, label: "Видеонаблюдение", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
    case 'network': return { icon: <Network size={16} />, label: "Локальная сеть", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    case 'access': return { icon: <ShieldCheck size={16} />, label: "СКУД", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" };
    case 'fire': return { icon: <Flame size={16} />, label: "АПС", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" };
    default: return { icon: <Server size={16} />, label: "Система", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
  }
};

const ProjectCard = ({ project }: { project: Project }) => {
  const [showCreds, setShowCreds] = useState(false);
  const config = getCategoryConfig(project.category);

  return (
    <div className="bg-background/50 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 shadow-lg flex flex-col mb-6 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 opacity-[0.03] pointer-events-none">
        {project.category === 'fire' ? <Flame size={160} /> : <Server size={160} />}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold uppercase tracking-wider">
          <MapPin size={16} className="text-red-500" /> {project.address}
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${config.bg} ${config.color} ${config.border}`}>
            {config.icon} {config.label}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${project.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
            {project.status === 'active' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} 
            {project.status === 'active' ? 'Штатно' : 'Внимание'}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-black mb-8 relative z-10">{project.name}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div>
          <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2"><Server size={16}/> Оборудование</h3>
          <ul className="space-y-2 text-sm">
            {project.equipment?.map((item, i) => (
              <li key={i} className="flex items-center gap-3 bg-muted/30 px-3 py-2 rounded-lg border border-border/50">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2"><Key size={16}/> Логические данные</h3>
            <button onClick={() => setShowCreds(!showCreds)} className="text-xs font-semibold flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {showCreds ? <><EyeOff size={14} /> Скрыть</> : <><Eye size={14} /> Показать</>}
            </button>
          </div>
          <div className="bg-muted/30 rounded-2xl p-4 text-sm font-mono border border-border/50 flex flex-col gap-2">
            {project.credentials?.map((cred, i) => (
              <div key={i} className="flex justify-between border-b border-border/50 last:border-0 pb-2 last:pb-0">
                <span className="text-muted-foreground">{cred.label}:</span>
                <span className="font-semibold">{cred.isSecret && !showCreds ? "••••••••••••" : cred.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { user } = useUser();
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/get-projects?userId=${user.id}`);
        const data = await res.json();
        setProjectsList(data);
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchMyProjects();
  }, [user]);

  return (
    <div className="relative min-h-screen flex flex-col pt-32 pb-20 px-6">
      <GlobalBackground />
      <Navbar />
      
      <main className="relative z-10 w-full max-w-[1000px] mx-auto flex flex-col gap-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase mb-2">Кабинет <span className="text-red-600">клиента</span></h1>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" size={48} /></div>
        ) : projectsList.length > 0 ? (
          <div className="flex flex-col gap-4">
            {projectsList.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        ) : (
          <div className="bg-background/50 border border-border rounded-3xl p-10 text-center flex flex-col items-center min-h-[40vh]">
            <Info size={32} className="mb-6 opacity-20" />
            <h2 className="text-2xl font-bold mb-4">Ваш профиль настраивается</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">Администратор подготавливает информацию по вашим объектам. Скоро они появятся здесь.</p>
            <a href="https://wa.me/77779204988" target="_blank" className="bg-foreground text-background font-bold px-6 py-3 rounded-xl">Связаться с нами</a>
          </div>
        )}
      </main>
    </div>
  );
};