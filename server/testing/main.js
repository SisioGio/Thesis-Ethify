const http = require("http");
const request = require("supertest");
const app = require("../app");
const server = require("../server");
const db = require("../models");
var userObj;
var companyA;
var companyB;
var taxCode;
var customerGroupA
var customerGroupB
var taxValueA
var taxValueB
describe("Invoice processing workflow", () => {
  before(async () => {
    await db.sequelize
      .sync({ force: true })
      .then(() => {
        console.log("Test sync completed");
      })
      .catch((err) => {
        console.log("Sync failed - " + (err.message ? err.message : null));
      });
  });
  after(() => {
    if (server && server.listening) {
      server.close((err) => {
        if (err) {
          console.error("Error closing server:", err);
        } else {
          console.log("Server closed");
        }
      });
    }
  });
  it("Should not create a user", (done) => {
    var userData = {
      name: "alessio",
      surname: "giovannini",
      password: "test",
    };
    request(app)
      .post("/api/user")
      .send(userData)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });
  it("Should create a user", (done) => {
    var userData = {
      name: "alessio",
      surname: "giovannini",
      email: "alessiogiovannini23@gmail.com",
      password: "test",
    };
    request(app)
      .post("/api/user")
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        userObj = res.body;
        userObj.password = userData.password;
        done();
      });
  });
  it("Should accept user login", (done) => {
    request(app)
      .post("/api/user/login")
      .send(userObj)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        userObj.accessToken = res.body.accessToken;
        userObj.refreshToken = res.body.refreshToken;

        done();
      });
  });

  it("Should allow the user to create a company A", (done) => {
    var companyAdata = {
      name: "Company A",
      vatNo: "IT12345678",
      email: "companyA@mail.com",
      walletAddress: "SSSDFGSDGDFSGDFSVXCVFFU457348095738953",
      country: "Italy",
      region: "Lazio",
      city: "Roma",
      street: "Via S. Pietro",
      streetNo: "23",
      postcode: "42-100",
      userId: userObj.id,
    };
    request(app)
      .post("/api/company")
      .send(companyAdata)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        companyA = res.body;
        done();
      });
  });
  it("Should allow the user to create a company B", (done) => {
    var companyAdata = {
      name: "Company B",
      vatNo: "ITR432453453",
      email: "companyB@mail.com",
      walletAddress: "SSSDFGSDGDFSGDFSVXCVFFU457348095738953",
      country: "Italy",
      region: "Toscana",
      city: "Orbetello",
      street: "Via S. Giulio",
      streetNo: "43",
      postcode: "13-432",
      userId: userObj.id,
    };
    request(app)
      .post("/api/company")
      .send(companyAdata)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        companyB = res.body;
        done();
      });
  });

  it("Should create a new vendor/customer association", (done) => {
    var vendorCustomerData = {
      referenceVendorCompanyId: companyB.id,
      customerId: companyA.id,
      type: "EOM",
      days: "30",
    };

    request(app)
      .post("/api/vendor")
      .send(vendorCustomerData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
  it("Should create a new tax code", (done) => {
    var taxCodeData = {
      code: "1D",
      name:"Sales of goods",
      companyId: companyB.id
    }

    request(app)
      .post("/api/taxCode")
      .send(taxCodeData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        taxCode = res.body
     
        done();
      });
  });

  it("Should create a new customer group LOCAL", (done) => {
    var customerGroup = {
      code: "LOCAL",
      name:"LOCAL",
      companyId: companyB.id
    }

    request(app)
      .post("/api/customerGroup")
      .send(customerGroup)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        customerGroupA = res.body
        done();
      });
  });

  it("Should create a new customer group UE", (done) => {
    var customerGroup = {
      code: "EU",
      name:"EU",
      companyId: companyB.id
    }

    request(app)
      .post("/api/customerGroup")
      .send(customerGroup)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        customerGroupB = res.body
        done();
      });
  });


  it("Should update the tax value 1D - LOCAL", (done) => {
    var taxValueData = {
      taxCodeId: taxCode.id,
      customerGroupId:customerGroupA.id,
      companyId: companyB.id,
      name: taxCode.code + "("+ customerGroupA.code +")",
      percentage: 23.00
    }

    request(app)
      .put("/api/taxValues")
      .send(taxValueData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      
        done();
      });
  });
  it("Should update the tax value 1D - EU", (done) => {
    var taxValueData = {
      taxCodeId: taxCode.id,
      customerGroupId:customerGroupB.id,
      companyId: companyB.id,
      name: taxCode.code + "("+ customerGroupB.code +")",
      percentage: 0.0

    }

    request(app)
      .put("/api/taxValues")
      .send(taxValueData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      
        done();
      });
  });
  it("Should update existing customer with newly created customer group A", (done) => {
    var customerData = {
      id: 1,
      customerGroupId:customerGroupA.id,
    }
    request(app)
      .put("/api/customer")
      .send(customerData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

var productData;
  it("Should allow the vendor to create a new product", (done) => {
    productData = {
      name: "Product 1",
        description: "Product description",
        price: 100.0,
        cost: 40.0,
        quantity: 100,
        type: "Product",
        unitOfMeasure: "KG",
        companyId: companyB.id,
        taxCodeId: taxCode.id,
    }
    request(app)
      .post("/api/product")
      .send(productData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });


  it("Should allow the customer to accounting dimensions", (done) => {
    var accountData = {
      code: "10002000",
      name: "Purchase of goods",
      isNode: false,
      type: "Asset",
      balance: 0.0,
      companyId: companyA.id,
    }
    Promise.all([
      request(app)
      .post("/api/account")
      .send({
        code: "10002000",
        name: "Purchase of goods",
        isNode: false,
        type: "Asset",
        balance: 0.0,
        companyId: companyA.id,
      })
      .expect(200),
      request(app)
      .post("/api/account")
      .send({
        code: "10003000",
        name: "Purchase of services",
        isNode: false,
        type: "Asset",
        balance: 0.0,
        companyId: companyA.id,
      })
      .expect(200),
      request(app)
      .post("/api/costCenter")
      .send({
        code: "100190",
        name: "Tools",
        companyId: companyA.id,
      })
      .expect(200),
      request(app)
      .post("/api/costCenter")
      .send({
        code: "100200",
        name: "Components",
        companyId: companyA.id,
      })
      .expect(200),
      request(app)
      .post("/api/businessLine")
      .send({
        code: "BL18",
        name: "BL18",
        companyId: companyA.id,
      })
      .expect(200),
      request(app)
      .post("/api/businessLine")
      .send({
        code: "BL20",
        name: "BL20",
        companyId: companyA.id,
      })
      .expect(200)

      ,
      request(app)
      .post("/api/factory")
      .send({
        code: "LMN",
        name: "Limena",
        companyId: companyA.id,
      })
      .expect(200)

      ,
      request(app)
      .post("/api/factory")
      .send({
        code: "BGT",
        name: "Brugherio",
        companyId: companyA.id,
      })
      .expect(200)

    ]).then(()=>{
      request(app)
      .get("/api/account")
      
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
       
        done();
      });
    })




    
  });

  it("Should allow the customer to create a new tax code", (done) => {
    var taxCodeData = {
      code: "1D",
      name:"Sales of goods",
      companyId: companyA.id
    }

    request(app)
      .post("/api/taxCode")
      .send(taxCodeData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        taxCode = res.body
     
        done();
      });
  });

  it("Should allow the customer to create a new customer group LOCAL", (done) => {
    var customerGroup = {
      code: "LOCAL",
      name:"LOCAL",
      companyId: companyA.id
    }

    request(app)
      .post("/api/customerGroup")
      .send(customerGroup)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        customerGroupA = res.body
        done();
      });
  });

  it("Should allow the customer create a new customer group UE", (done) => {
    var customerGroup = {
      code: "EU",
      name:"EU",
      companyId: companyA.id
    }

    request(app)
      .post("/api/customerGroup")
      .send(customerGroup)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        customerGroupB = res.body
        done();
      });
  });


  it("Should allow the customer to update the tax value 1D - LOCAL", (done) => {
    var taxValueData = {
      taxCodeId: taxCode.id,
      customerGroupId:customerGroupA.id,
      companyId: companyA.id,
      name: taxCode.code + "("+ customerGroupA.code +")",
      percentage: 23.00
    }

    request(app)
      .put("/api/taxValues")
      .send(taxValueData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      
        done();
      });
  });
  it("Should allow the customer to update the tax value 1D - EU", (done) => {
    var taxValueData = {
      taxCodeId: taxCode.id,
      customerGroupId:customerGroupB.id,
      companyId: companyA.id,
      name: taxCode.code + "("+ customerGroupB.code +")",
      percentage: 0.0

    }

    request(app)
      .put("/api/taxValues")
      .send(taxValueData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      
        done();
      });
  });

  it("Should allow the customer to place an order", (done) => {
    var orderData = {
      customerId: companyA.id,
      items:[
        {
          product:{
            id:1,
            company:{
              id: companyB.id,
              
            },
            price:100.00,
            
          },
          quantity:10,
        }
      ]

    }

    request(app)
      .post("/api/order")
      .send(orderData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      
        done();
      });
  });

  var orders = []

  it("Created order should have status New", (done) => {
    

    request(app)
      .get("/api/order/sale/2")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);

        }
        if(res.body[0].status === "New"){
          orders.push(res.body[0])
          done()
        } else {
          done(new Error("Status is not 'New'"))
        }
       
      });
  });
 var invoiceObj;
 it("Should allow vendor to bill open orders", (done) => {
    
 
    request(app)
      .post("/api/invoice")
      .send({orders})
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
          
        }
       
      
        done()
       
      });
  });

  it("Should return list of sales invoices", (done) => {
    
 
    request(app)
      .get("/api/invoice/sales/2")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
          
        }
  
        invoiceObj = res.body[0]
        done()
       
      });
  });


  it("Should return Squinvoice invoice data without historical data", (done) => {
    
 
    request(app)
      .get(`/api/invoice/squinvoice?invoiceUrl=${invoiceObj.squinvoiceUrl}&invoiceId=1`)
      
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
          
        }
     
        done()
       
      });
  });

  it("Should allow customer to book the invoice data with one line split of 70/30", (done) => {
    var bookingData = {
      companyId: 1,
      invoiceId: 1,
      products:[
        {
          productId:1,
          lines:[
            {
              name: productData.description,
              unitPrice:productData.price ,
              quantity: 10,
              unitOfMeasure:"KG" ,
              taxAmount: 0,
              totalAmount: 300.00,
              netAmount: 300.00,
              description: productData.description,
              totalLineNetAmount: 1000.00,
              totalLineTaxAmount: 0.0,
              totalLineAmount: 1000.00,
              accountId: 1,
              companyId: companyA.id,
              businessLineId: 1,
              factoryId: 1,
              costCenterId: 1,
              taxValueId: 1
            },
            {
              name: productData.description,
              unitPrice:productData.price ,
              quantity: 10,
              unitOfMeasure:"KG" ,
              taxAmount: 0,
              totalAmount: 700.00,
              netAmount: 700.00,
              description: productData.description,
              totalLineNetAmount: 1000.00,
              totalLineTaxAmount: 0.0,
              totalLineAmount: 1000.00,
              accountId: 2,
              companyId: companyA.id,
              businessLineId: 2,
              factoryId: 1,
              costCenterId: 2,
              taxValueId: 1
            }

          ]
        }
        
        
      ]
    }
 
    request(app)
      .post(`/api/transactionS`)
      .send(bookingData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
          
        }
     
        done()
       
      });
  });


  it("Should allow the customer to place the second order", (done) => {
    var orderData = {
      customerId: companyA.id,
      items:[
        {
          product:{
            id:1,
            company:{
              id: companyB.id,
              
            },
            price:100.00,
            
          },
          quantity:30,
        }
      ]

    }

    request(app)
      .post("/api/order")
      .send(orderData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      
        done();
      });
  });

  


  it("Created order should have status New", (done) => {
    

    request(app)
      .get("/api/order/sale/2")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);

        }
        if(res.body[1].status === "New"){
          orders  = []
          orders.push(res.body[1])
          done()
        } else {
          done(new Error("Status is not 'New'"))
        }
       
      });
  });
 var invoiceObj;
 it("Should allow vendor to bill open orders", (done) => {
    
 
    request(app)
      .post("/api/invoice")
      .send({orders})
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
          
        }
       
      
        done()
       
      });
  });


  it("Should return list of sales invoices", (done) => {
    
 
    request(app)
      .get("/api/invoice/sales/2")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
          
        }
  
        invoiceObj = res.body[1]
        done()
       
      });
  });
  it("Should return Squinvoice invoice data without historical data", (done) => {
    
    
    request(app)
      .get(`/api/invoice/squinvoice?invoiceUrl=${invoiceObj.squinvoiceUrl}&invoiceId=2`)
      
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
       
        if(res.body.invoiceLines[0].suggestedTransactions[0].netAmount === 900){
          done()
        } else {
          done( new Error("Amount was not correctly calculated!"))
        }
       
       
      });
  });
});
