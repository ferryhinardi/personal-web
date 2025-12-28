import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Award, TrendingUp } from 'lucide-react';
import type { ResumeSection } from '@/types/resume.types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { staggerContainer, staggerItem, viewportOptions } from '@/utils/animations';

interface ResumeProps {
  data?: ResumeSection;
}

export default function Resume({ data }: ResumeProps) {
  if (!data) return null;

  const { skillmessage, education, work, skills } = data;

  return (
    <section id="resume" className="section-padding bg-gray-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="max-w-6xl mx-auto"
        >
          {/* Section Title */}
          <motion.div variants={staggerItem} className="text-center mb-16">
            <h2 className="section-title">Resume</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              My professional journey, education, and technical expertise
            </p>
          </motion.div>

          {/* Education Section */}
          <motion.div variants={staggerItem} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Academic Background</p>
              </div>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.school}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOptions}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {edu.school}
                          </h4>
                          <p className="text-lg text-cyan-600 dark:text-cyan-400 font-medium mb-2">
                            {edu.degree}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-sm self-start">
                          {edu.graduated}
                        </Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {edu.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Separator className="my-16" />

          {/* Work Experience Section */}
          <motion.div variants={staggerItem} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Work Experience</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Professional Journey</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500"></div>

              <div className="space-y-8">
                {work.map((job, index) => (
                  <motion.div
                    key={job.company}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportOptions}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline Dot */}
                    <div className="hidden md:block absolute left-[26px] top-6 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-white dark:border-slate-900 shadow-lg z-10"></div>

                    {/* Content Card */}
                    <Card className="md:ml-20 hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {job.company}
                            </h4>
                            <p className="text-lg text-cyan-600 dark:text-cyan-400 font-medium">
                              {job.title}
                            </p>
                          </div>
                          <Badge variant="outline" className="self-start whitespace-nowrap">
                            {job.years}
                          </Badge>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {job.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <Separator className="my-16" />

          {/* Skills Section */}
          <motion.div variants={staggerItem}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Technical Skills</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expertise & Proficiency</p>
              </div>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {skillmessage}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skill Bars */}
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill, index) => {
                const percentage = parseInt(skill.level);
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOptions}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {skill.name}
                          </h4>
                          <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                            {skill.level}
                          </span>
                        </div>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={viewportOptions}
                          transition={{ duration: 0.8, delay: index * 0.05 }}
                        >
                          <Progress
                            value={percentage}
                            className="h-3 bg-gray-200 dark:bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-600"
                          />
                        </motion.div>
                        
                        {/* Proficiency Label */}
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {percentage >= 90 ? (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              Expert
                            </span>
                          ) : percentage >= 75 ? (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              Advanced
                            </span>
                          ) : percentage >= 60 ? (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                              Intermediate
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                              Proficient
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
