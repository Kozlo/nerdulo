angular.module('PatternService', [])

    .service('Patterns', function() {
        function Pattern(qNo, config) {
            this.qNo = qNo;
            this.config = {
                startNum: this.getRandomInt(config.startNum.min, config.startNum.max),
                multiple: this.getRandomInt(config.multiple.min, config.multiple.max),
                constant: this.getRandomInt(config.constant.min, config.constant.max),
                itemCount: config.itemCount,
                optCount : config.optCount,
                deviance : {
                    min: config.deviance.min,
                    max: config.deviance.max
                }
            };
            //this.numbers = {
            this.pattern = this.patternGenerator();
            // the answer is omitted and replaced with options
            this.answer = this.hideOption();
            this.options = this.optionGenerator();
            this.playerAnswer = null;
            this.isCurrentQuestion = false;
            this.playerPrompt = "Your answer is: ";
        }
        //
        Pattern.prototype = {
            /** TODO: move to a different service and also use in counting game
             * Returns a random integer between min (inclusive) and max (inclusive)
             * Using Math.round() will give you a non-uniform distribution!
             */
            getRandomInt : function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            /**
             * Generated an array with numbers following a pattern
             * @return {Array} pattern
             */
            patternGenerator : function() {
                // initialize the pattern item array with the starting number as the first item
                var pattern = [];
                pattern.push(this.config.startNum);
                // generate item count - 1 as the first one is already set
                for (var i=0; i < this.config.itemCount - 1; i++) {
                    pattern.push(pattern[i] * this.config.multiple + this.config.constant);
                }
                return pattern;
            },
            /**
             * Hide a random option from the pattern (except for the first one as it's a single digit number)
             */
            hideOption : function() {
                var hiddenOptNo = this.getRandomInt(1, this.config.optCount - 1),
                    answer = this.pattern[hiddenOptNo];
                this.pattern[hiddenOptNo] = "?";
                return answer;
            },
            /** TODO: move to a separate service (here it's different than in the counting game)
             * Generates the specified amount of incorrect answers to the math problem.
             * Makes sure thspotat the specified answer isn't equal to the answer
             * @return {Array} options
             */
            optionGenerator : function() {
                // an array to hold all answers
                var opts = [];
                while (opts.length < this.config.optCount) {
                    var randOpt;
                    if (this.answer > 30) {
                        // generate a random number that is different from the correct answer by max % specified by the maxDev variable
                        var randDev = this.getRandomInt(this.config.deviance.min, this.config.deviance.max);
                        randOpt = Math.floor(this.answer * (1 + randDev/100));
                    } else {
                        randOpt = this.getRandomInt(-this.config.optCount, this.config.optCount);
                    }
                    // make sure the option is not 0
                    if (randOpt === 0) {
                        continue;
                    }
                    // check if the option already is in the list
                    if (opts.indexOf(randOpt) < 0) {
                        //push the non-zero option to the list of available options
                        opts.push(randOpt);
                    }
                }
                // return the options, but add the correct answer to the list first
                return this.addAnswer(opts);
            },
            /** TODO: move to a seaprate service
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

        // variables for pattern TODO: put these in the DB or select according to difficulty
        // TODO: these numbers need thorough testing to make sure there's no infinite loop
        var config = {
            startNum : {
                min : 9,
                max : 15
            },
            multiple : {
                min : 2,
                max : 3
            },
            constant : {
                min : -25,
                max : 25
            },
            itemCount : 5,
            optCount : 7,
            deviance : {
                min : -25,
                max : 25
            }
        };

        this.generatePatterns = function() {
            var questions= [];
            for(var i=0 ; i<1; i++) {
                questions.push(new Pattern(i, config));
            }
            return questions;
        };
    }
);