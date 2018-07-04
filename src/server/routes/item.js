const router = require('express-promise-router')();

const ItemHandler = require('../services/ItemHandler');

const itemHandler = new ItemHandler();

const productsList = require('../../database/Product');

router.get('/', (req, res) => {
  res.render('index', { message: 'Shopping List', products: productsList, listOfItems: itemHandler.getList() });
});

router.post('/', (req, res) => {
  itemHandler.createNewItem(req.body);
  res.render('index', { message: 'Shopping List', products: productsList, listOfItems: itemHandler.getList() });
});

router.put('/:id', (req, res) => {
  itemHandler.modifyItem(req.params.id, req.body);

  if (req.accepts('application/json')) {
    return res.json({ ok: true });
  }

  return res.render('index', { message: 'Shopping List', products: productsList, listOfItems: itemHandler.getList() });
});

router.delete('/:id', (req, res) => {
  itemHandler.removeItemOfList(req.params.id);

  if (req.accepts('application/json')) {
    return res.json({ ok: true });
  }

  return res.render('index', { message: 'Shopping List', products: productsList, listOfItems: itemHandler.getList() });
});

module.exports = router;
