import { Badge } from "./badge";

// Technology color mapping for visual consistency
const techColors: Record<string, string> = {
  // JavaScript Frameworks
  "React.js": "bg-[#61DAFB] text-black",
  "React": "bg-[#61DAFB] text-black",
  "Next.js": "bg-black text-white",
  "React Native": "bg-[#61DAFB] text-black",
  "Vue.js": "bg-[#4FC08D] text-white",
  "Angular": "bg-[#DD0031] text-white",
  
  // Languages
  "TypeScript": "bg-[#3178C6] text-white",
  "JavaScript": "bg-[#F7DF1E] text-black",
  
  // Backend
  "Node.js": "bg-[#339933] text-white",
  "Express": "bg-gray-700 text-white",
  "GraphQL": "bg-[#E10098] text-white",
  
  // Databases
  "MongoDB": "bg-[#47A248] text-white",
  "PostgreSQL": "bg-[#336791] text-white",
  "Redis": "bg-[#DC382D] text-white",
  
  // Cloud & Infrastructure
  "AWS": "bg-[#FF9900] text-black",
  "Vercel": "bg-black text-white",
  "Firebase": "bg-[#FFCA28] text-black",
  
  // Styling
  "Tailwind CSS": "bg-[#06B6D4] text-white",
  "CSS3": "bg-[#1572B6] text-white",
  
  // Default fallback
  default: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
};

interface TechBadgeProps {
  technology: string;
  className?: string;
}

export function TechBadge({ technology, className = "" }: TechBadgeProps) {
  const colorClass = techColors[technology] || techColors.default;
  
  return (
    <Badge 
      className={`${colorClass} border-0 font-medium text-xs px-3 py-1 ${className}`}
    >
      {technology}
    </Badge>
  );
}

interface TechStackProps {
  technologies: string[];
  limit?: number;
  className?: string;
}

export function TechStack({ technologies, limit, className = "" }: TechStackProps) {
  const displayTechs = limit ? technologies.slice(0, limit) : technologies;
  const remaining = limit && technologies.length > limit ? technologies.length - limit : 0;
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTechs.map((tech) => (
        <TechBadge key={tech} technology={tech} />
      ))}
      {remaining > 0 && (
        <Badge className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-0">
          +{remaining} more
        </Badge>
      )}
    </div>
  );
}
