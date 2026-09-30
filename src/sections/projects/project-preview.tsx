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
        <div className="flex h-full min-h-80 flex-col">
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
                igualaria a altura do card ao lado. max-w-[375px]: largura
                de viewport mobile (ex. iPhone SE/8), pro site carregar no
                layout responsivo dele em vez de espremer o desktop. */}
            <div
                className={`min-h-0 w-full max-w-[375px] flex-1 overflow-hidden rounded-3xl border border-border ${
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
