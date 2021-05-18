/* eslint-disable */
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: 'api-choice',
    type: 'list',
    message: 'What kind of template would you like to generate?',
    choices: CHOICES
  },
  {
    name: 'entity-name',
    type: 'input',
    message: 'Entity name (PascalCase & singular) | example: Booking or BookingPayment :',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Entity name may only include letters, numbers, underscores and hashes.';
    }
  },
  {
    name: 'file-name',
    type: 'input',
    message: 'File name (camelCase & singular) | example: booking or bookingPayment :',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Entity name may only include letters, numbers, underscores and hashes.';
    }
  }
];

const CURR_DIR = process.cwd();
const SPACING = `    `;

inquirer.prompt(QUESTIONS)
  .then(answers => {
    const apiChoice = answers['api-choice'];
    const entityName = answers['entity-name'];
    const fileName = answers['file-name'];
    const templatePath = `${__dirname}/templates/${apiChoice}`;

    createDirectoryContents(templatePath, fileName, entityName, apiChoice);
    addNewTypes(entityName);
    addNewCollection(entityName, fileName);
  });

function addNewTypes(entityName){
  const typesPath = `${CURR_DIR}/src/types.ts`
  const stats = fs.statSync(typesPath);

  if (stats.isFile()) {
    const content = fs.readFileSync(typesPath, 'utf8');
    const symbol = "// SYMBOL //";
    const newTypes = `${symbol}\n${SPACING}${entityName}Service: Symbol.for('${entityName}Service'),\n${SPACING}${entityName}Repository: Symbol.for('${entityName}Repository'),`
    const newContent = content.replace(symbol, newTypes);
    fs.writeFileSync(typesPath, newContent, 'utf8');
  }  
}

function addNewCollection(entityName, fileName){
  const typesPath = `${CURR_DIR}/src/infra/database/config/collection.ts`
  const stats = fs.statSync(typesPath);

  if (stats.isFile()) {
    const content = fs.readFileSync(typesPath, 'utf8');
    const symbol = "// COLLECTIONS //";
    const newTypes = `${symbol}\n${SPACING}${entityName}: '${fileName}s',`
    const newContent = content.replace(symbol, newTypes);
    fs.writeFileSync(typesPath, newContent, 'utf8');
  }  
}

function exportNewFile(originPath, fileName) {
  fs.appendFile(`${originPath}/index.ts`, `export * from './${fileName}';\n`, function (err) {
    if (err) throw err;
  });  
}

function rename(originFile, fileName) {
  const originPath = path.dirname(originFile);
  const originName = path.basename(originFile);
  const newName = originName.replace('__', fileName);

  exportNewFile(originPath, fileName);
  
  fs.rename(originFile, originPath + '/' + newName, function(err) {
    if(err) throw err
    console.log(originPath + '/' + newName);
  });
}

function replaceContent(content, fileName, entityName) {
  const regexEntity = /####/gi;
  const regexFileName = /FFFF/gi;
  return content.replace(regexEntity, entityName).replace(regexFileName, fileName);
}

function createDirectoryContents (templatePath, fileName, entityName, apiChoice) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;
    const originPath = path.dirname(origFilePath);
    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const content = fs.readFileSync(origFilePath, 'utf8');
      const relativePath = path.relative(process.cwd(), originPath);
      const srcPath = relativePath.substring(`templates/${apiChoice}/`.length);
      const writePath = `${CURR_DIR}/${srcPath}/${file}`;

      const newContent = replaceContent(content, fileName, entityName);
      fs.writeFileSync(writePath, newContent, 'utf8');
      rename(writePath, fileName);
    } else if (stats.isDirectory()) {
      mkdirp(`${originPath}/${file}`, {}, function(err) {
        if(err) throw err
      });

      // recursive call
      createDirectoryContents(`${templatePath}/${file}`, fileName, entityName, apiChoice);
    }
  });
}