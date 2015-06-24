// TODO: if smths unclear, check out a good example from: http://jsfiddle.net/boneskull/mGyHt/


// TODO: probably replace with expected questions (maybe make sure they are the same and try non-random number generation)
//var shoppingCartStaticData = [
//    { "ID": 1, "Name": "Item1", "Price": 100, "Quantity": 5 },
//    { "ID": 2, "Name": "Item2", "Price": 55, "Quantity": 10 },
//    { "ID": 3, "Name": "Item3", "Price": 60, "Quantity": 20 },
//    { "ID": 4, "Name": "Item4", "Price": 65, "Quantity": 8 }
//];
// TODO: probably don't need _shopping data and sharedMock
//Mocks
var windowMock, httpBackend, _shoppingData, sharedMock;

//Injector
var injector;

//Controller
var ctrl;

//Scope
var ctrlScope;

//Data
var storedItems;

module("Counting game test module", {
    setup: function () {
        injector = angular.injector(['ng', 'CountingGameCtrl', 'AnswerService', 'AllStarService']);

        this.ansSrv = injector.get('Answers');
        this.allstars = injector.get('AllStars');
        // TODO: figure out how to include the actually $location service
        this.mockLocation = { location: { href: ""} };


        var $controller = injector.get('$controller');
        this.oCtrl = $controller('CountingGameController',{
            $location: this.mockLocation,
            Answers: this.ansSrv,
            AllStars: this.allstars
        });
    },
    teardown: function () {

    }
});

test("Test to see if the controller exists and the correct route is used", function() {
    ok(this.oCtrl, 'The controller exists');
    // TODO: check what instanceof should be used
    //ok(this.oCtrl instanceof, "The controller is an instance of...");
});

test("Does startGame instantiates questions and creates the correct properties", function() {
    var spy_generateQuestions = sinon.spy(this.ansSrv, "generateQuestions");

    this.oCtrl.startGame();

    ok(spy_generateQuestions.called, "Answer service method generateQuestions called")
});
