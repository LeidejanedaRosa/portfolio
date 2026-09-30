// Folga vertical padrão de toda seção de conteúdo (Home, Sobre, Projetos,
// FAQ, Contato). Fonte única em vez de repetir o valor em cada seção: foi
// exatamente essa duplicação — cada seção com um padding-top diferente, ou
// nenhum — que fazia o título pousar numa posição diferente ao navegar pelo
// menu (achado real da Leidejane). Duas constantes, não uma só combinada:
// em Sobre o topo e o fundo ficam em elementos diferentes (a <section> em
// si não pode ter padding — a imagem de fundo precisa cobrir ela inteira),
// então as duas precisam poder ser usadas separadas.
export const SECTION_PT = 'pt-16';
export const SECTION_PB = 'pb-24';
