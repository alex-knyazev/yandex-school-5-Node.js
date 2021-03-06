const express = require('express');

const { getFileContent } = require('../cliTools/git');
const { createBreadCumpByPath } = require('../utils');

const router = express.Router();

/* GET users listing. */
router.get('/:branch/', async (req, res) => {
  getFilePage(req, res);
});

async function getFilePage(req, res) {
  const { branch } = req.params;
  const { path, commit } = req.query;
  
  let destination;
  if (commit) {
    destination = commit;
  } else {
    destination = branch;
  }
  if (!path || !branch) {
    res.send('you didn\'t provide the path to file or branch in request');
    return;
  }
  const pathBreadCump = createBreadCumpByPath(path || '/');
  res.charset = 'utf8';
  const fileContent = await getFileContent(destination, path || '/');
  if (!fileContent.errors.length) {
    res.render('file', {
      title: 'Мой гит',
      section: 'Файл',
      fileContent: fileContent.body,
      pathBreadCump,
      branch,
      commit,
    });
  } else {
    res.render('error', {
      errorText: fileContent.errors.join(','),
    });
  }
}

module.exports = { 
  router,
  getFilePage, 
};
