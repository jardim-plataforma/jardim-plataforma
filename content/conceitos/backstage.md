---
{
  "title": "Backstage e documentação com TechDocs",
  "description": "Entender Backstage como framework de software e TechDocs como solução de documentação integrada ao portal.",
  "type": "conceito",
  "stage": "aprender",
  "status": "em-estudo",
  "created": "2026-10-26",
  "updated": "2026-10-28",
  "tags": [
    "conceito",
    "estudo",
    "backstage"
  ],
  "relations": [],
  "isolated": true
}
---

## O problema que resolve

Organizar informações, ferramentas e documentação para as equipes encontrarem e utilizarem capacidades compartilhadas.

## Como funciona

Backstage é software: um framework de código aberto para construir portais de desenvolvedores. Framework, neste contexto, significa uma estrutura de software extensível, com componentes e formas de integração que a equipe utiliza para construir uma aplicação.

Ele não é uma metodologia. O termo framework também aparece em métodos de trabalho, mas não é esse o sentido aqui. Backstage também não é um sistema operacional como Linux; a semelhança mencionada no estudo é a disponibilidade de código aberto.

### O portal construído pela equipe
A equipe instala, configura, executa e mantém uma aplicação baseada no Backstage. Ela pode reunir catálogo de software, responsáveis, documentação e templates para criação de projetos.

Cadastrar um serviço no catálogo não significa provisionar automaticamente toda a infraestrutura dele. As automações dependem das funcionalidades e integrações configuradas. Um portal pode apresentar informações de um serviço que já existe.

Engenharia de plataforma é o trabalho de oferecer capacidades compartilhadas às equipes. O portal pode ajudar a encontrá-las e utilizá-las, mas plataforma também envolve automações, operação, suporte e evolução dessas capacidades.

### TechDocs
TechDocs é a solução de documentação do ecossistema Backstage, implementada por componentes de software e ferramentas. Não é apenas uma exigência genérica de “ter documentação técnica”.

A abordagem docs like code significa escrever e manter documentação com práticas semelhantes às do código, como Git, revisão e automação. Essa abordagem é um conceito; TechDocs é uma implementação que utiliza essa abordagem.

As pessoas continuam escrevendo o conteúdo: instruções, exemplos e explicações. TechDocs não descobre sozinho como usar os templates e não escreve automaticamente um manual correto sobre eles.

Um fluxo de publicação gera arquivos de apresentação a partir dos documentos e os disponibiliza para leitura no portal. A infraestrutura necessária depende da arquitetura escolhida. Um armazenamento externo pode conservar esses arquivos independentemente das instâncias da aplicação.

## No fluxo de entrega

A equipe escreve documentação, o processo gera e publica os arquivos e o portal os apresenta. Habilitar TechDocs não escreve automaticamente os manuais.

## Exemplo

Instalar Backstage e habilitar TechDocs não produz instruções sobre os templates. As pessoas precisam escrever o conteúdo e configurar a geração, publicação e consulta.

## Como verificar

Confirme que existe conteúdo escrito, geração bem-sucedida, publicação e consulta. Cadastrar um serviço no catálogo não comprova provisionamento de sua infraestrutura.

## Conexões

Esta nota permanece isolada no mapa nesta etapa do estudo, por escolha editorial. TechDocs é tratado aqui dentro do Backstage.

## Referências

- [O que é Backstage](https://backstage.io/docs/overview/what-is-backstage/)
- [Arquitetura TechDocs](https://backstage.io/docs/features/techdocs/architecture/)
