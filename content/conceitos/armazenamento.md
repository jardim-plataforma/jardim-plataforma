---
{
  "title": "Armazenamento e preservação de dados",
  "description": "Comparar armazenamento em objetos, blocos e arquivos e compreender versionamento, lifecycle e preservação.",
  "type": "conceito",
  "stage": "aprender",
  "status": "em-estudo",
  "created": "2026-10-26",
  "updated": "2026-10-28",
  "tags": [
    "conceito",
    "estudo",
    "armazenamento"
  ],
  "relations": [
    {
      "target": "conceitos/s3",
      "kind": "utiliza"
    }
  ]
}
---

## O problema que resolve

Escolher uma forma de guardar dados compatível com o acesso esperado e com os requisitos de recuperação.

## Como funciona

Armazenar significa preservar dados para utilização posterior. O modo de acesso esperado ajuda a escolher o serviço.

### Objetos, blocos e arquivos
| Modelo | Como a aplicação o utiliza | Exemplo AWS |
|---|---|---|
| Objetos | Envia e busca objetos por operações de uma API | S3 |
| Blocos | Utiliza um volume apresentado à máquina, sobre o qual pode existir um sistema de arquivos | EBS |
| Arquivos | Acessa diretórios e arquivos em um sistema de arquivos compartilhado | EFS |

Uma API é uma interface para programas fazerem solicitações a um sistema. No S3, enviar e buscar objetos envolve operações dessa interface. Um bucket não é automaticamente um disco conectado ao sistema operacional.

### Versionamento
No S3, habilitar versionamento permite preservar versões de uma mesma chave. Publicar novamente `portal/index.html` pode gerar uma nova versão, mantendo a anterior como não atual.

A semelhança com Git é a preservação de histórico. A diferença é a unidade e o mecanismo: versões de objetos não fornecem automaticamente commits que agrupam vários arquivos, branches, merges ou mensagens de alteração.

Uma versão não atual pode continuar sendo consultada explicitamente. “Não atual” não significa “não utilizada” e muito menos “sem valor”. Ela pode ser necessária para recuperação ou auditoria.

### Lifecycle e retenção
Lifecycle é o conjunto de regras para ações sobre objetos ao longo do tempo. Pode envolver expiração ou movimentação entre classes de armazenamento. Os filtros delimitam os objetos afetados.

No exemplo “excluir versões não atuais após 30 dias”, o marco é a passagem da versão para não atual, conforme a regra, e não a última leitura do arquivo. Uma versão criada há meses, mas substituída ontem, não tem meses como versão não atual.

Retenção é a decisão de preservação por um período. Regras de expiração ajudam a implementá-la, mas preservação obrigatória com proteção contra exclusão exige avaliar mecanismos próprios, como S3 Object Lock. Não devemos tratar toda retenção como bloqueio imutável.

A regra precisa explicar que dados atinge, quando o prazo começa e o que pode ser removido. Não é necessário aplicar o mesmo prazo a tudo.

## No fluxo de entrega

A aplicação publica e consulta dados; regras de versionamento e lifecycle definem o histórico preservado no armazenamento.

## Exemplo

Uma versão publicada há meses, mas substituída ontem, tem aproximadamente um dia como não atual. Ler a versão anterior não a torna atual.

## Como verificar

Explique qual serviço atende à necessidade e qual evento inicia cada prazo. Diferencie versão não atual de arquivo não acessado.

## Conexões

[[conceitos/s3]] — relação: **utiliza**.

## Referências

- [Armazenamento AWS](https://aws.amazon.com/products/storage/)
- [Versionamento S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
- [Elementos de lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html)
