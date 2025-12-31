import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2, Filter, X, Rocket } from 'lucide-react';
import type { Portfolio as PortfolioData, Project, ProjectMetrics } from '@/types/resume.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TechStack } from '@/components/ui';
import OptimizedImage from '@/components/ui/optimized-image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { staggerContainer, staggerItem, viewportOptions } from '@/utils/animations';

interface PortfolioProps {
  data?: PortfolioData;
}

// Helper function to get the top 3 most important metrics for display
const getTopMetrics = (metrics?: ProjectMetrics): Array<{ label: string; value: string }> => {
  if (!metrics) return [];
  
  const metricsList: Array<{ label: string; value: string; priority: number }> = [];
  
  // High priority metrics
  if (metrics.users) metricsList.push({ label: 'Users', value: metrics.users, priority: 1 });
  if (metrics.revenueIncrease) metricsList.push({ label: 'Revenue ↑', value: metrics.revenueIncrease, priority: 1 });
  if (metrics.sellers) metricsList.push({ label: 'Sellers', value: metrics.sellers, priority: 1 });
  if (metrics.transactions) metricsList.push({ label: 'Transactions', value: metrics.transactions, priority: 1 });
  if (metrics.verifiedProperties) metricsList.push({ label: 'Properties', value: metrics.verifiedProperties, priority: 1 });
  if (metrics.toolsCount) metricsList.push({ label: 'Tools', value: metrics.toolsCount, priority: 1 });
  if (metrics.activeUsers) metricsList.push({ label: 'Active Users', value: metrics.activeUsers, priority: 1 });
  
  // Medium priority metrics
  if (metrics.performanceScore) metricsList.push({ label: 'Performance', value: `${metrics.performanceScore}/100`, priority: 2 });
  if (metrics.conversionIncrease) metricsList.push({ label: 'Conversion ↑', value: metrics.conversionIncrease, priority: 2 });
  if (metrics.userSatisfaction) metricsList.push({ label: 'Satisfaction', value: metrics.userSatisfaction, priority: 2 });
  if (metrics.safetyRating) metricsList.push({ label: 'Safety', value: metrics.safetyRating, priority: 2 });
  if (metrics.bookingTimeReduction) metricsList.push({ label: 'Time Saved', value: metrics.bookingTimeReduction, priority: 2 });
  
  // Sort by priority and take top 3
  return metricsList
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);
};

