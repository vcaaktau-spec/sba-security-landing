import { Badge } from "./ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Camera, ShieldCheck, Wrench } from "lucide-react";

export const HeroCards = () => {
  return (
    <div className="hidden lg:block relative w-[620px] h-[480px]">

      {/* IP камеры */}
      <Card className="absolute top-0 left-16 w-[260px] shadow-xl hover:-translate-y-2 transition-all duration-300">
        <CardHeader className="flex flex-row gap-3">
          <Camera className="text-red-600" />
          <CardTitle>IP видеонаблюдение</CardTitle>
        </CardHeader>

        <CardContent>
          Установка современных IP камер для дома и бизнеса.
        </CardContent>
      </Card>


      {/* Монтаж */}
      <Card className="absolute top-6 right-0 w-[260px] shadow-xl hover:-translate-y-2 transition-all duration-300">
        <CardHeader className="flex flex-row gap-3">
          <Wrench className="text-red-600" />
          <CardTitle>Монтаж под ключ</CardTitle>
        </CardHeader>

        <CardContent>
          Проектирование и установка систем любой сложности.
        </CardContent>
      </Card>


      {/* удаленный доступ */}
      <Card className="absolute top-[170px] left-[120px] w-[280px] shadow-2xl hover:-translate-y-2 transition-all duration-300 z-10">
        <CardHeader className="flex justify-between">
          <CardTitle>Удалённый доступ</CardTitle>
          <Badge className="bg-red-600">24/7</Badge>
        </CardHeader>

        <CardDescription className="px-6">
          Просмотр камер с телефона из любой точки мира.
        </CardDescription>

        <CardContent>
          <Button className="w-full bg-red-700 hover:bg-red-800">
            Подробнее
          </Button>
        </CardContent>
      </Card>


      {/* сервис */}
      <Card className="absolute bottom-0 right-16 w-[280px] shadow-xl hover:-translate-y-2 transition-all duration-300">
        <CardHeader className="flex gap-3">
          <ShieldCheck className="text-red-600" />
          <div>
            <CardTitle>Сервис и поддержка</CardTitle>

            <CardDescription className="mt-2">
              Обслуживание систем и помощь при неисправностях.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

    </div>
  );
};