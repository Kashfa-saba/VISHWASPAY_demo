import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface InfoBlockProps {
  title: string;
  value: string;
  subValue?: string;
  type: 'lent' | 'borrowed';
  className?: string;
}

export function InfoBlock({ title, value, subValue, type, className }: InfoBlockProps) {
  const isLent = type === 'lent';
  
  return (
    <div className={cn(
      "p-6 rounded-2xl flex flex-col justify-between min-h-[160px] transition-all hover:scale-[1.02]",
      "art-frame shadow-sm",
      className
    )}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold uppercase tracking-widest opacity-60 text-foreground">
          {title}
        </span>
        <div className={cn(
          "p-2 rounded-full",
          isLent ? "bg-foreground/5 text-foreground" : "bg-foreground/5 text-foreground"
        )}>
          {isLent ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
        </div>
      </div>
      <div className="mt-4">
        <span className="text-3xl font-serif font-bold text-foreground">{value}</span>
        {subValue && (
          <p className="text-[10px] mt-1 uppercase tracking-widest font-medium opacity-60 text-foreground">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
