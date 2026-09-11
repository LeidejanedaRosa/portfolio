import {
    siCelery,
    siCypress,
    siExpress,
    siFastify,
    siFlask,
    siGit,
    siGithubactions,
    siMongodb,
    siNodedotjs,
    siPostgresql,
    siPytest,
    siPython,
    siReact,
    siRedis,
    siStorybook,
    siStyledcomponents,
    siTailwindcss,
    siTypescript,
    siZod,
} from 'simple-icons';

import { BlueprintFrame } from '@components/atoms/blueprint-frame';
import { TechIcon } from '@components/atoms/tech-icon';

const STACK = [
    {
        label: 'Front-end',
        techs: [
            siReact,
            siTypescript,
            siTailwindcss,
            siStyledcomponents,
            siStorybook,
            siZod,
        ],
    },
    {
        label: 'Back-end',
        techs: [siNodedotjs, siFastify, siExpress, siPython, siFlask],
    },
    {
        label: 'Dados & infra',
        techs: [siPostgresql, siMongodb, siRedis, siCelery],
    },
    {
        label: 'Testes & fluxo',
        techs: [siCypress, siPytest, siGit, siGithubactions],
    },
] as const;

export const AboutMe = () => {
    return (
        <section
            id="about"
            aria-labelledby="about-title"
            className="mx-auto max-w-6xl px-6 py-24"
        >
            <h2
                id="about-title"
                className="font-mono text-3xl font-bold text-foreground"
            >
                Sobre mim
            </h2>

            <div className="mt-10 max-w-2xl space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                    Aprendi a programar no ensino médio, no técnico de
                    Informática — Visual Basic, Delphi, Access. Naquela época
                    não deu pra seguir carreira, então fui por outro caminho:
                    fiz Gestão de Negócios e toquei por quase três anos uma
                    empresa de decoração de festas infantis.
                </p>
                <p>
                    Voltei pra programação em 2022, pela Cubos Academy, e de lá
                    saí direto pra primeira vaga — quase dois anos como
                    desenvolvedora full-stack na Clarke Energia, entre front,
                    back, design system, testes e as primeiras decisões de
                    arquitetura de verdade. Também fui monitora na Cubos,
                    ajudando cerca de 30 pessoas em transição de carreira a
                    destravar seus projetos.
                </p>
                <p>
                    Hoje trabalho como freelancer, em projetos próprios e de
                    impacto social, e busco uma vaga plena e remota. O que me
                    prende em software é entender o que acontece embaixo do
                    framework: arquitetura, dados, resiliência, escala.{' '}
                    <strong className="font-semibold text-foreground">
                        Ferramenta não é engenharia.
                    </strong>
                </p>
            </div>

            <div className="mt-14">
                <BlueprintFrame grid className="p-8">
                    <h3 className="sr-only">Tecnologias</h3>
                    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                        {STACK.map((group) => (
                            <div key={group.label}>
                                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                                    {group.label}
                                </p>
                                <ul className="mt-5 grid grid-cols-3 gap-x-2 gap-y-6">
                                    {group.techs.map((tech) => (
                                        <TechIcon
                                            key={tech.title}
                                            icon={tech}
                                        />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </BlueprintFrame>

                <p className="mt-4 text-sm text-muted-foreground">
                    Também: Playwright, testes E2E, CI/CD, Clean Code, SOLID,
                    acessibilidade e arquitetura.
                </p>
            </div>
        </section>
    );
};
