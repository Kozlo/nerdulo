angular.module('AnswerService', [])

    .service('Answers', function() {
        function Question(qNo, optCount, minDev, maxDev, minNum, maxNum) {
            this.qNo = qNo;
            this.config = {
                optCount : optCount,
                deviance : {
                    min : minDev,
                    max : maxDev
                }
            };
            this.numbers = {
                one : this.getRandomInt(minNum,maxNum),
                two : this.getRandomInt(minNum,maxNum)
            };
            this.answer = this.calculator();
            this.options = this.optionGenerator();
            this.playerAnswer = null;
            this.isCurrentQuestion = false;
            this.playerPrompt = "Your answer is: ";
        }

        Question.prototype = {
            /**
             * Returns a random integer between min (inclusive) and max (inclusive)
             * Using Math.round() will give you a non-uniform distribution!
             */
            getRandomInt : function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            /**
             * Return the correct answer to the math problem
             */
            calculator : function() {
                return this.numbers.one * this.numbers.two;
            },
            /**
             * Returns the specified amount of incorrect answers to the math problem.
             * Makes sure that the specified answer isn't equal to the answer
             */
            optionGenerator : function() {
                // an array to hold all answers
                var opts = [];
                do {
                    // generate a random number that is different from the correct answer by max % specified by the maxDev variable
                    var randDev = this.getRandomInt(this.config.deviance.min, this.config.deviance.max);
                    if (randDev === 0) {
                        continue;
                    }
                    var randOpt = Math.floor(this.answer * (1 + randDev/100));
                    // check if the option already is in the list
                    if (opts.indexOf(randOpt) < 0) {
                        //push the non-zero option to the list of available options
                        opts.push(randOpt);
                    }
                } while (opts.length < this.config.optCount);
                // return the options, but add the correct answer to the list first
                return this.addAnswer(opts);
            },
            /**
             * Add the correct answer at a random position in the list of options
             */
            addAnswer : function(opts) {
                //generate a random int (0 till options count) that will be the position of the correct answer in the options
                var randPos = this.getRandomInt(0, this.config.optCount - 1);
                // if the new position is at the end of the array, just add it, otherwise replace it with an incorrect answer
                if (randPos === (this.config.optCount - 1)) {
                    opts.push(this.answer);
                } else {
                    var tempValue = opts[randPos];
                    opts[randPos] = this.answer;
                    opts.push(tempValue);
                }
                return opts;
            },
            /**
             * TODO: move to the vm or a separate service
             * Set the player's answer in the view
             * @param opt {String || Number}
             */
            setPlayerAnswer : function(opt) {
                this.playerAnswer = opt;
                this.playerPrompt = "Your answer is: " + this.playerAnswer;
            }
        };

        // variables for question
        var optCount = 5,
            minDev = -20,
            maxDev = 20,
            minNum = 11,
            maxNum = 29;

        this.generateQuestions = function() {
            var questions= [];
            for(var i=0 ; i<10; i++) {
                questions.push( new Question(i, optCount, minDev, maxDev, minNum, maxNum) );
            }
            return questions;
        };
    }
);