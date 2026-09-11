import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { CodeSnippet } from './index';

describe('<CodeSnippet />', () => {
    it('mostra o nome do arquivo, a linguagem e o código como texto real', () => {
        render(
            <CodeSnippet
                code="const x = 1;"
                filename="example.ts"
                language="TypeScript"
            />,
        );

        expect(screen.getByText('example.ts')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        // texto de verdade (selecionável/lido por leitor de tela), não uma <img>
        expect(screen.getByText('const x = 1;')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(
            <CodeSnippet code="x = 1" filename="a.py" language="Python" />,
        );

        expect(await axe(container)).toHaveNoViolations();
    });
});
