import blueprintBgLight from '@assets/images/about-blueprint-bg-light.webp';
import blueprintBgDark from '@assets/images/about-blueprint-bg.webp';
import profilePhoto from '@assets/images/profile-cutout.webp';
import { BlueprintFrame } from '@components/atoms/blueprint-frame';
import { CourseList } from '@components/molecules/general/course-list';
import { EducationList } from '@components/molecules/general/education-list';
import { ExperienceTimeline } from '@components/molecules/general/experience-timeline';
import { GlowPortrait } from '@components/molecules/general/glow-portrait';
import { SkillsFlow } from '@components/molecules/general/skills-flow';
import { StoryCards } from '@components/molecules/general/story-cards';
import { TechCarousel } from '@components/molecules/general/tech-carousel';
import { ThemedBackgroundImage } from '@components/molecules/general/themed-background-image';

import { COURSES, EDUCATION, EXPERIENCE, STORY, TOOLING } from './data';

export const AboutMe = () => {
    return (
        <section
            id="about"
            aria-labelledby="about-title"
            className="mx-auto max-w-6xl overflow-x-clip px-6 xl:overflow-x-visible"
        >
            <div className="py-12 lg:py-16">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    <div>
                        <p className="font-mono text-xs font-bold uppercase text-accent">
                            Sobre mim
                        </p>

                        <h2
                            id="about-title"
                            className="mt-3 max-w-[40rem] font-mono text-3xl font-bold leading-relaxed text-foreground sm:text-4xl"
                        >
                            <span className="block">Eu sou a Leidejane,</span>
                            <span className="block text-accent">
                                desenvolvedora Full Stack.
                            </span>
                        </h2>

                        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                            Transformo ideias em soluções digitais, unindo
                            tecnologia, lógica e um olhar atento às pessoas.
                            Gosto de entender o que acontece por baixo do
                            framework — e construir soluções que fazem sentido.
                        </p>
                    </div>

                    <GlowPortrait
                        src={profilePhoto}
                        alt="Retrato de Leidejane da Rosa"
                    />
                </div>

                <StoryCards entries={STORY} />

                <div className="mt-8 border-y border-border py-4 text-center">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground sm:text-sm">
                        <span aria-hidden="true">—</span> Ferramenta não é
                        engenharia <span aria-hidden="true">—</span>
                    </p>
                </div>
            </div>

            <div className="relative pb-24 pt-8 lg:pt-4">
                <ThemedBackgroundImage
                    lightSrc={blueprintBgLight}
                    darkSrc={blueprintBgDark}
                />

                <div className="grid gap-10 md:grid-cols-2 lg:gap-12 xl:grid-cols-3">
                    <div className="col-span-1">
                        <h3 className="font-mono text-xl font-bold text-foreground">
                            Experiência
                        </h3>
                        <div className="mt-5">
                            <ExperienceTimeline entries={EXPERIENCE} />
                        </div>
                    </div>

                    <div className="col-span-1 space-y-10">
                        <div>
                            <h3 className="font-mono text-xl font-bold text-foreground">
                                Educação
                            </h3>
                            <div className="mt-5">
                                <EducationList entries={EDUCATION} />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-mono text-xl font-bold text-foreground">
                                Cursos
                            </h3>
                            <div className="mt-5">
                                <CourseList
                                    entries={COURSES}
                                    initialCount={4}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="min-w-0 md:col-span-2 xl:col-span-1 xl:min-w-96">
                        <BlueprintFrame grid className="p-3 sm:p-6">
                            <SkillsFlow />
                        </BlueprintFrame>
                    </div>
                </div>
                <div className="mt-4 min-w-0 lg:mt-5">
                    <TechCarousel
                        items={TOOLING}
                        label="Outras ferramentas do dia a dia"
                    />
                </div>
            </div>
        </section>
    );
};
