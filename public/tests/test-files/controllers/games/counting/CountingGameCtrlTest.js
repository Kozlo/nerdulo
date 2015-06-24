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

        // TODO: try to understand what this is
        /**
         * From: https://docs.angularjs.org/api/ngMock
         * The ngMock module provides support to inject and mock Angular services into unit tests.
         * In addition, ngMock also extends various core ng services such that they can be inspected and controlled in a synchronous manner within test code.
         */
        // TODO: fix this as for some reason this messes up the injector
        //var appMocks = angular.module("appMocks", []);
        //
        //appMocks.config(function ($provide) {
        //    $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
        //});


        // TODO: replace with my files. Also, maybe just test answer service here and not the controller
        // I think it is the app itself (i.e. nerdulo)
        injector = angular.injector(['ng', 'CountingGameCtrl', 'AnswerService', 'AllStarService']);

        // TODO: I probaly don't need this as I use 'this.vm = this;'
        //this.$scope = injector.get('$rootScope').$new();

        this.ansSrv = injector.get('Answers');
        this.allstars = injector.get('AllStars');
        // TODO: figure out how to include the actualy $location service
        this.mockLocation = { location: { href: ""} };


        // TODO: possibly I don't need this in thie controller, but probably I need it for allstar controller where it's connected with backend
        //httpBackend = injector.get('$httpBackend');
        //httpBackend.expectGET('/api/shoppingCart/').respond(storedItems);

        // TODO: most likely I can check if the correct route is used (perhaps change code so that when a game starts some hash value is used
        //Mock for $window service
        //windowMock = { location: { href: ""} };

        var $controller = injector.get('$controller');
        // the controller object is initialised to 'this'
        this.oCtrl = $controller('CountingGameController',{
            $location: this.mockLocation,
            Answers: this.ansSrv,
            AllStars: this.allstars
        });
        // TODO: add tests for the controller here

        // TODO: not sure if I need this
        //Mock for shared service
        //sharedMock = injector.get('shared');
        //sinon.spy(sharedMock, 'setCartItems');

        // TODO: figure out how to replace with 'this.vm = this;'
        //Creating a new scope
        //ctrlScope = injector.get('$rootScope').$new();

        // TODO: porbably don't need this
        //Assigning shoppingData service to _shoppingData
        //_shoppingData = injector.get('shoppingData');

        // TODO: I probably need spies for other methods (but maybe not as I don't interacti with back-end in this controller
        //Creating spies for functions of shoppingData service
        //sinon.stub(_shoppingData, "getAllItems", _shoppingData.getAllItems);
        //sinon.stub(_shoppingData, "addAnItem", _shoppingData.addAnItem);
        //sinon.stub(_shoppingData, "removeItem", _shoppingData.removeItem);

        // TODO: if I need this at all I probably need some predefined questions and answers
        //Storing shoppingCartStaticData to an object
        //storedItems = shoppingCartStaticData;

        // TODO: replace with my controller
        //Creating controller with assigning mocks instead of actual services
        //ctrl = injector.get('$controller')(ShoppingCartCtrl, { $scope: ctrlScope, $window: windowMock, shoppingData: _shoppingData, shared: sharedMock });
    },
    teardown: function () {
        //sharedMock.setCartItems.restore();
        //
        //_shoppingData.getAllItems.restore();
        //_shoppingData.addAnItem.restore();
        //_shoppingData.removeItem.restore();
    }
});

test("Test to see if the controller exists and the correct route is used", function() {
    // TODO: add code here
    ok(this.oCtrl, 'The controller exists');
    // TODO: check what instanceof should be used
    //ok(this.oCtrl instanceof, "The controller is an instance of...");
});

test("Does startGame instantiates questions and creates the correct properties", function() {
    var spy_generateQuestions = sinon.spy(this.ansSrv, "generateQuestions");

    this.oCtrl.startGame();

    ok(spy_generateQuestions.called, "Answer service method generateQuestions called")
});
