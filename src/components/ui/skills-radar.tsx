import {lazy, Suspense} from 'react';
import {motion} from 'framer-motion';
import {Skeleton} from '@/components/ui/skeleton';

const SkillsRadarChart = lazy(() => import('./SkillsRadarChart.tsx'));

interface Skill {
  name: string;
  level: string;
}

interface SkillsRadarProps {
  skills: Skill[];
  className?: string;
}

export default function SkillsRadar({skills, className = ''}: SkillsRadarProps) {
  const skillsByCategory = {
    frontend: skills.filter((s) =>
      ['React.js', 'TypeScript', 'Next.js', 'JavaScript', 'HTML5 & CSS'].includes(s.name)
    ),
    mobile: skills.filter((s) => ['React Native'].includes(s.name)),
    backend: skills.filter((s) => ['GraphQL', 'Node.js', 'REST APIs'].includes(s.name)),
    devops: skills.filter((s) =>
      ['GitHub Actions', 'AWS (S3, CloudFront, ECS)', 'Docker'].includes(s.name)
    ),
    design: skills.filter((s) => ['Figma'].includes(s.name)),
  };

  return (
    <div className={`${className}`}>
      {/* Radar Chart - Lazy loaded */}
      <Suspense
        fallback={
          <div className="mb-8">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        }
      >
        <motion.div
          initial={{opacity: 0, scale: 0.9}}
          whileInView={{opacity: 1, scale: 1}}
          viewport={{once: true}}
          transition={{duration: 0.5}}
          className="mb-8"
        >
          <SkillsRadarChart skills={skills} />
        </motion.div>
      </Suspense>

      {/* Skills List by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
          if (categorySkills.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 capitalize">
                {category}
              </h3>
              <div className="space-y-3">
                {categorySkills.map((skill) => {
                   const level = parseInt(skill.level.replace('%', ''));

                   return (
                     <div
                       key={skill.name}
                       className="group cursor-pointer"
                     >
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-sm font-medium transition-colors duration-200 text-gray-300">
                           {skill.name}
                         </span>
                         <span className="text-xs text-gray-500">{skill.level}</span>
                       </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1,
                            ease: 'easeOut',
                            delay: 0.2,
                          }}
                           className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-cyan-500/80 via-blue-600/80 to-purple-700/80"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
