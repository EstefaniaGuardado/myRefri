import expect from 'unexpected';
expect.clone();
import unexpectedSinon from 'unexpected-sinon';
expect.use(unexpectedSinon);
import sinon from 'sinon';

import ItemHandler from './ItemHandler';
import Unit from '../model/Unity';
import ItemDAO from '../dao/ItemDAO';

const itemId = '6fg7hdf';
const productId = '2adsf4';
const unit = Unit.kilogram;
const quantity = 5;

describe('Item Handler', () => {
  let sut;
  let itemDAO;
  let itemMock;

  beforeEach(() => {
    itemDAO = sinon.createStubInstance(ItemDAO);

    sut = new ItemHandler(itemDAO);
  });

  context('when starting the system', () => {
    const userId = '5jadsfn';
    let response;

    describe('when searching an item by the id', () => {
      beforeEach(async () => {
        itemMock = sinon.mock();

        itemDAO.getItemById.resolves(itemMock);

        response = await sut.findItemById(itemId);
      });

      it('should pass the item identifier', () =>
        expect(itemDAO.getItemById, 'was called with', itemId),
      );

      it('should return the searched item', () =>
        expect(response, 'to be', itemMock),
      );
    });

    describe('when requesting the list of items', () => {
      beforeEach(() => {
        itemMock = sinon.mock();
        itemDAO.getItemListByUser.resolves([itemMock]);

        response = sut.getList(userId);
      });

      it('should pass user identifier', () => {
        expect(itemDAO.getItemListByUser, 'was called with', userId);
      });

      it('should return an empty list', () => {
        expect(response, 'to be fulfilled with', [itemMock]);
      });
    });

    describe('when adding items to the list', () => {
      beforeEach(async () => {
        itemDAO.createItem.onCall(0).resolves(null)
                          .onCall(1).resolves(null);

        await sut.createNewItem(productId, unit, quantity, userId);
        await sut.createNewItem(productId, unit, quantity, userId);
      });

      it('should pass the item information', () => {
        sinon.assert.calledWith(itemDAO.createItem.firstCall, productId, sinon.match.date, unit, quantity, userId);
        sinon.assert.calledWith(itemDAO.createItem.secondCall, productId, sinon.match.date, unit, quantity, userId);
      });
    });

    describe('when modify an item', () => {
      const newUnit = Unit.gram;
      const newQuantity = 6;

      beforeEach(async () => {
        itemDAO.updateItem.resolves();

        await sut.modifyItem(itemId, newUnit, newQuantity);
      });

      it('should pass the new item information', () =>
        expect(itemDAO.updateItem, 'was called with', itemId, newUnit, newQuantity),
      );
    });

    describe('when remove an item', () => {
      beforeEach(async () => {
        itemDAO.deleteItem.resolves();

        await sut.removeItemOfList(itemId);
      });

      it('should pass the identifier of the item to remove', () => {
        expect(itemDAO.deleteItem, 'was called with', itemId);
      });
    });
  });
});
