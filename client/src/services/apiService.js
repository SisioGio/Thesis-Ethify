import api from "./api";
import apiFiles from "./apiService";
class ApiService {
  // User
  signin(form) {
    return api.post("/api/user/login", form).then((response) => {
      if (response.data.accessToken) {
        this.setUser(response.data);
      }
      return response;
    });
  }

  isAuthenticated = async () => {
    var output = false;
    console.log("Sending authentication request");
    return api.get("/api/user/is_authenticated");
  };
  signup(form) {
    return api.post("/api/user", form);
  }

  // Vendor

  getVendors(customerId) {
    return api.get(`/api/vendor/${customerId}`);
  }

  addVendor(form) {
    return api.post("/api/vendor", form);
  }

  // Customer

  getCustomers(vendorId) {
    return api.get(`/api/customer/${vendorId}`);
  }

  addCustomer(form) {
    return api.post("/api/customer", form);
  }

  // Product

  addProduct(form) {
    return api.post("/api/product", form);
  }
  updateProduct(form) {
    return api.put("/api/product", form);
  }
  getProduct(companyId) {
    return api.get(`/api/company/products/${companyId}`);
  }
  // TaxCode

  getCompanyTaxCodes(companyId) {
    return api.get(`/api/taxcode/${companyId}`);
  }
  updateTaxCode(form) {
    return api.put(`/api/taxcode`, form);
  }
  addTaxCode(form) {
    return api.post(`/api/taxcode`, form);
  }
  // Order

  createOrder(form) {
    return api.post("/api/order", form);
  }

  getPurchaseOrders(companyId) {
    return api.get(`/api/order/purchase/${companyId}`);
  }

  getSalesOrders(companyId) {
    return api.get(`/api/order/sale/${companyId}`);
  }

  // Tax Codes

  getTaxCodes(companyId) {
    return api.get(`/api/taxcode/${companyId}`);
  }

  createTaxCode(form) {
    return api.post("/api/taxcode", form);
  }

  // Customer

  updateCustomer(form) {
    return api.put("/api/customer", form);
  }
  // Customer Groups

  getCustomerGroups(companyId) {
    return api.get(`/api/customerGroup/${companyId}`);
  }

  createCustomerGroup(form) {
    return api.post("/api/customerGroup", form);
  }

  // Tax Values

  getTaxValues(companyId) {
    return api.get(`/api/taxValues/${companyId}`);
  }

  updateTaxValue(form) {
    return api.put("/api/taxValues", form);
  }

  // Invoice

  createInvoice(form) {
    return api.post("/api/invoice", form);
  }
  getSalesInvoices() {
    return api.get(`/api/invoice/sales/${this.getCompany().id}`);
  }

  getPurchaseInvoices() {
    return api.get(`/api/invoice/purchase/${this.getCompany().id}`);
  }

  getPurchaseInvoiceDetails(invoiceId) {
    return api.get(`/api/invoice/purchase/details/${invoiceId}`);
  }
  getSquinvoiceData(squinvoiceInvoiceUrl, invoiceId) {
    return api.get(`/api/invoice/squinvoice/`, {
      params: {
        invoiceUrl: squinvoiceInvoiceUrl,
        invoiceId: invoiceId,
      },
    });
  }
  getPurchaseInvoicesIds() {
    let customerId = this.getCompany().id;
    return api.get(`/api/invoice/purchase/ids/${customerId}`);
  }
  getSuggestedTransactions(customerId, invoiceId, productId) {
    return api.get(
      `/api/invoice/suggestion/${customerId}/${invoiceId}/${productId}`
    );
  }
  parkInvoice(form) {
    return api.post("/api/transactions", form);
  }

  updateInvoice() {
    return api.put("/api/invoice");
  }
  // Business Line
  createBusinessLine(form) {
    return api.post("/api/businessline", form);
  }
  getBusinessLines(companyId) {
    return api.get(`/api/businessline/${companyId}`);
  }
  // Account
  createAccount(form) {
    return api.post("/api/account", form);
  }
  getAccounts(companyId) {
    return api.get(`/api/account/${companyId}`);
  }
  // Cost Centers
  createCostCenter(form) {
    return api.post("/api/costcenter", form);
  }
  getCostCenters(companyId) {
    return api.get(`/api/costcenter/${companyId}`);
  }
  // Factory
  createFactory(form) {
    return api.post("/api/factory", form);
  }
  getFactories(companyId) {
    return api.get(`/api/factory/${companyId}`);
  }
  // Company

  getCompanyKPI(companyId) {
    return api.get(`/api/company/kpi/${companyId}`);
  }

  createCompany(form) {
    return api.post("/api/company", form);
  }
  updateCompany(form) {
    return api.put("/api/company", form);
  }

  getCompanies(userId) {
    return api.get(`/api/company/${userId}`);
  }
  // Payments
  savePaymentDetails(data) {
    return api.post("/api/payment", data);
  }
  /// Local Storage - Invoices Lines

