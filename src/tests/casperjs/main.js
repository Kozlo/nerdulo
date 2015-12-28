// test if the project runs in the browser
casper.test.begin('Google search retrieves 10 or more results', 1, function suite(test) {
    casper.start("http://localhost:8080/", function() {
        test.assertTitle("Nerdulo", "Nerdulo homepage title is the one expected");
    });

    casper.run(function() {
        test.done();
    });
});