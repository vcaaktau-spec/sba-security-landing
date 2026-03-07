import { Camera, Shield, Radar } from "lucide-react";

interface SponsorProps {
  icon: JSX.Element;
  name: string;
}

const sponsors: SponsorProps[] = [
  { icon: <Camera size={28} className="text-red-700" />, name: "Hikvision" },
  { icon: <Shield size={28} className="text-red-700" />, name: "Dahua" },
  { icon: <Radar size={28} className="text-red-700" />, name: "Uniview" },
  { icon: <Camera size={28} className="text-red-700" />, name: "HiWatch" },
  { icon: <Shield size={28} className="text-red-700" />, name: "Ezviz" },
  { icon: <Radar size={28} className="text-red-700" />, name: "IMOU" },
];

export const Sponsors = () => {
  const items = [...sponsors, ...sponsors];

  return (
    <section
      id="brands"
      className="container pt-24 sm:py-32 overflow-hidden"
    >
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-14 animate-marquee whitespace-nowrap">
          {items.map(({ icon, name }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-muted-foreground"
            >
              {icon}
              <span className="text-lg font-semibold">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};