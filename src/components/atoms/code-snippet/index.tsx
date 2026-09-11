interface CodeSnippetProps {
    code: string;
    filename: string;
    language: string;
}

/**
 * Trecho de código real — texto de verdade (não imagem): selecionável,
 * lido por leitor de tela, leve. Mesma fonte mono do resto do site.
 */
export const CodeSnippet = ({ code, filename, language }: CodeSnippetProps) => {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <span className="font-mono text-xs text-muted-foreground">
                    {filename}
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    {language}
                </span>
            </div>
            <section
                tabIndex={0}
                aria-label={`Código de ${filename}, role horizontalmente com as setas`}
                className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground"
            >
                <pre>
                    <code className="font-mono">{code}</code>
                </pre>
            </section>
        </div>
    );
};