  getInvoicesProducts() {
    var invoices = JSON.parse(localStorage.getItem("invoices"));
    if (!invoices) {
      localStorage.setItem("invoices", JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem("invoices"));
  }

  getInvoiceLines(invoiceId) {
    var allLines = this.getInvoicesProducts();

    return allLines.filter((line) => line.invoiceId == invoiceId);
  }
  findInvoiceProductIndex(invoiceId, productId) {
    if (this.getInvoicesProducts().length === 0) {
      return -1;
    }
    return this.getInvoicesProducts().findIndex(
      (product) =>
        (product.invoiceId === invoiceId) & (product.productId === productId)
    );
  }
  getInvoiceProductLines(invoice, product, lineId) {
    var invoices = this.getInvoicesProducts();
    var productIndex = this.findInvoiceProductIndex(
      invoice.id,
      product.articleCode
    );
    if (productIndex === -1 || invoices[productIndex].lines.length === 0) {
      invoices.push({
        invoiceId: invoice.id,
        productId: product.articleCode,
        lines: [
          {
            id: 1,
            accountId: "",
            costCenterId: "",
            factoryId: "",
            description: "",
            taxValueId: "",
            netAmount: 0,
            taxAmount: 0,
            totalAmount: 0,
            businessLineId: "",
            invoiceLineId: lineId,
            name: product.description,
            unitPrice: product.unitPrice,
            quantity: product.quantity,
            unitOfMeasure: product.unitOfMeasure,
            warehouse: {
              externalId: product.articleCode,
            },
            totalLineNetAmount: product.netAmount,
            totalLineTaxAmount: product.taxAmount,
            totalLineAmount: product.totalAmount,
          },
        ],
      });
      localStorage.setItem("invoices", JSON.stringify(invoices));
      this.getInvoiceProductLines(invoice, product);
    }

    var outputLines = invoices.filter(
      (invoiceLine) =>
        (invoiceLine.invoiceId === invoice.id) &
        (invoiceLine.productId === product.articleCode)
    );
    return outputLines[0];
  }

  addInvoiceLine(invoice, product, line) {
    var invoiceItem = this.getInvoiceProductLines(invoice, product);
    line.id = invoiceItem.lines.length + 1;
    invoiceItem.lines.push(line);
    var invoices = this.getInvoicesProducts();
    var itemIndex = this.findInvoiceProductIndex(
      invoice.id,
      product.articleCode
    );

    if (itemIndex > -1) {
      invoices[itemIndex] = invoiceItem;
      localStorage.setItem("invoices", JSON.stringify(invoices));
    }
  }

  removeInvoiceProductLines(invoiceToRemove, articleCode) {
    var invoices = this.getInvoicesProducts();
    invoices = invoices.filter(
      (invoice) =>
        invoice.invoiceId != invoiceToRemove.id &&
        invoice.productId != articleCode
    );
    localStorage.setItem("invoices", JSON.stringify(invoices));
    // var productIndex = this.findInvoiceProductIndex(invoice.id, productId);
    // if (productIndex > -1) {
    //   invoices[productIndex].lines = [];
    //   localStorage.setItem("invoices", JSON.stringify(invoices));
    // }
  }
  addProposedLine(invoice, productId, line) {
    var invoices = this.getInvoicesProducts();
    var productIndex = this.findInvoiceProductIndex(invoice.id, productId);
    if (productIndex === -1) {
      // Add new product lines
      line.id = 1;
      invoices.push({
        invoiceId: invoice.id,
        productId: productId,
        lines: [line],
      });
    } else {
      // Check if product line exists by using the internal db id 'dbId'
      let invoiceProductLineIndex = invoices[productIndex].lines.findIndex(
        (extiningLine) => extiningLine.dbId == line.dbId
      );
      if (invoiceProductLineIndex === -1) {
        // Add new product line
        line.id = invoices[productIndex].lines.length;
        invoices[productIndex].lines.push(line);
      }
    }

    localStorage.setItem("invoices", JSON.stringify(invoices));
  }

  updateInvoiceProductLine(invoice, product, line) {
    var invoiceItem = this.getInvoiceProductLines(invoice, product);
    var invoices = this.getInvoicesProducts();
    var itemIndex = this.findInvoiceProductIndex(
      invoice.id,
      product.articleCode
    );
    if (itemIndex > -1) {
      var invoiceProductLineIndex = invoiceItem.lines.findIndex(
        (lineItem) => lineItem.id === line.id
      );

      invoiceItem.lines[invoiceProductLineIndex] = line;
      invoices[itemIndex] = invoiceItem;
      localStorage.setItem("invoices", JSON.stringify(invoices));
    }
  }

  removeInvoiceProductLine(invoiceId, productId, lineId) {
    var invoices = this.getInvoicesProducts();
    var invIndex = this.findInvoiceProductIndex(invoiceId, productId);
    var invLines = invoices[invIndex].lines;
    var lineIndex = invLines.findIndex((line) => line.id == lineId);

    var filteredLines = invLines.filter((line) => line.id != lineId);

    invoices[invIndex].lines = filteredLines;
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }
  /// Local Storage - User
  logout() {
    localStorage.removeItem("user");
  }

  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  setCompany(companyId) {
    let companies = this.getUser().companies;
    console.log(companies);
    var company = companies.find((companyObj) => {
      return companyObj.id == companyId;
    });

    localStorage.setItem("company", JSON.stringify(company));
  }
  getCompany() {
    return JSON.parse(localStorage.getItem("company"));
  }
  addCompanyToLocalStorage(company) {
    let user = this.getUser();
    user.companies.push(company);
    this.setUser(user);
  }
  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user["refreshToken"] : null;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("user"));

