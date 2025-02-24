module.exports = function (plop) {
  plop.setGenerator('page', {
    description: 'Criar uma nova página',
    prompts: [
      {
        type: 'input',
        name: 'pageName',
        message: 'Qual o nome da nova página?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/pages/{{kebabCase pageName}}/functions/index.ts',
        templateFile: 'src/infra/templates/functions/index.hbs',
      },
      {
        type: 'add',
        path: 'src/pages/{{kebabCase pageName}}/hooks/index.tsx',
        templateFile: 'src/infra/templates/hooks/index.hbs',
      },
      {
        type: 'add',
        path: 'src/pages/{{kebabCase pageName}}/template/index.tsx',
        templateFile: 'src/infra/templates/template/template.hbs',
      },
      {
        type: 'add',
        path: 'src/pages/{{kebabCase pageName}}/template/components/index.tsx',
        templateFile: 'src/infra/templates/template/components/index.hbs',
      },
      {
        type: 'add',
        path: 'src/pages/{{kebabCase pageName}}/index.tsx',
        templateFile: 'src/infra/templates/index.hbs',
      },
      {
        type: 'add',
        path: 'src/pages/{{kebabCase pageName}}/mocks/TableColumns.tsx',
        templateFile: 'src/infra/templates/mocks/index.hbs',
      },
      {
        type: 'add',
        path: 'src/pages/{{kebabCase pageName}}/domain/models/index.ts',
        templateFile: 'src/infra/templates/domain/models/index.hbs',
      },
      {
        type: 'add',
        path: 'src/pages/{{kebabCase pageName}}/domain/services/{{kebabCase pageName}}.useCases.ts',
        templateFile: 'src/infra/templates/domain/services/service.useCases.hbs',
      },
      {
        type: 'add',
        path: 'src/pages/{{kebabCase pageName}}/domain/index.ts',
        templateFile: 'src/infra/templates/domain/index.hbs',
      },
    ],
  });
};
