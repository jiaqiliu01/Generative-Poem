function preload(){
  lines = loadStrings('https://openprocessing-usercontent.s3.amazonaws.com/files/user230780/visual952333/hbebe7161a534311c99b355e4ec2ed627/Frost.txt');
}

// Declare Global Variables
var lexicon;
var alteredLines;
var possibleWords;
var newWord;

//set up canvas
function setup() {
	createCanvas(windowWidth, windowHeight);
	alteredPoem();
	textAlign(CENTER, CENTER);
	textSize(width/100);
	button = createButton('Generate New');
	button.size(100,30);
	button.style('font-size', '12px');
  button.position(2*width/3 - 40, height/4-80);
  button.mousePressed(alteredPoem);
}

function draw() {
	drawBackground();
	drawText();
}

//style background
function drawBackground(){
	background(0);
	push();
	fill(255);
	rect(0,0,width/2,height);
	pop();
}

//style text
function drawText(){
	push();
	fill(0);
	textFont('Georgia');
	text(join(lines, '\n'), width/3, height/2);
	text("Stopping by Woods on a Snowy Evening \n Robert Frost", width/3, height/8);
	fill(255);
	text(join(alteredLines, '\n'), 2*width/3, height/2);
	text("Stopping by Woods on a Snowy Evening", 2*width/3, height/8)
	pop();
}

function alteredPoem(){
	lexicon = new RiLexicon();
	alteredLines = []
	for (i = 0; i < lines.length; i++){
		alteredLines.push(replace(lines[i]));
	}
}

//replace adjs and nouns
function replace(string){
	resultArray = [];
	ArrayOfWords = RiTa.tokenize(string);
	PartsOfSpeech = RiTa.getPosTags(ArrayOfWords);
	for (j = 0; j < ArrayOfWords.length; j++){
		//adjuctive
		if (PartsOfSpeech[j] === "jj" || PartsOfSpeech[j] === "jjr" || PartsOfSpeech[j] === "jjs" || PartsOfSpeech[j] === "nn" || PartsOfSpeech[j] === "nns" || PartsOfSpeech[j] === "nnp" || PartsOfSpeech[j] === "nnps"){
			if (j === ArrayOfWords.length - 1 && ArrayOfWords[j].length > 1){
				resultArray.push(fixRhyme(ArrayOfWords[j], PartsOfSpeech[j]))
			}
			else if (j === ArrayOfWords.length - 2 && ArrayOfWords[j+1].length === 1){
				resultArray.push(fixRhyme(ArrayOfWords[j], PartsOfSpeech[j]))
			}
			//noun
			else {
				if (PartsOfSpeech[j] === "nns"){ //"nns" includes plural nouns
				resultArray.push(RiTa.pluralize(lexicon.randomWord("nn")));
				}
				else{
				resultArray.push(lexicon.randomWord(PartsOfSpeech[j]));}
				}
		}
		// not noun or adjective
		else{
			resultArray.push(ArrayOfWords[j]);
		}
	}
	resultString = RiTa.untokenize(resultArray);
	return resultString;
}

// fix the rhyme
function fixRhyme(oldWord, posTag){
	possibleWords = [];
	newWord = '';
	newWordsUnfiltered = (lexicon.rhymes(oldWord));
	newPOS = RiTa.getPosTags(newWordsUnfiltered);
	for (k = 0; k < newWordsUnfiltered.length; k++){
		if (newPOS[k] === posTag){possibleWords.push(newWordsUnfiltered[k])}} 
	newWord = possibleWords[Math.floor(Math.random()*possibleWords.length)]; 
	return newWord;
}