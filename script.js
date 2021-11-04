class AudioController{
    constructor(){
        this.bgMusic = new Audio('Assets/Audio/harrypotter.mp3')
        this.flipSound = new Audio('Assets/Audio/flip.wav')
        this.matchSound =  new Audio('Assets/Audio/match.wav')
        this.victorySound =  new Audio('Assets/Audio/victorySound.mp3')
        this.gameOverSound =  new Audio('Assets/Audio/gameOverSound.mp3')
        this.bgMusic.volume = 0.5
        this.bgMusic.loop = true
    }
    startMusic(){
        this.bgMusic.play()
    }
    stopMusic(){
        this.bgMusic.pause()
        this.bgMusic.currentTime = 0
    }
    flip(){
        this.flipSound.play()
    }
    match(){
        this.matchSound.play()
    }
    victory(){
        this.stopMusic()
        this.victorySound.play()
    }
    gameOver(){
        this.stopMusic()
        this.gameOverSound.play()
    }
}
//--------------------audio controlling----------


class MixOrMatch{
    constructor(totalTime,cards){
       this.cardsArray = cards
       this.totalTime = totalTime
       this.timeRemaining = totalTime
       this.timer = document.getElementById("time-remaining")
       this.ticker = document.getElementById("flips")
       this.audioController = new AudioController
    }
    startGame(){
        this.cardToCheck = null
        this.totalClicks = 0
        this.timeRemaining = this.totalTime
        this.matchedCards = []
        this.busy = true
        setTimeout(()=>{
            this.audioController.startMusic()
            this.shuffleCards()
            this.countDown = this.startCountDown()
            this.busy = false
        },500)
        this.hideCards()
        this.timer.innerText = this.timeRemaining
        this.ticker.innerText = this.totalClicks   
    }
    hideCards(){
        this.cardsArray.forEach(card =>{
            card.classList.remove("visible")
            card.classList.remove("matched")
        })
    }
    flipCard(card){
        if (this.canFlipCard(card)){
            this.audioController.flip()
            this.totalClicks++
            this.ticker.innerText = this.totalClicks
            card.classList.add("visible")
             if (this.cardToCheck) {
                this.checkForCardMatch(card)
             }else{
                this.cardToCheck = card
             }
        }
    }
    checkForCardMatch(card){
          if (this.getCardType(card) === this.getCardType(this.cardToCheck)) 
              this.cardMatch(card, this.cardToCheck);
              
         else 
            this.cardMisMatch(card, this.cardToCheck);   
            this.cardToCheck = null
            }
    cardMatch(card1, card2){
        this.matchedCards.push(card1)
        this.matchedCards.push(card2)
        card1.classList.add("matched")
        card2.classList.add("matched")
        this.audioController.match()
        if (this.matchedCards.length === this.cardsArray.length) {
            this.victory()
        }
    }
    cardMisMatch(card1, card2){
        this.busy = true
        setTimeout(()=>{
            card1.classList.remove("visible")
            card2.classList.remove("visible")
            this.busy = false
        },1000)
    }
    getCardType(card){
       return  card.getElementsByClassName("card-value")[0].src
    }
    startCountDown(){
        return setInterval(() => {           
            this.timer.innerText = this.timeRemaining--
            if (this.timeRemaining == 0) {
              setTimeout(() => {
                  this.gameOver()
              }, 1000);  
            }
        }, 1000);
    }
    gameOver(){
        clearInterval(this.countDown)
        this.audioController.gameOver()
        document.getElementById("game-over-text").classList.add("visible")
    }
    victory(){
        clearInterval(this.countDown)
        this.audioController.victory()//plays the victory sound
        this.audioController.stopMusic()//stops the background sound
        this.hideCards()
        document.getElementById("victory-text").classList.add("visible")//and this makes the overlay visible
        let score = document.getElementById("score");
        // console.log(score)
        console.log(this.timeRemaining * this.timeRemaining + 100 - this.totalClicks)
        score.innerText = this.timeRemaining * this.timeRemaining + 100 - this.totalClicks
          
    }
   shuffleCards(){
        for (let i = this.cardsArray.length - 1; i > 0; i-- ) {
            let randIndex = Math.floor(Math.random() * (i+1))
            this.cardsArray[randIndex].style.order = i
            this.cardsArray[i].style.order = randIndex
        }
    }
    canFlipCard(card){
        return(!this.busy && !this.matchedCards.includes(card) &&  card !== this.cardToCheck)
    }  
}    

//---------------main function--------------

function ready(){
    let gameOver = document.getElementById("game-over-text")
    let victoryOverlay = document.getElementById("victory-text")
    let cards = Array.from(document.getElementsByClassName("card"))
    let game = new MixOrMatch(100, cards)
    let startOverlay = document.getElementById("start-game-overlay")
    let halloweenWish = document.getElementById("happy-halloween")
    let enterBtn = document.getElementById("enter-btn")
    let nameInput = document.getElementById("name-input")
    let nameHolder = document.getElementById("name")
    let letsBeginBtn = document.getElementById("begin-btn")
    let restartBtn = document.getElementById("restartBtn")
    
    //-------function to make the "wish and name" overlay visible------
    startOverlay.addEventListener("click",() => {
            halloweenWish.classList.add("name-visible")
            startOverlay.classList.remove("visible")
        })
    //--------function to make the rules overlay visible-------------
    enterBtn.addEventListener("click",()=>{
        let rules = document.getElementById("rules")
        rules.classList.add("name-visible")
        halloweenWish.classList.remove("name-visible")
        nameHolder.innerText = nameInput.value
    })
    //--------function to start----------------   
    letsBeginBtn.addEventListener("click",()=>{
        rules.classList.remove("name-visible")
        game.startGame()
    })
    //-----------function to restart-----------
    gameOver.addEventListener("click",()=>{
            gameOver.classList.remove("visible")
            game.startGame()       
       }) 
    restartBtn.addEventListener("click",()=>{
        document.getElementById("scoreCtn").classList.remove("name-visible")
            game.startGame()       
       }) 

    //------------show score-----
    victoryOverlay.addEventListener("click",()=>{
        victoryOverlay.classList.remove("visible")
        document.getElementById("scoreCtn").classList.add("name-visible")
    })
    
    //------function to flip the card----------
     cards.forEach(card => {
        card.addEventListener("click" , () => {
            game.flipCard(card)
         })
       }) 
}    
    
//-----------------------calling the main function---------------------
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded" , ready()) 
 }else{
     ready()
 }
 
