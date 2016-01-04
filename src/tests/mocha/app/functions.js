var expect    = require("chai").expect,
    sinon = require("sinon"),
    functions = require("../../../../app/functions");

describe("Functions are exported properly", function() {
    it("isNotProd function exists", function() {
        expect(functions.isNotProd).is.a("function");
    });

    it("isNotProd calls next if environment is not production", function() {
        // set the environment
        process.env.NODE_ENV = "DEVELOPMENT";
        var res = {
            redirect: function() {}
        };

        var spy_next = sinon.spy(),
            spy_redirect = sinon.spy(res, "redirect");

        // call the method
        functions.isNotProd(null,res , spy_next);

        expect(spy_next.called).to.be.ok;
        expect(spy_redirect.notCalled).to.be.ok;
    });

    it("isNotProd does not call next, but calls redirect if environment is production", function() {
        // set the environment
        process.env.NODE_ENV = "PRODUCTION";
        var res = {
            redirect: function() {}
        };

        var spy_next = sinon.spy(),
            spy_redirect = sinon.spy(res, "redirect");

        // call the method
        functions.isNotProd(null,res , spy_next);

        expect(spy_next.notCalled).to.be.ok;

        expect(spy_redirect.called).to.be.ok;
        expect(spy_redirect.calledWith("/")).to.be.ok;
    });
});