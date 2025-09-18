# 💰 Controle Financeiro Pessoal

Uma aplicação moderna e intuitiva para gerenciar suas finanças pessoais, desenvolvida com React, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

### 📊 Gestão de Transações
- **Adicionar/Editar/Excluir** receitas e despesas
- **Categorização** automática de transações
- **Transações recorrentes** para custos fixos
- **Validação robusta** de dados com Zod

### 📈 Análise Financeira
- **Visão geral** do saldo atual
- **Projeções mensais** baseadas em transações recorrentes
- **Navegação por mês** para análise histórica
- **Cálculo automático** de saldos acumulados

### 🎨 Interface Moderna
- **Design responsivo** para desktop e mobile
- **Tema claro/escuro** (preparado para implementação)
- **Animações suaves** e feedback visual
- **Acessibilidade** completa (ARIA labels, navegação por teclado)

### 🔧 Recursos Técnicos
- **Error Boundaries** para tratamento de erros
- **Validação em tempo real** de formulários
- **Persistência local** com localStorage
- **Performance otimizada** com React.memo
- **TypeScript rigoroso** para maior confiabilidade

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd din-control-flow-main
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:8080
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run build:dev    # Cria build de desenvolvimento

# Qualidade de Código
npm run lint         # Executa ESLint
npm audit            # Verifica vulnerabilidades

# Preview
npm run preview      # Visualiza build de produção
```

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI (shadcn/ui)
│   ├── BalanceCard.tsx # Card de saldo
│   ├── TransactionCard.tsx # Card de transação
│   └── ...
├── hooks/              # Hooks personalizados
│   ├── useTransactions.ts # Hook para gerenciar transações
│   └── use-toast.ts    # Hook para notificações
├── lib/                # Utilitários e validações
│   ├── utils.ts        # Funções utilitárias
│   └── validations.ts  # Schemas de validação Zod
├── pages/              # Páginas da aplicação
└── App.tsx            # Componente principal
```

### Tecnologias Utilizadas

- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes de UI
- **Zod** - Validação de schemas
- **date-fns** - Manipulação de datas
- **React Query** - Gerenciamento de estado
- **React Router** - Roteamento

## 🧪 Testes

### Executar Testes
```bash
# Instalar dependências de teste (quando implementado)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Executar testes
npm run test
```

### Cobertura de Testes
- **Componentes**: Testes unitários para componentes principais
- **Hooks**: Testes para hooks personalizados
- **Validações**: Testes para schemas Zod
- **Integração**: Testes de fluxo completo

## 🔒 Segurança

- ✅ **Vulnerabilidades corrigidas** (esbuild atualizado)
- ✅ **Validação de entrada** com Zod
- ✅ **Sanitização de dados** antes do armazenamento
- ✅ **Error boundaries** para captura de erros
- ✅ **TypeScript strict** para prevenção de bugs

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona perfeitamente em:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large screens** (1400px+)

## ♿ Acessibilidade

- ✅ **ARIA labels** em todos os elementos interativos
- ✅ **Navegação por teclado** completa
- ✅ **Contraste adequado** de cores
- ✅ **Foco visível** em elementos
- ✅ **Semântica HTML** correta

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Deploy Estático
O projeto pode ser deployado em qualquer serviço de hospedagem estática:
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

### Variáveis de Ambiente
```env
VITE_APP_TITLE=Controle Financeiro
VITE_APP_VERSION=1.0.0
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique os [Issues](../../issues) existentes
2. Crie um novo issue com detalhes do problema
3. Inclua logs de erro e passos para reproduzir

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] **Tema escuro** completo
- [ ] **Exportação de dados** (CSV, PDF)
- [ ] **Gráficos avançados** com Recharts
- [ ] **Metas financeiras** e acompanhamento
- [ ] **Relatórios mensais** automáticos
- [ ] **Backup na nuvem** (opcional)
- [ ] **PWA** para uso offline

### Melhorias Técnicas
- [ ] **Testes E2E** com Playwright
- [ ] **Storybook** para documentação de componentes
- [ ] **CI/CD** com GitHub Actions
- [ ] **Monitoramento** de erros (Sentry)
- [ ] **Analytics** de uso

---

**Desenvolvido com ❤️ para ajudar você a controlar suas finanças!**