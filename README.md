# Doce&cia

## ⚙️ Dependências

---

<details>
  <summary><a>Bcryptjs</a></summary>

```sh
$ npm i bcryptjs

# Instalação das tipagens
$ npm i @types/bcryptjs -D
```

</details>

---

<details>
  <summary><a>Commitizen</a></summary>

```sh
$ npm i commitizen -D

# Configuração do Commitizen
$ npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

Atualizar `.git/hooks/prepare-commit-msg` com o código:

```sh
#!/bin/bash
exec < /dev/tty && node_modules/.bin/cz --hook || true
```

</details>

---

<details>
  <summary><a>Docker Compose</a></summary>
<blockquote>É necessário ter o docker já instalado na sua máquina.</blockquote>

```sh
# Criar o container com as configurações do arquivo `docker-compose.yml`
$ docker compose up -D
```

</details>

---

<details>
  <summary><a>Dotenv</a></summary>

```sh
$ npm i dotenv
```

</details>

---

<details>
  <summary><a>Eslint</a></summary>

```sh
$ npm i eslint -D

# Configuração do Eslint
$ npx eslint --init
```

</details>

---

<details>
  <summary><a>Fastify</a></summary>

```sh
$ npm i fastify
```

</details>

---

<details>
  <summary><a>Prisma</a></summary>

```sh
$ npm i prisma -D

$ npm i @prisma/client

# Inicializar o prisma
$ npx prisma init

# Gerar as migrations do banco de dados
$ npx prisma migrate dev
```

</details>

---

<details>
  <summary><a>Semantic-release</a></summary>

```sh
$ npm i semantic-release -D

# Plugins adicionais
$ npm i @semantic-release/git @semantic-release/changelog -D
```

</details>

---

<details>
  <summary><a>tsup</a></summary>

```sh
$ npm i tsup -D
```

</details>

---

<details>
  <summary><a>tsx</a></summary>

```sh
$ npm i tsx -D
```

</details>

---

<details>
  <summary><a>TypeScript</a></summary>

```sh
# Instalação do TypeScript e das tipagens para node
$ npm i typescript @types/node -D

# Inicializando o TypeScript
$ npx tsc --init
```

</details>

---

<details>
  <summary><a>Vitest</a></summary>

```sh
$ npm i vitest -D

# Plugin para que o vitest consiga entender os paths configurados no tsconfig
$ npm i vite-tsconfig-paths -D

# Interface para visualizar e executar os testes
$ npm i @vitest/ui -D
```

Criar arquivo de configuração do Vitest (`vite.config.ts`):

<blockquote>Adicionando o plugin nas configurações do Vitest</blockquote>

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
});
```

Adicionar os scripts de testes ao `package.json`:

```json
"scripts": {
  ...
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  },
```

</details>

---

<details>
  <summary><a>Zod</a></summary>
  
  ```sh
  $ npm i zod
  ```
</details>
