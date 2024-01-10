const http = require("http");
const request = require("supertest");
const app = require("../app");
const server = require("../server");
const db = require("../models");
var userObj;
var companyA;
var companyB;
describe("Document", () => {
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
  //   it("Should create a new document and return the Squinvoice url", (done) => {
  //     request(app)
  //       .post("/api/invoice")
  //       .send(invoiceData)
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) return done(err);

  //         if (!res.body.InvoiceURL) return done(new Error("No URL was received"));
  //         invoiceUrl = res.body.InvoiceURL;
  //         done();
  //       });
  //   });
});
