import {
  TrendingUp,
  Truck,
  Factory,
  PlayCircle,
  ShoppingBag,
  HeartPulse,
  Building2,
  Cpu,
  Zap,
  Globe,
  Package,
  BarChart3,
  Shield,
  Landmark,
  Tv,
  Stethoscope,
  Store,
  MapPin,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const INDUSTRIA_ICON_MAP: Record<string, LucideIcon> = {
  "trending-up": TrendingUp,
  truck: Truck,
  factory: Factory,
  "play-circle": PlayCircle,
  "shopping-bag": ShoppingBag,
  "heart-pulse": HeartPulse,
  "building-2": Building2,
  cpu: Cpu,
  zap: Zap,
  globe: Globe,
  package: Package,
  "bar-chart-3": BarChart3,
  shield: Shield,
  landmark: Landmark,
  tv: Tv,
  stethoscope: Stethoscope,
  store: Store,
  "map-pin": MapPin,
  wrench: Wrench,
};

interface IndustriaIconProps {
  name: string | null | undefined;
  className?: string;
}

export function IndustriaIcon({ name, className }: IndustriaIconProps) {
  const Icon = (name && INDUSTRIA_ICON_MAP[name]) || Globe;
  return <Icon className={className ?? "w-6 h-6"} aria-hidden="true" />;
}

export interface SectorColor {
  border: string;
  iconBg: string;
  iconColor: string;
  labelColor: string;
  hoverBorder: string;
}

export const SECTOR_COLORS: Record<string, SectorColor> = {
  fintech: {
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    labelColor: "text-emerald-400",
    hoverBorder: "hover:border-emerald-500/50",
  },
  "medios-entretenimiento": {
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    labelColor: "text-violet-400",
    hoverBorder: "hover:border-violet-500/50",
  },
  salud: {
    border: "border-rose-500/20",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    labelColor: "text-rose-400",
    hoverBorder: "hover:border-rose-500/50",
  },
  "retail-ecommerce": {
    border: "border-orange-500/20",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    labelColor: "text-orange-400",
    hoverBorder: "hover:border-orange-500/50",
  },
  logistica: {
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    labelColor: "text-blue-400",
    hoverBorder: "hover:border-blue-500/50",
  },
  manufactura: {
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    labelColor: "text-amber-400",
    hoverBorder: "hover:border-amber-500/50",
  },
};

export const DEFAULT_SECTOR_COLOR: SectorColor = {
  border: "border-white/10",
  iconBg: "bg-white/5",
  iconColor: "text-primary",
  labelColor: "text-primary",
  hoverBorder: "hover:border-primary/40",
};
