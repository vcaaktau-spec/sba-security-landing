import { useUser } from "@clerk/clerk-react";
import { Navbar } from "../components/Navbar";
import { Lock, Loader2 } from "lucide-react";
import { GlobalBackground } from "../components/GlobalBackground";
import { SbaPlanner } from "../components/SbaPlanner";

export const Dashboard = () => {
  const { user, isLoaded } = useUser();

  // Пока данные пользователя грузятся, показываем лоадер
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  // Проверяем роль
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="relative min-h-screen flex flex-col pt-32 pb-20 px-4 md:px-6">
      <GlobalBackground />
      <Navbar />
      
      <main className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col gap-8">
        {isAdmin ? (
          /* ВИД ДЛЯ АДМИНА: Показываем Конструктор КП */
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                Рабочий стол <span className="text-red-600">Админа</span>
              </h1>
              <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-red-500/20 w-fit">
                Admin Mode
              </div>
            </div>
            
            {/* Обертка для конструктора, чтобы он смотрелся премиально */}
            <div className="w-full bg-background/80 border border-border rounded-[32px] p-4 md:p-8 backdrop-blur-xl shadow-xl min-h-[700px] overflow-hidden">
              <SbaPlanner />
            </div>
          </div>
        ) : (
          /* ВИД ДЛЯ ОБЫЧНОГО ПОЛЬЗОВАТЕЛЯ: Красивая заглушка */
          <div className="bg-background/60 border border-border rounded-[32px] p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[50vh] backdrop-blur-xl shadow-lg mt-10">
            <div className="w-20 h-20 bg-red-500/5 border border-red-500/10 rounded-full flex items-center justify-center mb-6">
              <Lock size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-foreground">
              Раздел временно <span className="text-red-600">закрыт</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-8 font-medium leading-relaxed">
              Личный кабинет находится в стадии масштабного обновления. Мы настраиваем защищенную систему для вашего удобства.
            </p>
            <a 
              href="https://wa.me/77779204988" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-foreground text-background font-bold px-8 py-4 rounded-2xl transition-all uppercase tracking-widest text-[11px] shadow-lg hover:bg-red-600 hover:text-white active:scale-95"
            >
              Связаться с поддержкой
            </a>
          </div>
        )}
      </main>
    </div>
  );
};