import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Server, X, Loader2, MapPin, Trash2, FileUp, FileText, Globe, Calculator } from "lucide-react";
import { SbaPlanner } from "../components/SbaPlanner"; // Проверь правильность пути
import { GlobalBackground } from "../components/GlobalBackground";
import { useState, useEffect } from "react";

interface Client {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string;
}

export const Admin = () => {
  const { user, isLoaded } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'database' | 'planner'>('database');

  const [formData, setFormData] = useState({
    name: '', address: '', category: 'cctv', equipmentRaw: '', maintenanceDays: '', login: '', pass: '', price: '', imageUrl: '', showOnMain: false
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setClients(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); }
      finally { setIsLoadingClients(false); }
    };
    if (user?.publicMetadata?.role === "admin") fetchClients();
  }, [user]);

  const fetchUserProjects = async (clientId: string) => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch(`/api/get-projects?userId=${clientId}`);
      const data = await res.json();
      setUserProjects(Array.isArray(data) ? data : []);
    } catch (e) { setUserProjects([]); } 
    finally { setIsLoadingProjects(false); }
  };

  useEffect(() => { 
    if (selectedClientId) fetchUserProjects(selectedClientId); 
  }, [selectedClientId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
    setUploadingId(projectId);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&projectId=${projectId}`, {
        method: 'POST', body: file,
      });
      if (response.ok && selectedClientId) await fetchUserProjects(selectedClientId);
    } catch (e) { alert("Ошибка загрузки"); }
    finally { setUploadingId(null); }
  };

  // ОБНОВЛЕННАЯ ФУНКЦИЯ СОХРАНЕНИЯ С ВЫВОДОМ ОШИБКИ
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    setIsSaving(true);

    const payload = {
      userId: selectedClientId,
      category: formData.category,
      name: formData.name,
      address: formData.address,
      price: formData.price || 'По запросу',
      imageUrl: formData.imageUrl || '',
      showOnMain: formData.showOnMain,
      maintenanceDays: formData.maintenanceDays || null,
      equipment: formData.equipmentRaw ? formData.equipmentRaw.split(',').map(i => i.trim()).filter(Boolean) : [],
      credentials: [
        { label: 'Login', value: formData.login || 'admin', isSecret: false },
        { label: 'Password', value: formData.pass || '', isSecret: true }
      ]
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      
      const responseData = await res.json().catch(() => ({})); // Пытаемся прочитать ответ

      if (res.ok) {
        setIsAddingProject(false);
        setFormData({ name: '', address: '', category: 'cctv', equipmentRaw: '', maintenanceDays: '', login: '', pass: '', price: '', imageUrl: '', showOnMain: false });
        await fetchUserProjects(selectedClientId);
      } else {
        // ЕСЛИ СЕРВЕР ОТКАЗАЛ - ВЫВОДИМ ОШИБКУ НА ЭКРАН
        alert(`ОШИБКА СЕРВЕРА: ${responseData.error || res.statusText}`);
        console.error("Подробности ошибки:", responseData);
      }
    } catch (e) { 
      alert("Сетевая ошибка: не удалось связаться с сервером"); 
      console.error(e);
    } 
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить объект?")) return;
    try {
      const res = await fetch(`/api/delete-project?id=${id}`, { method: 'DELETE' });
      if (res.ok && selectedClientId) fetchUserProjects(selectedClientId);
    } catch (e) { console.error(e); }
  };

  if (!isLoaded || user?.publicMetadata?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="relative min-h-screen flex flex-col pt-32 pb-20 px-4 md:px-6">
      <GlobalBackground />
      <Navbar />
      <main className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col gap-6 md:gap-8">
        
        {/* ШАПКА С ТАБАМИ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">
              Панель <span className="text-red-600">Админа</span>
            </h1>
            <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-red-500/20 w-fit">
              Admin Access
            </div>
          </div>
          
          {/* ТАБЫ ПЕРЕКЛЮЧЕНИЯ */}
          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-border w-full md:w-auto overflow-x-auto custom-scrollbar">
            <button 
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'database' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Users size={14} /> База клиентов
            </button>
            <button 
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'planner' ? 'bg-red-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Calculator size={14} /> Конструктор КП
            </button>
          </div>
        </div>

        {/* ЛОГИКА ОТОБРАЖЕНИЯ: БАЗА ИЛИ КОНСТРУКТОР */}
        {activeTab === 'database' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* СПИСОК КЛИЕНТОВ (Левая колонка) */}
            <div className="bg-background/80 border border-border rounded-[32px] p-6 h-[400px] lg:h-[700px] flex flex-col backdrop-blur-xl shadow-lg">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-muted-foreground">База клиентов</h2>
              <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {isLoadingClients ? <Loader2 className="animate-spin mx-auto mt-10 text-muted-foreground"/> : clients.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setSelectedClientId(c.id)} 
                    className={`w-full flex items-center gap-4 p-3 md:p-4 rounded-2xl border transition-all text-left ${selectedClientId === c.id ? 'border-red-500 bg-red-500/10 shadow-sm' : 'border-transparent bg-muted/50 hover:bg-muted'}`}
                  >
                    <img src={c.imageUrl} className="w-10 h-10 rounded-full border border-border/50" alt="" />
                    <div className="overflow-hidden">
                      <div className="text-sm font-bold truncate text-foreground">{c.firstName} {c.lastName}</div>
                      <div className="text-[10px] text-muted-foreground truncate font-medium">{c.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ОБЪЕКТЫ (Правая колонка) */}
            <div className="lg:col-span-2 bg-background/80 border border-border rounded-[32px] p-6 md:p-8 h-[500px] lg:h-[700px] flex flex-col relative overflow-hidden backdrop-blur-xl shadow-lg">
              {selectedClientId ? (
                <>
                  <div className="flex justify-between items-center mb-6 md:mb-10">
                    <h2 className="font-black uppercase text-xl md:text-2xl tracking-tighter text-foreground">Объекты</h2>
                    <button onClick={() => setIsAddingProject(true)} className="bg-red-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center gap-2">
                      <Plus size={14}/> <span className="hidden sm:inline">Добавить объект</span><span className="inline sm:hidden">Добавить</span>
                    </button>
                  </div>

                  <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {isLoadingProjects ? (
                      <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-red-600" size={32}/></div>
                    ) : userProjects.length > 0 ? (
                      userProjects.map((p: any) => (
                        <div key={p.id} className="bg-muted/30 border border-border p-5 md:p-6 rounded-[24px] hover:border-border/80 transition-all group relative overflow-hidden">
                          <div className="flex justify-between items-start relative z-10">
                            <div>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                 <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-red-600 text-white rounded">{(p.category || 'cctv')}</span>
                                 <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-tighter"><MapPin size={12}/> {p.address}</span>
                                 {p.showOnMain && <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded flex items-center gap-1"><Globe size={10}/> На главной</span>}
                              </div>
                              <h3 className="font-black text-lg md:text-xl uppercase tracking-tighter text-foreground">{p.name}</h3>
                            </div>
                            <div className="flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                               <label className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border border-border flex items-center justify-center cursor-pointer hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-90 text-foreground">
                                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, p.id)} />
                                  {uploadingId === p.id ? <Loader2 className="animate-spin" size={16}/> : <FileUp size={16}/>}
                               </label>
                               <button onClick={() => handleDelete(p.id)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-90"><Trash2 size={16}/></button>
                            </div>
                          </div>
                          {p.documents && p.documents.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-border mt-4">
                              {p.documents.map((d: any) => (
                                <a key={d.id} href={d.url} target="_blank" className="flex items-center gap-2 px-3 py-2 bg-background rounded-xl text-[10px] font-bold border border-border hover:bg-muted transition-colors text-foreground">
                                  <FileText size={12} className="text-red-500"/> {d.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-[40px]">
                        <Server size={48} className="mb-4 opacity-20" />
                        <p className="font-black uppercase text-xs tracking-widest opacity-50">Нет активных систем</p>
                      </div>
                    )}
                  </div>

                  {/* МОДАЛКА СОЗДАНИЯ ОБЪЕКТА */}
                  <AnimatePresence>
                    {isAddingProject && (
                      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 bg-background z-50 p-6 md:p-10 overflow-y-auto">
                         <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-foreground">Новый <span className="text-red-600">объект</span></h2>
                            <button onClick={() => setIsAddingProject(false)} className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all text-foreground"><X size={20}/></button>
                         </div>
                         <form onSubmit={handleSave} className="space-y-4 md:space-y-6 max-w-xl pb-10">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                              <div>
                                <div className="text-sm font-black uppercase tracking-widest text-blue-500 flex items-center gap-2"><Globe size={16}/> В Портфолио</div>
                                <div className="text-[10px] text-muted-foreground mt-1">Отобразить этот проект в карусели на главной странице сайта.</div>
                              </div>
                              <button type="button" onClick={() => setFormData({...formData, showOnMain: !formData.showOnMain})} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.showOnMain ? 'bg-blue-500' : 'bg-muted-foreground/30'}`}>
                                <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className={`w-4 h-4 bg-white rounded-full absolute ${formData.showOnMain ? 'right-1' : 'left-1'}`} />
                              </button>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Тип системы</label>
                               <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-muted p-3 md:p-4 rounded-2xl border border-border outline-none font-bold text-foreground">
                                  <option value="cctv">Видеонаблюдение</option><option value="fire">АПС (Пожарка)</option><option value="network">Сети / Локалка</option><option value="access">СКУД</option>
                               </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <input required placeholder="Название объекта" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-muted p-3 md:p-4 rounded-2xl border border-border outline-none font-bold text-foreground" />
                               <input required placeholder="Полный адрес" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-muted p-3 md:p-4 rounded-2xl border border-border outline-none font-bold text-foreground" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Стоимость под ключ (₸)</label><input placeholder="Напр: 960 000 ₸" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-muted p-3 md:p-4 rounded-2xl border border-border outline-none font-bold text-foreground" /></div>
                               <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">URL обложки (необязательно)</label><input placeholder="/projects/tetys.webp" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-muted p-3 md:p-4 rounded-2xl border border-border outline-none font-bold text-foreground" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Логин устройства</label><input placeholder="admin" value={formData.login} onChange={e => setFormData({...formData, login: e.target.value})} className="w-full bg-muted p-3 md:p-4 rounded-2xl border border-border outline-none font-bold text-foreground" /></div>
                               <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Пароль устройства</label><input placeholder="••••••" value={formData.pass} onChange={e => setFormData({...formData, pass: e.target.value})} className="w-full bg-muted p-3 md:p-4 rounded-2xl border border-border outline-none font-bold text-foreground" /></div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex flex-col gap-1">
                                <span>Оборудование / Особенности (через запятую)</span>
                                <span className="text-red-500 normal-case opacity-80">Они превратятся в бейджи на главной странице!</span>
                              </label>
                              <textarea placeholder="64 камеры, 30 дней архива, СКУД..." value={formData.equipmentRaw} onChange={e => setFormData({...formData, equipmentRaw: e.target.value})} className="w-full bg-muted p-3 md:p-4 rounded-2xl border border-border h-24 md:h-32 outline-none font-bold resize-none text-foreground" />
                            </div>
                            <button disabled={isSaving} className="w-full bg-red-600 text-white font-black py-4 md:py-5 rounded-2xl md:rounded-3xl shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all uppercase tracking-widest text-[10px] active:scale-95">
                              {isSaving ? "СОХРАНЕНИЕ..." : "СОЗДАТЬ ОБЪЕКТ СИСТЕМЫ"}
                            </button>
                         </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Users size={64} className="mb-4 opacity-20" />
                  <h3 className="text-xl md:text-2xl font-black uppercase opacity-50 text-center">Выберите клиента<br/>в меню слева</h3>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* КОНСТРУКТОР КП (Показывается если выбран активный таб Planner) */
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="w-full bg-background/80 border border-border rounded-[32px] p-4 md:p-8 backdrop-blur-xl shadow-lg min-h-[700px] overflow-hidden"
          >
            <SbaPlanner />
          </motion.div>
        )}
      </main>
    </div>
  );
};