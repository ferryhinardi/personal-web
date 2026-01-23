import {useState, useMemo, lazy, Suspense} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {ExternalLink, Code2, Filter, X, Rocket} from 'lucide-react';
import type {Portfolio as PortfolioData, Project, ProjectMetrics} from '@/types/resume.types';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {TechStack} from '@/components/ui/tech-badge';
import OptimizedImage from '@/components/ui/optimized-image';
import {SectionTransition} from '@/components/ui/section-transition';
import {TiltCard} from '@/components/ui/tilt-card';
import {FloatingBadge} from '@/components/ui/floating-badge';
import {staggerContainer, staggerItem, viewportOptions} from '@/utils/animations';

// Lazy load the heavy modal component
const ProjectModal = lazy(() =>
  import('./Portfolio/ProjectModal').then((module) => ({default: module.ProjectModal})),
);

interface PortfolioProps {
  data?: PortfolioData;
}

// Helper function to get the top 3 most important metrics for display
const getTopMetrics = (metrics?: ProjectMetrics): Array<{label: string; value: string}> => {
  if (!metrics) return [];

  const metricsList: Array<{label: string; value: string; priority: number}> = [];

  // High priority metrics
  if (metrics.users) metricsList.push({label: 'Users', value: metrics.users, priority: 1});
  if (metrics.revenueIncrease)
    metricsList.push({label: 'Revenue ↑', value: metrics.revenueIncrease, priority: 1});
  if (metrics.sellers) metricsList.push({label: 'Sellers', value: metrics.sellers, priority: 1});
  if (metrics.transactions)
    metricsList.push({label: 'Transactions', value: metrics.transactions, priority: 1});
  if (metrics.verifiedProperties)
    metricsList.push({label: 'Properties', value: metrics.verifiedProperties, priority: 1});
  if (metrics.toolsCount)
    metricsList.push({label: 'Tools', value: metrics.toolsCount, priority: 1});
  if (metrics.activeUsers)
    metricsList.push({label: 'Active Users', value: metrics.activeUsers, priority: 1});

  // Medium priority metrics
  if (metrics.performanceScore)
    metricsList.push({
      label: 'Performance',
      value: `${metrics.performanceScore}/100`,
      priority: 2,
    });
  if (metrics.conversionIncrease)
    metricsList.push({label: 'Conversion ↑', value: metrics.conversionIncrease, priority: 2});
  if (metrics.userSatisfaction)
    metricsList.push({label: 'Satisfaction', value: metrics.userSatisfaction, priority: 2});
  if (metrics.safetyRating)
    metricsList.push({label: 'Safety', value: metrics.safetyRating, priority: 2});
  if (metrics.bookingTimeReduction)
    metricsList.push({label: 'Time Saved', value: metrics.bookingTimeReduction, priority: 2});

  // Sort by priority and take top 3
  return metricsList.sort((a, b) => a.priority - b.priority).slice(0, 3);
};

export default function Portfolio({data}: PortfolioProps) {
  if (!data) return null;

  const {projects} = data;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Get all unique technologies from all projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.technologies?.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects based on selected technology
  const filteredProjects = useMemo(() => {
    if (!selectedTech) return projects;
    return projects.filter((project) => project.technologies?.includes(selectedTech));
  }, [projects, selectedTech]);

  return (
    <>
      {/* Section Transition from Resume */}
      <SectionTransition
        type="wave"
        position="top"
        fillColor="rgb(249, 250, 251)"
        backgroundColor="rgb(255, 255, 255)"
        height={80}
        className="dark:hidden"
      />
      <SectionTransition
        type="wave"
        position="top"
        fillColor="rgb(30, 41, 59)"
        backgroundColor="rgb(15, 23, 42)"
        height={80}
        className="hidden dark:block"
      />

      <section id="portfolio" className="section-padding bg-gray-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
          >
            {/* Section Title */}
            <motion.div variants={staggerItem} className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 mb-4">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                A showcase of impactful projects that solve real-world problems and delight users
              </p>
            </motion.div>

            {/* Technology Filter */}
            {allTechnologies.length > 0 && (
              <motion.div variants={staggerItem} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Filter by Technology
                  </h3>
                  {selectedTech && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedTech(null)}
                      className="ml-auto text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear Filter
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTechnologies.map((tech, index) => (
                    <FloatingBadge
                      key={tech}
                      delay={index * 0.05}
                      variant={selectedTech === tech ? 'default' : 'outline'}
                      className={`cursor-pointer ${
                        selectedTech === tech
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent'
                          : ''
                      }`}
                      onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                    >
                      {tech}
                    </FloatingBadge>
                  ))}
                </div>
                {selectedTech && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                    Showing {filteredProjects.length} of {projects.length} projects
                  </p>
                )}
              </motion.div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => {
                  const projectImage = `/images/portfolio/${project.image}`;
                  return (
                    <motion.div
                      key={project.title}
                      layout
                      initial={{opacity: 0, y: 30}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, scale: 0.9}}
                      transition={{
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                        delay: index * 0.1,
                      }}
                    >
                      <TiltCard maxTilt={8} glare shadow className="h-full">
                        <Card className="group overflow-hidden h-full">
                          <div className="relative overflow-hidden aspect-video">
                            <motion.div
                              className="w-full h-full"
                              whileHover={{scale: 1.1}}
                              transition={{duration: 0.5, ease: 'easeOut'}}
                            >
                              <OptimizedImage
                                src={projectImage}
                                alt={project.title}
                                width={600}
                                height={400}
                                responsive={false}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedProject(project)}
                                  className="flex-1 bg-white/90 hover:bg-white text-slate-900"
                                >
                                  View Details
                                </Button>
                                {project.url !== '#' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(project.url, '_blank')}
                                    className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                              {project.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                              {project.category}
                            </p>

                            {/* Project Metrics */}
                            {project.metrics && getTopMetrics(project.metrics).length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {getTopMetrics(project.metrics).map((metric, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-700 dark:text-green-300 font-medium"
                                  >
                                    {metric.label}: {metric.value}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Tech Stack */}
                            {project.technologies && project.technologies.length > 0 && (
                              <TechStack
                                technologies={project.technologies}
                                limit={4}
                                className="mb-3"
                              />
                            )}

                            {/* View Live Demo Button */}
                            {project.liveUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(project.liveUrl, '_blank');
                                }}
                                className="w-full mt-3 border-2 border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              >
                                <Rocket className="w-4 h-4 mr-2" />
                                View Live Demo
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Project Details Modal - Lazy Loaded */}
        <Suspense fallback={null}>
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </Suspense>
      </section>
    </>
  );
}
