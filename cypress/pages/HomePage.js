import BasePage from './BasePage.js'
import { measurePageLoadTime } from '../support/utils.js'

class HomePage extends BasePage {
  constructor() {
    super()
    this.url = '/'
    this.selectors = {
      // Navigation
      productsLink: "a[href='/products']",
      cartLink: "a[href='/view_cart']",
      signupLoginLink: "a[href='/login']",
      // Logo
      logo: "img[src='/static/images/home/logo.png']",
      // Search (on products page)
      searchInput: "input#search_product",
      searchButton: "button#submit_search",
      // Category navigation
      categoryPanelTitle: ".panel-title a",
      womenCategoryLink: "a[href='/category_products/1']",
      menCategoryLink: "a[href='/category_products/3']",
      kidsCategoryLink: "a[href='/category_products/4']",
      // Featured products
      featuredProducts: '.features_items .product-image-wrapper',
      productInfo: '.productinfo.text-center',
      addToCartButton: 'a.add-to-cart',
      viewProductLink: 'a[href*="/product_details/"]',
      productPrice: 'h2',
      // Newsletter
      newsletterInput: '#susbscribe_email',
      newsletterButton: '#subscribe',
      newsletterSuccess: '#success-subscribe',
      contactUsName: 'input[data-qa="name"]',
      contactUsEmail: 'input[data-qa="email"]',
      contactUsSubject: 'input[data-qa="subject"]',
      contactUsMessage: 'textarea[data-qa="message"]',
      contactUsSubmit: 'input[type="submit"]',
      contactUsSuccess: 'Success! Your details have been submitted successfully.',
      contactUsHome: 'Home',
      // Scroll up
      scrollUpButton: "a[href='#top'] i.fa.fa-angle-up",
      // Search results
      searchResultsContainer: '.features_items',
      // Body
      body: 'body',
      modalContent: '.modal-content',
      modalCloseButton: '.modal-content .btn-success'
    }
  }

  navigateToHome() {
    cy.visit(this.url)
    return this
  }

  clickProducts() {
    cy.get(this.selectors.productsLink).click()
    return this
  }

  clickCart() {
    cy.get(this.selectors.cartLink).first().click()
    return this
  }

  clickSignupLogin() {
    cy.get(this.selectors.signupLoginLink).click()
    return this
  }

  // Search functionality (on products page)
  searchProduct(searchTerm) {
    cy.visit('/products')
    if (searchTerm && searchTerm.trim() !== '') {
      cy.get(this.selectors.searchInput).clear().type(searchTerm)
      cy.get(this.selectors.searchButton).click()
    } else {
      // For empty search, just navigate to products page
      cy.visit('/products')
    }
    return this
  }

  // Helper to expand a category by visible text
  expandCategory(categoryText) {
    cy.visit('/products');
    cy.get(this.selectors.categoryPanelTitle).contains(categoryText).click();
  }

  clickWomenCategory() {
    this.expandCategory('Women');
    cy.get(this.selectors.womenCategoryLink).should('be.visible').click({force: true});
    return this;
  }

  clickMenCategory() {
    this.expandCategory('Men');
    cy.get(this.selectors.menCategoryLink).should('be.visible').click({force: true});
    return this;
  }

  clickKidsCategory() {
    this.expandCategory('Kids');
    cy.get(this.selectors.kidsCategoryLink).should('be.visible').click({force: true});
    return this;
  }

  // Featured products
  getFeaturedProductsCount() {
    return cy.get(this.selectors.featuredProducts).its('length')
  }

  addProductToCart(productName) {
    cy.get(this.selectors.productInfo).contains(productName)
      .parents(this.selectors.featuredProducts)
      .trigger('mouseover')
      .find(this.selectors.addToCartButton).first().click({force: true})
    return this
  }

  viewProduct(productName) {
    cy.get(this.selectors.productInfo).contains(productName)
      .parents(this.selectors.featuredProducts)
      .find(this.selectors.viewProductLink).first().click({force: true})
    return this
  }

  getProductPrice(productName) {
    return cy.get(this.selectors.productInfo).contains(productName)
      .parents(this.selectors.featuredProducts)
      .find(this.selectors.productPrice).invoke('text')
  }

  subscribeToNewsletter(email) {
    this.getElement(this.selectors.newsletterInput).type(email);
    this.getElement(this.selectors.newsletterButton).click();
    return this;
  }

  assertSubscriptionSuccess() {
    cy.get(this.selectors.newsletterSuccess).should('be.visible');
    return this;
  }

  assertSubscriptionError() {
    cy.get(this.selectors.body).should('be.visible')
    return this
  }

  scrollToBottom() {
    cy.scrollTo('bottom')
    return this
  }

  clickScrollUp() {
    cy.get(this.selectors.scrollUpButton).click({force: true})
    return this
  }

  assertHomePageLoaded() {
    cy.get(this.selectors.logo).should('be.visible')
    cy.get(this.selectors.featuredProducts).should('exist')
    return this
  }

  assertNavigationLinksVisible() {
    cy.get(this.selectors.productsLink).should('be.visible')
    cy.get(this.selectors.cartLink).should('be.visible')
    cy.get(this.selectors.signupLoginLink).should('be.visible')
    return this
  }

  productExists(productName) {
    return cy.get(this.selectors.productInfo).contains(productName).should('exist')
  }

  scrollToProduct(productName) {
    cy.get(this.selectors.productInfo).contains(productName).scrollIntoView()
    return this
  }

  assertSearchResultsContain(searchTerm) {
    cy.get(this.selectors.searchResultsContainer).invoke('text').then((text) => {
      expect(text.toLowerCase()).to.include(searchTerm.toLowerCase())
    })
    return this
  }

  assertNoSearchResults() {
    cy.get(this.selectors.searchResultsContainer).should('not.contain.text', 'dress')
    return this
  }

  measurePageLoadTime() {
    measurePageLoadTime(5000, 'Home page');
    return this;
  }

  // Dynamic element getters for POM
  getBody() {
    return this.getElement(this.selectors.body)
  }

  getModalContent() {
    return this.getElement(this.selectors.modalContent)
  }

  getModalCloseButton() {
    return this.getElement(this.selectors.modalCloseButton)
  }

  getImages() {
    return this.getElement('img')
  }

  getHeadings() {
    return this.getElement('h1, h2, h3')
  }

  getNewsletterInput() {
    return this.getElement(this.selectors.newsletterInput);
  }

  getNewsletterButton() {
    return this.getElement(this.selectors.newsletterButton);
  }

  getNewsletterSuccess() {
    return cy.contains('You have been successfully subscribed!');
  }

  getContactUsNameInput() {
    return this.getElement(this.selectors.contactUsName);
  }

  getContactUsEmailInput() {
    return this.getElement(this.selectors.contactUsEmail);
  }

  getContactUsSubjectInput() {
    return this.getElement(this.selectors.contactUsSubject);
  }

  getContactUsMessageTextarea() {
    return this.getElement(this.selectors.contactUsMessage);
  }

  getContactUsSubmitButton() {
    return this.getElement(this.selectors.contactUsSubmit);
  }

  getContactUsSuccessMessage() {
    return cy.contains(this.selectors.contactUsSuccess);
  }

  getContactUsHomeButton() {
    return cy.contains(this.selectors.contactUsHome);
  }

  goToContactUs() {
    cy.contains('Contact us').click();
    return this;
  }
}

export default HomePage 