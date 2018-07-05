const { expect } = require('chai');
const clientApp = require('../app/client');
require('../app/server');

module.exports = () => {
  let productId;

  describe('Integration Test', () => {
    it('Timeout error when there is no active app with specified app name', async () => {
      try {
        await clientApp.service('nonExistingApp.products').create({
          name: 'testproduct',
          price: '100',
        });
      } catch (e) {
        expect(e.message).to.be.equal('Request timed out.');
      }
    }).timeout(10000);

    it('Error when service does not exist on server app', async () => {
      try {
        await clientApp.service('ServerAppName.categories').create({
          name: 'testproduct',
          price: '100',
        });
      } catch (e) {
        expect(e.name).to.be.equal('NotFound');
      }
    });

    it('Can call create method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').create({
        name: 'testproduct',
        price: '100',
      });
      productId = result._id;
      expect(result.name).to.be.equal('testproduct');
      expect(result.price).to.be.equal('100');
      expect(result._id).to.not.be.equal(undefined);
    });

    it('Can call get method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').get(productId);
      expect(result.name).to.be.equal('testproduct');
      expect(result.price).to.be.equal('100');
      expect(result._id.toString()).to.be.equal(productId);
    });

    it('Can call find method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').find({});
      expect(result.total).to.be.equal(1);
      expect(result.limit).to.be.equal(2);
      expect(result.skip).to.be.equal(0);
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].name).to.be.equal('testproduct');
      expect(result.data[0].price).to.be.equal('100');
      expect(result.data[0]._id.toString()).to.be.equal(productId);
    });

    it('Can call patch method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').patch(productId, { name: 'newtestproduct' });
      expect(result.name).to.be.equal('newtestproduct');
      expect(result.price).to.be.equal('100');
      expect(result._id.toString()).to.be.equal(productId);
    });

    it('Can call update method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').update(productId, { price: '1000' });
      expect(result.name).to.be.equal(undefined);
      expect(result.price).to.be.equal('1000');
      expect(result._id.toString()).to.be.equal(productId);
    });

    it('Can call remove method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').remove(productId);
      expect(result.name).to.be.equal(undefined);
      expect(result.price).to.be.equal('1000');
      expect(result._id.toString()).to.be.equal(productId);
      const findResult = await clientApp.service('ServerAppName.products').find({});
      expect(findResult.total).to.be.equal(0);
      expect(findResult.limit).to.be.equal(2);
      expect(findResult.skip).to.be.equal(0);
      expect(findResult.data.length).to.be.equal(0);
    });
  });
};
