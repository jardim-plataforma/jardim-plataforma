---
{
  "title": "Terragrunt e coordenação do Terraform",
  "description": "Comparar o consumo de um módulo em Terraform e Terragrunt e compreender o papel de cada arquivo e ferramenta.",
  "type": "conceito",
  "stage": "aprender",
  "status": "em-estudo",
  "created": "2026-10-26",
  "updated": "2026-10-28",
  "tags": [
    "conceito",
    "estudo",
    "terragrunt"
  ],
  "relations": [
    {
      "target": "conceitos/terraform",
      "kind": "utiliza"
    }
  ]
}
---

## O problema que resolve

Organizar configurações e coordenar execuções quando existem vários ambientes, estados e dependências.

## Como funciona

Terragrunt é um programa que ajuda a preparar, organizar e coordenar execuções Terraform ou OpenTofu. A utilidade fica mais visível quando há várias configurações, ambientes, estados e dependências.

### Comparar o mesmo módulo
O código reutilizável do bucket pode ficar em `modules/s3-bucket/`, com arquivos `.tf`.

Uma configuração Terraform consumidora em `ambientes/dev/main.tf` poderia chamar esse módulo:

```hcl
module "documentacao" {
  source      = "../../modules/s3-bucket"
  bucket_name = "jardim-documentacao-dev"
}
```

Outra opção é uma unidade Terragrunt em `ambientes/dev/terragrunt.hcl`:

```hcl
terraform {
  source = "../../modules/s3-bucket"
}

inputs = {
  bucket_name = "jardim-documentacao-dev"
}
```

As duas formas ilustram maneiras diferentes de consumir o mesmo código Terraform. São exemplos alternativos; não devemos colocar ambos na mesma execução como se fossem necessários para criar o mesmo bucket. Faltam configurações como provider e armazenamento de state, conforme o projeto.

No segundo exemplo, o Terragrunt lê source, prepara o código indicado e passa inputs como entradas para Terraform. O Terraform continua interpretando os arquivos `.tf` e gerenciando os recursos.

### Por que acrescentar uma ferramenta
Com apenas um módulo e um ambiente, o exemplo curto não demonstra uma vantagem grande. Com dev, homologação e produção, podemos precisar compartilhar configurações, separar states e coordenar dependências, mantendo valores específicos por ambiente.

Terraform também permite reutilizar módulos sem Terragrunt. Terragrunt acrescenta mecanismos de organização; sua adoção depende da necessidade e do padrão da equipe.

### Limite da comparação com Kubernetes
A comparação ajuda apenas a visualizar coordenação. Kubernetes reconcilia continuamente workloads em um cluster. Terragrunt normalmente prepara e coordena execuções de infraestrutura quando é acionado. Ele não é um Kubernetes de processos Terraform.

### Qual programa lê qual arquivo
| Programa | Arquivo comum | Linguagem e propósito |
|---|---|---|
| Terraform | `main.tf` | Linguagem Terraform baseada em HCL; declara recursos e chamadas de módulos |
| Terraform | `variables.tf` | Mesma linguagem; declara entradas |
| Terragrunt | `terragrunt.hcl` | Configuração Terragrunt baseada em HCL; organiza a execução |

HCL não é uma terceira aplicação que fica dentro de um recurso. É a linguagem de configuração utilizada como base pelas ferramentas.

## No fluxo de entrega

Terragrunt prepara o código e os inputs da unidade; Terraform continua interpretando os arquivos tf e gerenciando recursos por seus providers.

## Exemplo

Uma unidade dev pode passar bucket_name = jardim-documentacao-dev ao mesmo módulo utilizado por outra unidade com um nome diferente. Esse nome é uma entrada, não outro módulo.

## Como verificar

Localize o arquivo terragrunt.hcl, o source e os inputs; depois encontre os arquivos tf e suas entradas. Verifique a configuração efetiva e o plano antes de aplicar.

## Conexões

[[conceitos/terraform]] — relação: **utiliza**.

## Referências

- [Visão geral Terragrunt](https://docs.terragrunt.com/getting-started/overview/)
- [Unidades](https://docs.terragrunt.com/features/units/)
