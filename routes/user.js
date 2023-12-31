const express = require('express');
const router = express.Router();
const settings_controller = require('../controllers/settings.controller');
const auth_controller = require('../controllers/auth.controller');
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { permit } = require('../config/role-auth');

  router.get('/selling',ensureAuthenticated,permit('User'), settings_controller.productsSelling);
  router.get('/buying',ensureAuthenticated,permit('User'), settings_controller.productsBuying);
 
  router.get('/portfolio',ensureAuthenticated,permit('User'),settings_controller.productsPortfolio);
  router.get('/following',ensureAuthenticated,permit('User'), settings_controller.followingProducts);
  router.get('/settings/profile',ensureAuthenticated,permit('User'),settings_controller.editProfile);
  router.post('/settings/profile',ensureAuthenticated,permit('User'),settings_controller.saveProfile);
  router.get('/settings/resetpsword',ensureAuthenticated,permit('User'),settings_controller.requestResetPassword);
  router.get('/settings/payout-info',ensureAuthenticated,permit('User'),settings_controller.payoutInfo);
  router.post('/settings/payout-info',ensureAuthenticated,settings_controller.savePayoutInfo);
  router.get('/profile',ensureAuthenticated,permit('User'), auth_controller.profile);
  router.get('/setting',ensureAuthenticated,permit('User'), settings_controller.settings);
  router.get('/settings/buyer-info',ensureAuthenticated,permit('User'), settings_controller.buyerInfo);
  router.post('/settings/buyer-info',ensureAuthenticated,permit('User'), settings_controller.saveBuyerInfo);
  router.get('/settings/shipping-info',ensureAuthenticated,permit('User'), settings_controller.shippingInfo);
  router.post('/settings/shipping-info',ensureAuthenticated,permit('User'), settings_controller.saveShippingInfo);
  router.get('/settings/seller-info',ensureAuthenticated,permit('User'), settings_controller.sellerInfo);
  router.post('/settings/seller-info',ensureAuthenticated,permit('User'), settings_controller.saveSellerInfo);
  router.post('/settings/notification/:id',ensureAuthenticated,permit('User'), settings_controller.saveNoficationSetting);

module.exports = router;