    return user ? user["accessToken"] : null;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.accessToken = token;
    localStorage.setItem("user", JSON.stringify(user));
  }

  getCartItems() {
    const cart = localStorage.getItem("cart");

    if (cart) {
      console.log(JSON.parse(cart));
      return JSON.parse(cart);
    } else {
      return {};
    }
  }

  deleteCart() {
    let carts = this.getCarts();

    carts = carts.filter((cart) => cart.company.id != this.getCompany().id);

    localStorage.setItem("carts", JSON.stringify(carts));
  }

  calculateCartTotalAmount(cartItems) {
    let numberOfItems = 0;
    let totalAmount = 0;

    for (let item of cartItems) {
      totalAmount =
        totalAmount +
        parseFloat(item.quantity) * parseFloat(item.product.price);
      numberOfItems = parseFloat(numberOfItems) + parseFloat(item.quantity);
    }

    return { totalAmount, numberOfItems };
  }

  updateCartItemQuantity(stockId, quantity) {
    const cart = localStorage.getItem("cart");
    let updatedCart = JSON.parse(cart).items;
    // Check if stock is found
    const itemIndex = updatedCart.findIndex((item) => item.stock === stockId);

    if (itemIndex > -1) {
      let cartItem = updatedCart[itemIndex];
      updatedCart[itemIndex].quantity = quantity;
    } else {
      console.log("Stock not found");
      return;
    }
    localStorage.setItem(
      "cart",
      JSON.stringify({
        items: updatedCart,
        numberOfItems: this.calculateCartTotalAmount(updatedCart).numberOfItems,
        totalAmount: this.calculateCartTotalAmount(updatedCart).totalAmount,
      })
    );
  }

  getCarts() {
    let cart = JSON.parse(localStorage.getItem("carts"));
    if (!cart) {
      localStorage.setItem("carts", JSON.stringify([]));
      cart = JSON.parse(localStorage.getItem("carts"));
    }

    return cart;
  }

  getCompanyCart() {
    let company = this.getCompany();
    let userCompanies = this.getUser().companies;
    if (!company) {
      if (userCompanies.length > 0) {
        company = userCompanies[0];
      }
    }
    var carts = this.getCarts();
    let cart;

    const cartIndex = carts.findIndex((item) => item.company.id == company.id);
    if (cartIndex === -1) {
      cart = {
        company: company,
        items: [],
        numberOfItems: 0,
        totalAmount: 0,
      };
      carts.push(cart);
      localStorage.setItem("carts", JSON.stringify(carts));
      this.getCompanyCart();
    } else {
      return carts[cartIndex];
    }
  }

  updateCart(cart) {
    let company = this.getCompany();
    var carts = this.getCarts();
    const cartIndex = carts.findIndex((item) => item.company.id == company.id);
    carts[cartIndex] = cart;
    localStorage.setItem("carts", JSON.stringify(carts));
  }
  addProductToCart(product, quantity) {
    let cart_item = {
      product: product,
      quantity: quantity,
    };
    // Get Cart
    let cart = this.getCompanyCart();
    // Check if item is already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.id === product.id
    );
    // Update cart quantity
    cart.totalAmount =
      parseFloat(cart.totalAmount) +
      parseFloat(quantity) * parseFloat(product.price);
    // Update total amount
    cart.numberOfItems = parseFloat(cart.numberOfItems) + parseFloat(quantity);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity =
        parseFloat(cart.items[itemIndex].quantity) + parseFloat(quantity);
    } else {
      cart.items.push(cart_item);
    }

    this.updateCart(cart);
  }

  removeProductFromCart(productId) {
    const cart = this.getCompanyCart();

    const cart_items_filtered = cart.items.filter(
      (item) => item.product.id != productId
    );

    cart.items = cart_items_filtered;
    cart.totalAmount =
      this.calculateCartTotalAmount(cart_items_filtered).totalAmount;
    cart.numberOfItems =
      this.calculateCartTotalAmount(cart_items_filtered).numberOfItems;

    this.updateCart(cart);
  }
}

export default new ApiService();
