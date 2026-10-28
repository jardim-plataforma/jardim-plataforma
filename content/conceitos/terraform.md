---
{
  "title": "Terraform HCL providers e módulos",
  "description": "Entender entradas, referências, providers, módulos, state, plan e apply no gerenciamento de infraestrutura como código.",
  "type": "conceito",
  "stage": "aprender",
  "status": "em-estudo",
  "created": "2026-10-26",
  "updated": "2026-10-28",
  "tags": [
    "conceito",
    "estudo",
    "terraform"
  ],
  "relations": [
    {
      "target": "conceitos/iac",
      "kind": "implementa"
    },
    {
      "target": "conceitos/aws",
      "kind": "utiliza"
    },
    {
      "target": "conceitos/terragrunt",
      "kind": "utiliza"
    }
  ]
}
---

## O problema que resolve

Descrever infraestrutura e administrar suas alterações com planejamento e associação entre código e recursos existentes.

## Como funciona

Terraform é um programa de infraestrutura como código. Lê uma configuração, usa providers para interagir com plataformas, planeja mudanças e executa operações. Seu alcance não se limita a AWS ou à nuvem.

### Python e Terraform
Python também pode chamar APIs AWS, por exemplo com Boto3. Um script simples pode criar um bucket. Para gerenciá-lo ao longo de alterações, precisa de lógica para identificar recursos, consultar configurações, decidir mudanças e tratar dependências.

Terraform fornece uma estrutura especializada para esse gerenciamento. O benefício não está em fazer uma chamada impossível em Python, mas em utilizar uma solução pronta para descrever e administrar infraestrutura de forma consistente.

IaC não surgiu exclusivamente com AWS. A nuvem favorece automação por suas APIs, mas infraestrutura local também pode ser gerenciada por código.

### HCL e arquivos
A linguagem Terraform utiliza sintaxe baseada em HCL, HashiCorp Configuration Language. Os arquivos terminam normalmente em `.tf`. A extensão não cria uma linguagem separada chamada TF.

Terragrunt também utiliza HCL, com blocos e regras próprios, em arquivos como `terragrunt.hcl`. Sintaxe compartilhada não significa que as duas ferramentas interpretem os mesmos blocos.

### Provider e resource
Um provider é um componente de software que implementa a integração de Terraform com uma plataforma. O provider AWS disponibiliza tipos como `aws_s3_bucket`.

```hcl
resource "aws_s3_bucket" "documentacao" {
  bucket = var.bucket_name
}
```

`resource` declara algo a gerenciar. `aws_s3_bucket` é o tipo disponibilizado pelo provider. `documentacao` é um nome interno no código. `var.bucket_name` consulta uma entrada. O provider implementa as operações AWS; esse código define o recurso desejado.

### Módulo
Um módulo é um conjunto de arquivos Terraform em um diretório. Pode conter recursos, variáveis, consultas e saídas, e chamar outros módulos. Uma equipe pode reunir bucket, bloqueio público, versionamento e criptografia em um módulo reutilizável.

O módulo não é obrigatoriamente um pacote do provider nem possui relação de um para um com ele. Pode utilizar vários tipos e providers. A analogia com uma função parametrizada ajuda, mas suas declarações formam dependências; não são uma lista de chamadas executadas na ordem das linhas.

| Arquivo convencional | Finalidade |
|---|---|
| `variables.tf` | Entradas e validações |
| `main.tf` | Declarações e cálculos |
| `outputs.tf` | Resultados disponibilizados |

Os nomes são convenções; os arquivos `.tf` do diretório compõem a configuração.

### State plan e apply
O state registra a associação entre endereços no código e recursos gerenciados, além de atributos e metadados. É produzido e atualizado pela ferramenta; não é um formulário que precisamos escrever manualmente.

O plan apresenta operações propostas com base na configuração, no state e, normalmente, na consulta aos recursos. Pode indicar criação, atualização, substituição ou remoção. Não é apenas uma descrição do resultado desejado.

O apply executa mudanças. `terraform apply` pode gerar um plano na própria execução; não exige sempre um arquivo de plano salvo antes. Separar revisão e aplicação é útil em processos de equipe.

State não é o conjunto de HTMLs do portal e não representa uma cópia de segurança completa dos documentos. Backend Terraform é o mecanismo em que o state é armazenado.

### Leitura e escrita posteriores
A prática deve avançar de um recurso e uma variável para referências, outputs, módulo e chamada do módulo. Terragrunt entra depois dessa base. Escrever e validar código não comprova que recursos foram criados; isso exige aplicação e verificação.

## No fluxo de entrega

A execução lê a configuração, considera o state e consulta recursos para planejar operações. O apply realiza mudanças com as credenciais disponíveis.

## Exemplo

Em resource "aws_s3_bucket" "documentacao", documentacao é o nome usado no código. O argumento bucket define o nome na AWS. Uma tag com a referência ao nome registra texto e não coloca um bucket dentro do outro.

## Como verificar

Leia o plan antes de aplicar, confira endereços e valores e verifique o resultado na plataforma. Salvar arquivos no GitHub não cria infraestrutura sem uma execução correspondente.

## Conexões

[[conceitos/iac]] — relação: **implementa**.

[[conceitos/aws]] — relação: **utiliza**.

[[conceitos/terragrunt]] — relação: **utiliza**.

## Referências

- [Terraform](https://developer.hashicorp.com/terraform/intro)
- [Sintaxe](https://developer.hashicorp.com/terraform/language/syntax/configuration)
- [Providers](https://developer.hashicorp.com/terraform/language/providers)
- [Módulos](https://developer.hashicorp.com/terraform/language/modules)
- [State](https://developer.hashicorp.com/terraform/language/state/purpose)
