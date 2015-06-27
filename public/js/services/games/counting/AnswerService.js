angular.module('AnswerService', [])

    .service('Answers', function() {
        function Question(nQuestNo, oConfig) {
            this.nQuestNo = nQuestNo;
            this.oConfig = {
                falseOptCount : oConfig.falseOptCount,
                deviance : {
                    min : oConfig.minDev,
                    max : oConfig.maxDev
                }
            };
            this.oNumbers = {
                one : this.getRandomInt(oConfig.minNum, oConfig.maxNum),
                two : this.getRandomInt(oConfig.minNum, oConfig.maxNum)
            };
            this.nAnswer = this.calculator(this.oNumbers.one, this.oNumbers.two);
            this.aFalseOptions = this.optionGenerator();
            this.aOptions = this.addAnswer(this.aFalseOptions);
            this.bIsCurr = false;
            this.nPlayerAnswer = null;
            this.sPlayerPrompt = "Your answer is: ";
        }

        Question.prototype = {
            /**
             * TODO: move to a separate helper class
             * Returns a random integer between min (inclusive) and max (inclusive)
             * Using Math.round() will give you a non-uniform distribution!
             */
            getRandomInt : function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            /**
             * Return the correct answer to the math problem
             */
            calculator : function(numOne, numTwo) {
                return numOne * numTwo;
            },
            /**
             * Returns the specified amount of incorrect answers to the math problem.
             * Makes sure that the specified answer isn't equal to the answer
             */
            optionGenerator : function() {
                // an array to hold all answers
                var opts = [];
                while (opts.length < this.oConfig.falseOptCount - 1) {
                    // generate a random number that is different from the correct answer by max % specified by the maxDev variable
                    var randDev = this.getRandomInt(this.oConfig.deviance.min, this.oConfig.deviance.max);
                    if (randDev === 0) {
                        continue;
                    }
                    var randOpt = Math.floor(this.nAnswer * (1 + randDev/100));
                    // check if the option already is in the list
                    if (opts.indexOf(randOpt) < 0) {
                        //push the non-zero option to the list of available options
                        opts.push(randOpt);
                    }
                }
                // return the options, but add the correct answer to the list first
                return opts;
            },
            /**
             * Add the correct answer at a random position in the list of options
             */
            addAnswer : function(aOpts) {
                //generate a random int (0 till options count) that will be the position of the correct answer in the options
                var nFalseOptLastIndex = this.oConfig.falseOptCount - 1,
                    nRandPos = this.getRandomInt(0, nFalseOptLastIndex);
                
                // if the new position is at the end of the array, just add it, otherwise replace it with an incorrect answer
                if (nRandPos === nFalseOptLastIndex) {
                    aOpts.push(this.nAnswer);
                } else {
                    var nTempValue = aOpts[nRandPos];
                    
                    aOpts[nRandPos] = this.nAnswer;
                    aOpts.push(nTempValue);
                }
                
                return aOpts;
            },
            /**
             * TODO: move to the vm or a separate service
             * Set the player's answer in the view
             * @param opt {String || Number}
             */
            setPlayerAnswer : function(nOpt) {
                this.nPlayerAnswer = nOpt;
                this.sPlayerPrompt = "Your answer is: " + this.nPlayerAnswer;
            }
        };
        this.generateQuestions = function(oConfig) {
            var aQuests= [];
            for(var i=0 ; i < oConfig.questCount   ; i++) {
                aQuests.push( new Question(i, oConfig) );
            }
            return aQuests;
        };
    }
);