export default function Portfolio({ data }: PortfolioProps) {
  if (!data) return null;

  const { projects } = data;
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
    return projects.filter((project) =>
      project.technologies?.includes(selectedTech)
    );
  }, [projects, selectedTech]);

  return (
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
                {allTechnologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant={selectedTech === tech ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      selectedTech === tech
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent hover:from-cyan-600 hover:to-blue-700'
                        : 'border-slate-300 dark:border-slate-600 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-500/10'
                    }`}
                    onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                  >
                    {tech}
                  </Badge>
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
              {filteredProjects.map((project) => {
              const projectImage = `/images/portfolio/${project.image}`;
              return (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative overflow-hidden aspect-video">
                      <OptimizedImage
                        src={projectImage}
                        alt={project.title}
                        width={600}
                        height={400}
                        responsive={false}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
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
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
               <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedProject.title}
                </DialogTitle>
              </DialogHeader>
               <div className="space-y-6">
                 <div className="relative overflow-hidden rounded-lg aspect-video">
                   <OptimizedImage
                     src={`/images/portfolio/${selectedProject.image}`}
                     alt={selectedProject.title}
                     width={800}
                     height={450}
                     responsive={false}
                     className="w-full h-full"
                   />
                 </div>
                
                {/* Project Metadata */}
                {(selectedProject.role || selectedProject.team || selectedProject.duration) && (
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                    {selectedProject.role && (
                      <div>
                        <span className="font-semibold">Role:</span> {selectedProject.role}
                      </div>
                    )}
                    {selectedProject.team && (
                      <div>
                        <span className="font-semibold">Team:</span> {selectedProject.team}
                      </div>
                    )}
                    {selectedProject.duration && (
                      <div>
                        <span className="font-semibold">Duration:</span> {selectedProject.duration}
                      </div>
                    )}
                  </div>
                )}

                {/* Short Description */}
                {selectedProject.description && (
                  <DialogDescription className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {selectedProject.description}
                  </DialogDescription>
                )}

                {/* Challenge Section */}
                {selectedProject.challenge && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-amber-500">🎯</span> Challenge
                    </h4>
                    <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                      {selectedProject.challenge}
                    </p>
                  </div>
                )}

                {/* Solution Section */}
                {selectedProject.solution && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-blue-500">💡</span> Solution
                    </h4>
                    <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                      {selectedProject.solution}
                    </p>
                  </div>
                )}

                {/* Impact Section */}
                {selectedProject.impact && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-green-500">📈</span> Impact
                    </h4>
                    <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                      {selectedProject.impact}
                    </p>
                  </div>
                )}

                {/* Project Metrics Section */}
                {selectedProject.metrics && Object.keys(selectedProject.metrics).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-purple-500">📊</span> Key Metrics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedProject.metrics.users && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Users</div>
                          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{selectedProject.metrics.users}</div>
                        </div>
                      )}
                      {selectedProject.metrics.revenueIncrease && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Revenue Increase</div>
                          <div className="text-lg font-bold text-green-700 dark:text-green-300">{selectedProject.metrics.revenueIncrease}</div>
                        </div>
                      )}
                      {selectedProject.metrics.performanceScore && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Performance</div>
                          <div className="text-lg font-bold text-purple-700 dark:text-purple-300">{selectedProject.metrics.performanceScore}/100</div>
                        </div>
                      )}
                      {selectedProject.metrics.conversionIncrease && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Conversion Increase</div>
                          <div className="text-lg font-bold text-amber-700 dark:text-amber-300">{selectedProject.metrics.conversionIncrease}</div>
                        </div>
                      )}
                      {selectedProject.metrics.loadTimeReduction && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Load Time Saved</div>
                          <div className="text-lg font-bold text-teal-700 dark:text-teal-300">{selectedProject.metrics.loadTimeReduction}</div>
                        </div>
                      )}
                      {selectedProject.metrics.toolsCount && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Tools Available</div>
                          <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{selectedProject.metrics.toolsCount}</div>
                        </div>
                      )}
                      {selectedProject.metrics.userSatisfaction && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200 dark:border-rose-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">User Satisfaction</div>
                          <div className="text-lg font-bold text-rose-700 dark:text-rose-300">{selectedProject.metrics.userSatisfaction}</div>
                        </div>
                      )}
                      {selectedProject.metrics.activeUsers && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Active Users</div>
                          <div className="text-lg font-bold text-violet-700 dark:text-violet-300">{selectedProject.metrics.activeUsers}</div>
                        </div>
                      )}
                      {selectedProject.metrics.bookingTimeReduction && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 border border-lime-200 dark:border-lime-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Booking Time Saved</div>
                          <div className="text-lg font-bold text-lime-700 dark:text-lime-300">{selectedProject.metrics.bookingTimeReduction}</div>
                        </div>
                      )}
                      {selectedProject.metrics.sellers && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200 dark:border-sky-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Sellers</div>
                          <div className="text-lg font-bold text-sky-700 dark:text-sky-300">{selectedProject.metrics.sellers}</div>
                        </div>
                      )}
                      {selectedProject.metrics.transactions && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Transactions</div>
                          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{selectedProject.metrics.transactions}</div>
                        </div>
                      )}
                      {selectedProject.metrics.verifiedProperties && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 border border-fuchsia-200 dark:border-fuchsia-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Verified Properties</div>
                          <div className="text-lg font-bold text-fuchsia-700 dark:text-fuchsia-300">{selectedProject.metrics.verifiedProperties}</div>
                        </div>
                      )}
                      {selectedProject.metrics.safetyRating && (
                        <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Safety Rating</div>
                          <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{selectedProject.metrics.safetyRating}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fallback to category if no new fields */}
                {!selectedProject.description && !selectedProject.challenge && (
                  <DialogDescription className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {selectedProject.category}
                  </DialogDescription>
                )}

                {/* Technologies Used */}
                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      Technologies Used
                    </h4>
                    <TechStack technologies={selectedProject.technologies} />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {selectedProject.liveUrl && (
                    <Button
                      onClick={() => window.open(selectedProject.liveUrl, '_blank')}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      View Live Demo
                    </Button>
                  )}
                  {selectedProject.url !== '#' && selectedProject.url !== selectedProject.liveUrl && (
                    <Button
                      onClick={() => window.open(selectedProject.url, '_blank')}
                      variant="outline"
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      More Info
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
