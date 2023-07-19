import { $ } from './utils';
import trigger from './ui/trigger';
import ajaxForm from './ui/ajaxForm';
import effects from './plugins/effects';
import cookieRelated from './ui/cookie-related';
import addToHome from './ui/addToHome';
import offlineMsg from "./ui/offlineMsg";
import { shareInit, callNativeShare } from './plugins/share';

(function ($) {
    'use strict';
    const bhSite = {

        selector: {
            contactDataHolder: '.contacts-data',
            contactsForm: 'feedbackForm',
            headerOuter: '#js-header-outer',
            homeScreen: '.home-screen',
            homeScreenLogo: '.home-screen--logo',
            inputs: '.text-field',
            scrollToTriggers: '[data-scroll]',
            noPage: 'js-animated-image',
            sharePopup: 'js-share-popup',
            shareLinks: '.js-share-link',
            galleryOuter: '.js-gallery-outer',
            entryGalleryOuter: 'js-entry-main-image-outer',
            entryGalleryThumbs: 'js-entry-main-thumbs',
            pdpGalleryOuter: 'js-pdp-main-image',
            pdpGalleryThumbs: 'js-pdp-main-thumbs',
            productListFilterForm: 'js-plp-filters',
            galleryMarkup: '.pswp',
            filterForms: '.js-filter',
            subscribePdpForm: 'js-product-subscribe',
            bookingForm: 'js-booking-form'
        },

        objects: {
            contactDataHolder: {},
            contactsForm: {},
            headerOuter: {},
            homeScreen: {},
            homeScreenLogo: {},
            inputs: {},
            scrollToTriggers: {},
            noPage: {},
            shareLinks: {},
            galleryOuter: {},
            entryGalleryOuter: {},
            entryGalleryThumbs: {},
            pdpGalleryOuter: {},
            pdpGalleryThumbs: {},
            productListFilterForm: {},
            galleryMarkup: {},
            opCheckout: {},
            subscribePdpForm: {},
            bookingForm: {}
        },

        methods: {
            callNativeShare
        },

        // Utils
        getData: function (fieldName) {
            if ( this.data && this.data[fieldName] !== undefined ) {
                return this.data[fieldName]
            }
            return false;
        },

        getMethod: function (methodName) {
            if ( this.methods && typeof this.methods[methodName] === 'function') {
                return this.methods[methodName];
            }
            return false;
        },

        initObjects: function() {
            const obj = this.objects;
            const sel = this.selector;

            obj.contactDataHolder = document.querySelector(sel.contactDataHolder);
            obj.contactsForm = document.getElementById(sel.contactsForm);
            obj.headerOuter = document.querySelector(sel.headerOuter);
            obj.homeScreen = document.querySelector(sel.homeScreen);
            obj.homeScreenLogo = document.querySelector(sel.homeScreenLogo);
            obj.inputs = document.querySelectorAll(sel.inputs);
            obj.scrollToTriggers = document.querySelectorAll(sel.scrollToTriggers);
            obj.noPage = document.getElementById(sel.noPage);
            obj.sharePopup = document.getElementById(sel.sharePopup);
            obj.shareLinks = document.querySelectorAll(sel.shareLinks);
            obj.entryGalleryOuter = document.getElementById(sel.entryGalleryOuter);
            obj.entryGalleryThumbs = document.getElementById(sel.entryGalleryThumbs);
            obj.pdpGalleryOuter = document.getElementById(sel.pdpGalleryOuter);
            obj.pdpGalleryThumbs = document.getElementById(sel.pdpGalleryThumbs);
            obj.productListFilterForm = document.getElementById(sel.productListFilterForm);
            obj.galleryOuter = document.querySelector(sel.galleryOuter);
            obj.galleryMarkup = document.querySelector(sel.galleryMarkup);
            obj.filterForms = document.querySelectorAll(sel.filterForms);
            obj.opCheckout = document.getElementById(sel.opCheckout);
            obj.subscribePdpForm = document.getElementById(sel.subscribePdpForm);
            obj.bookingForm = document.getElementById(sel.bookingForm);
        },

        initEffects: function() {
            const obj = this.objects;

            if(obj.headerOuter || obj.homeScreen || obj.homeScreenLogo) {
                // scroll effects
                window.addEventListener('scroll', function () {
                    if( obj.headerOuter && !$(obj.headerOuter).hasClass('current') ) {
                        effects(obj.headerOuter).changeOnScroll(25);
                    }
                    if( obj.homeScreen ) {
                        effects(obj.homeScreen).parallaxScroll('background', 3);
                    }
                    if( obj.homeScreenLogo ) {
                        effects(obj.homeScreenLogo).parallaxScroll('offset', 1.5);
                    }
                });
            }

            if( obj.inputs ) {
                effects(obj.inputs).setFilledInputClass('filled');
            }

            if(obj.scrollToTriggers instanceof NodeList && obj.scrollToTriggers.length > 0) {
                effects(obj.scrollToTriggers).scrollTo('data-target');
            }

            if(obj.noPage instanceof Element) {
                effects(obj.noPage).parallaxFullscreen();
            }
        },

        initUiElements: function() {
            cookieRelated.init('.js-cookie-related');
            addToHome.init();
        },

        initTriggers: function() {
            trigger('.js-trigger', this).init();
        },

        initMinicartTriggers: function() {
            trigger('.header--minicart-trigger', this).init();
        },

        initForms: function() {
            if(this.objects.contactsForm instanceof Element) {
                ajaxForm(
                    this.objects.contactsForm,
                    this,
                    function () {
                        effects(this.objects.inputs).setFilledInputClass('filled');
                    }
                ).init();
            }
        },

        initShare: function () {
            if( this.objects.shareLinks instanceof Element
                || (this.objects.shareLinks instanceof NodeList && this.objects.shareLinks.length > 0)
            ) {
                shareInit(this.objects.shareLinks);
            }
        },

        initServiceWorker: function () {
            // if ('serviceWorker' in navigator) {
            //     window.addEventListener('load', function () {
            //         navigator.serviceWorker
            //             .register('/sw.js')
            //             .then( function (event) {
            //                 addToHome.init();
            //                 offlineMsg.init('.header--outer');
            //             });
            //     });
            // }
        },

        init404page: function() {
            const wrap = document.querySelector('.cont_principal');
            if(wrap) {
                window.onload = function(){
                    wrap.className= "cont_principal cont_error_active";
                }
            }
        },

        initEntry: function() {
            // Init Blog entry page
            if( this.objects.entryGalleryOuter instanceof Element && this.objects.entryGalleryThumbs  instanceof Element ) {
                import(
                    /* webpackChunkName: "pdpgal" */
                    './plugins/pdpGallery.js'
                    ).then((pdpGalleryModule) => {
                    const pdpGallery = pdpGalleryModule.default;
                    pdpGallery(this.objects.entryGalleryOuter, this.objects.entryGalleryThumbs);
                })
                    .catch(e => {
                        console.warn('Can\'t load Entry Gallery module. Please contact your administrator', e);
                    });
            }
        },

        initPdp: function() {
            // Init PDP Gallery
            if( this.objects.pdpGalleryOuter instanceof Element && this.objects.pdpGalleryThumbs  instanceof Element ) {
                import(
                    /* webpackChunkName: "pdpgal" */
                    './plugins/pdpGallery.js'
                    ).then((pdpGalleryModule) => {
                    const pdpGallery = pdpGalleryModule.default;
                    pdpGallery(this.objects.pdpGalleryOuter, this.objects.pdpGalleryThumbs);
                })
                    .catch(e => {
                        console.warn('Can\'t load PdpGallery module. Please contact your administrator', e);
                    });
            }

            if( this.objects.subscribePdpForm instanceof Element ) {
                import(
                    /* webpackChunkName: "pdpsub" */
                    './extra/subscribe.js'
                    ).then((subscribeModule) => {
                    const subscribe = subscribeModule.default;
                    subscribe( this.objects.subscribePdpForm );
                })
                    .catch(e => {
                        console.warn('Can\'t load Subscribe module. Please contact your administrator', e);
                    });
            }
        },

        initBooking: function () {
            if( this.objects.bookingForm instanceof Element ) {
                import(
                    /* webpackChunkName: "booking" */
                    './extra/booking.js'
                    ).then((bookingModule) => {
                    const booking = bookingModule.default;
                    booking( this.objects.bookingForm );
                })
                    .catch(e => {
                        console.warn('Can\'t load Subscribe module. Please contact your administrator', e);
                    });
            }
        },

        initProductList: function () {
            // Init filters
            if( this.objects.productListFilterForm instanceof Element ) {
                import(
                    /* webpackChunkName: "flt" */
                    './plugins/filters.js'
                    ).then((productListFilters) => {
                    const plFilters = productListFilters.default;
                    plFilters(this.objects.productListFilterForm, {});
                })
                    .catch(e => {
                        console.warn('Can\'t load Product List Filters module. Please contact your administrator', e);
                    });
            }
        },

        initGallery: function() {
            if( this.galleryItems !== undefined
                && this.objects.galleryMarkup instanceof Element
                && this.objects.galleryOuter instanceof Element
            ) {
                let galleryItems = this.galleryItems;

                const masonryOuter = this.objects.galleryOuter;
                const photoSwipeMarkup = this.objects.galleryMarkup;

                Promise.all([
                    import(
                        /* webpackChunkName: "ps" */
                        './3rdParty/photoswipe.js'
                        ),
                    import(
                        /* webpackChunkName: "psui" */
                        './3rdParty/photoswipeUi.js'
                        )
                ])
                    .then(([psModule, uiModule]) => {
                        const photoSwipe = psModule.default;
                        const photoSwipeUI = uiModule.default;

                        $(masonryOuter).on('click', function (e) {
                            const idx = e.target.getAttribute('data-image-index') - 1;
                            const options = { index:  idx || 0 };
                            const gallery = new photoSwipe( photoSwipeMarkup, photoSwipeUI, galleryItems, options );

                            gallery.init();
                        });
                    })
                    .catch(e => {
                        console.warn('Can\'t load PhotoSwipe module. Please contact your administrator', e);
                    });
            }
        },

        initCommerce: function() {
            import(
                /* webpackChunkName: "com" */
                './extra/commerceExtend.js'
                ).then((commerceExtendModule) => {
                const commerceExtend = commerceExtendModule.default;
                commerceExtend();
            })
                .catch(e => {
                    console.warn('Can\'t load Commerce module. Something goes wrong', e);
                });
        },

        init: function() {
            this.initServiceWorker();

            this.initObjects();

            this.initEffects();

            this.initTriggers();

            this.initForms();

            this.initUiElements();

            this.init404page();

            this.initShare();

            this.initCommerce();

            this.initGallery();

            this.initEntry();

            this.initPdp();

            this.initProductList();

            this.initBooking();

            this.$ = $;
        }
    };

    if (window.bhSite === undefined) {
        window.bhSite = {};
    }

    Object.assign(window.bhSite, bhSite);

    $(document).domReady(window.bhSite.init());
}($));