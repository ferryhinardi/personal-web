import { GraduationCap, Briefcase, Award, TrendingUp } from 'lucide-react';
import type { ResumeSection } from '@/types/resume.types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import SkillsRadar from '@/components/ui/skills-radar';

interface ResumeProps {
  data?: ResumeSection;
}

export default function Resume({ data }: ResumeProps) {
  console.log('Resume component - data:', data);
  
  if (!data) {
    console.error('Resume component - No data provided!');
    return (
      <section id="resume" className="section-padding bg-gray-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="section-title">Resume</h2>
            <p className="text-gray-600 dark:text-gray-400">Loading resume data...</p>
          </div>
        </div>
      </section>
    );
  }

  const { skillmessage, education, work, skills } = data;
  
  console.log('Resume component - Parsed data:', { 
    skillmessage, 
    educationCount: education?.length, 
    workCount: work?.length, 
    skillsCount: skills?.length 
  });

  return (
    <section id="resume" className="section-padding bg-gray-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="section-title">Resume</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A journey of continuous learning, innovative solutions, and technical mastery
            </p>
          </div>

          {/* Education Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Building the foundation for excellence</p>
              </div>
            </div>

            <div className="space-y-6">
              {education && education.length > 0 ? (
                education.map((edu) => (
                  <div key={edu.school}>
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
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No education data available.</p>
              )}
            </div>
          </div>

          <Separator className="my-16" />

          {/* Work Experience Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Work Experience</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Where passion meets impact</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500"></div>

              <div className="space-y-8">
                {work && work.length > 0 ? (
                  work.map((job) => (
                    <div
                      key={job.company}
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
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No work experience data available.</p>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-16" />

          {/* Skills Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Technical Skills</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tools I wield to build amazing things</p>
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
            {skills && skills.length > 0 ? (
              <SkillsRadar skills={skills} />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No skills data available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
