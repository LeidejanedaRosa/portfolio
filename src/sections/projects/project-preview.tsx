// Altura fixa do preview abaixo de md (ver comentário no wrapper). 440px
// mostra bem mais do site embutido do que os 320px de antes, sem ficar
// longo demais de rolar no celular.
const MOBILE_PREVIEW_HEIGHT = 'h-[440px]';

export function ProjectPreview({
    title,
    url,
    hugCenter,
}: {
    title: string;
    url: string;
    /** Borda da coluna voltada pro traço central — o box de 375px gruda
     * nela (em vez de `mx-auto`) pro traço de comprimento fixo sempre
     * alcançar a borda de verdade do iframe. */
    hugCenter: 'left' | 'right';
}) {
    return (
        // Altura fixa (não min-h-*) abaixo de md: sem `md:grid` (ver
        // TimelineRow), não existe irmão de linha pro CSS Grid esticar
        // contra, então este wrapper fica com altura "auto" mesmo com
        // min-height — e altura "auto" não é definida o bastante pra
        // propagar % pros filhos (o `flex-1` do box do iframe, e o
        // `h-full` do próprio iframe), que caíam pro tamanho padrão do
        // navegador (~300×150). Altura fixa dá definição pra essa cadeia
        // de % resolver direito; md:h-full volta a esticar igual ao card
        // quando o Grid entra em ação.
        <div className={`flex ${MOBILE_PREVIEW_HEIGHT} flex-col md:h-full`}>
            <div className="flex shrink-0 items-center justify-between gap-3 pb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Exemplo ao vivo
                </span>
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-xs text-accent hover:underline"
                >
                    Abrir em nova aba <span aria-hidden="true">↗</span>
                </a>
            </div>
            {/* min-h-0: um item flex não encolhe abaixo da altura natural
                do conteúdo por padrão — sem isso, o flex-1 do iframe nunca
                igualaria a altura do card ao lado. max-w-93.75 (375px):
                largura de viewport mobile (ex. iPhone SE/8), pro site
                carregar no layout responsivo dele em vez de espremer o
                desktop. */}
            <div
                className={`min-h-0 w-full max-w-93.75 flex-1 overflow-hidden rounded-3xl border border-border ${
                    hugCenter === 'left' ? 'mr-auto' : 'ml-auto'
                }`}
            >
                {/* loading="lazy": evita carregar 4 sites externos inteiros
                    junto com a Home (impacto de performance conhecido, ver
                    docs/BACKLOG.md). */}
                <iframe
                    src={url}
                    title={`Pré-visualização ao vivo de ${title}`}
                    loading="lazy"
                    // allow-same-origin: o Verificador do FCR é
                    // offline-first via Service Worker, que exige o mesmo
                    // origin do iframe pra registrar. Sem allow-top-navigation
                    // nem allow-popups: o site embutido não pode redirecionar
                    // a aba inteira nem abrir popups. Sem allow-downloads:
                    // nenhum dos sites embutidos oferece download.
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    className="h-full w-full"
                />
            </div>
        </div>
    );
}
