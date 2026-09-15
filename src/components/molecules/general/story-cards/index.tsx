import { type ComponentType, type SVGProps } from 'react';

export interface StoryCardEntry {
    id: string;
    title: string;
    text: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    /** Ex.: "2013–2020". Opcional — nem toda fase tem um período único. */
    period?: string;
}

interface StoryCardsProps {
    entries: readonly StoryCardEntry[];
}

/**
 * A história como uma faixa de cards lado a lado (não empilhados numa
 * coluna estreita) — cada fase com sua própria caixa, sem numeração (não é
 * um ranking, cada fase é só uma fase diferente — número não fazia sentido
 * aqui, diferente do 01/02/03 do Projetos, que É uma vitrine ordenada).
 * grid (não flex-wrap): todo item na mesma linha fica com a mesma altura,
 * então um texto mais longo numa fase não deixa as outras "baixas" e essa
 * "alta" desalinhadas. 5 colunas em lg (uma linha só): o hero da Parte 1
 * precisa caber numa tela só, e uma linha custa bem menos altura que 2.
 * Ícone dentro de um círculo (não solto) e período em accent (não
 * muted-foreground): visual de referência que ela trouxe — mais "card de
 * produto", menos lista burocrática. border-accent/20 (não border-border
 * neutro) + glow no círculo do ícone: ela comparou com o modelo de
 * referência e achou nosso card "apagado" perto do brilho da foto — isso
 * aproxima o tratamento dos dois sem copiar 1:1 (sem fundo semi-transparente
 * "vidro", que exigiria um fundo escuro fixo atrás pra funcionar; aqui
 * continua funcionando em cima de bg-surface normal, claro ou escuro).
 */
export const StoryCards = ({ entries }: StoryCardsProps) => {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {entries.map((entry) => {
                const Icon = entry.icon;

                return (
                    <li
                        key={entry.id}
                        className="relative rounded-lg border border-accent/20 bg-surface p-3 lg:p-3.5"
                    >
                        <div className="absolute inset-0 flex justify-end items-start pr-4 pt-4">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 shadow-[0_0_12px_rgb(var(--color-accent)/0.45)]">
                                <Icon className="h-8 w-8 text-accent" />
                            </span>
                        </div>
                        <div className="relative pr-12">
                            <h3 className="mt-2 font-mono text-sm font-bold text-foreground">
                                {entry.title}
                            </h3>
                            {entry.period && (
                                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-accent">
                                    {entry.period}
                                </span>
                            )}
                        </div>
                        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                            {entry.text}
                        </p>
                    </li>
                );
            })}
        </ul>
    );
};
