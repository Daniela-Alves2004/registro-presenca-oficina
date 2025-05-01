# Sistema de Registro de Presença em Oficinas

## Contexto
Desenvolver um sistema para controle de presença dos alunos e voluntários participantes das oficinas de ensino de um projeto de extensão da faculdade. O sistema visa facilitar o registro de presenças e ausências, além de organizar os cadastros de oficinas e participantes.

## Tecnologias Utilizadas
- React.js + JavaScript
- Node.js + Express.js
- SQLite 
- Jest

## Funcionalidades
- Cadastro e gerenciamento de oficinas.
- Cadastro e gerenciamento de alunos vinculados às oficinas.
- Registro de presença e ausência de alunos nas oficinas.
- Cadastro e autenticação de usuários do sistema (opcional/desejável).
- Interface web amigável e funcional para administradores do sistema.

## Arquitetura
Sistema baseado em arquitetura cliente-servidor:
- **Frontend:** React.js utilizando JavaScript.
- **Backend:** Responsável pelo armazenamento, manipulação e fornecimento dos dados, utilizando Node.js (com Express) e SQLite como banco de dados.

## Diagrama da Arquitetura

O diagrama abaixo ilustra a arquitetura completa do sistema, mostrando o fluxo de dados e a interação entre os componentes:
![image_2025-05-01_175847717](https://github.com/user-attachments/assets/0bf5f27c-c2e3-4076-aae3-4d5fc912a3d0)

## Como executar o projeto
```bash
# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```
## Desenvolvedores 
- Daniela Dos Santos Alves 2465728
- Giovani Gabriel Mendes Ohira de Rossi 2454360
