const images = ["♓", "♓", "♒", "♒", "♈", "♈", "♉", "♉", "♋", "♋", "♏", "♏", "♎", "♎", "♑", "♑" ,"♊", "♊", "♌", "♌","♍", "♍", "♐", "♐"];
let emojis = images.sort(() => Math.random() - 0.5);
let gameEnded = false;//判斷遊戲是否勝利

let successText = document.getElementById('successful-text')
let success = JSON.parse(localStorage.getItem('success'))
successText.innerText =`成功次數:${success}`;

function showAlert(message) { //簡介畫面
  document.querySelector('.start-alert-message').textContent = message;
  document.getElementById('startAlert').style.display = 'flex';
}

showAlert('您有3秒鐘的時間可以記憶卡片位置，準備好就開始挑戰吧!');

document.querySelector('.start-alert-btn').addEventListener('click', function() { //遊戲開始
  document.getElementById('startAlert').style.display = 'none';
  document.querySelector('.cards').style.animation = 'fade 1.5s ease';//淡入動畫

  var audio = document.getElementById("myAudio"); ///音樂播放
  audio.play();

  document.getElementById("playPauseButton").addEventListener("click", function() {
    var audio = document.getElementById("myAudio");
    if (audio.paused) {
      audio.play();
      document.getElementById('playPauseButton').innerHTML='🔊';

    } else {
      audio.pause();
      document.getElementById('playPauseButton').innerHTML='🔇';
    }
  });

  emojis.forEach((emoji, index) => {
    let box = document.createElement('div');
    box.className = 'item';
    box.innerHTML = emoji;
    box.dataset.index = index; 
    box.style.pointerEvents='none';
    box.classList.add('itemVisible'); //間接修改偽元素
    

    let timeLeft = 43;//預留3秒讓玩家記憶卡牌位置
    let timer = setInterval(function() {
      if(!gameEnded){
        timeLeft -=1
        if(timeLeft <=40){ 
          document.getElementById('time').innerText = `Time Left:${timeLeft}`;
          document.getElementById('time').style.textShadow='0 0 1.5px black';
          box.classList.remove('itemVisible');
          box.style.pointerEvents='auto';
        }
        if(timeLeft <=10){
          document.getElementById('time').style.color='#BF291D';
          document.getElementById('time').style.textShadow='0 0 1.5px black';
        }
        if(timeLeft <=0) {
          clearInterval(timer);
          document.getElementById('time').style.color = '#BF291D';
          document.getElementById('time').style.textShadow = '0 0 1px #171614';
          document.getElementById('time').style.fontSize = '1.6rem';
          document.getElementById('time').innerText = 'Game Over！';
          box.style.pointerEvents='none';
        }
      }
    },1000);


      box.onclick = () => {
        if(document.querySelectorAll('.boxOpen').length >= 2){
          return;
        }

        box.classList.add('boxOpen'); // 標記為已翻開

        let openedCards = document.querySelectorAll('.boxOpen');
        // 當翻開兩張牌時進行比較
        if (openedCards.length === 2) {
          let firstCard = openedCards[0];
          let secondCard = openedCards[1];
        
          if (firstCard.innerHTML === secondCard.innerHTML) {
            // 將它們標記為已匹配並隱藏
            setTimeout(() => {
              firstCard.classList.add('boxMatch');
              secondCard.classList.add('boxMatch');
              firstCard.classList.remove('boxOpen');
              secondCard.classList.remove('boxOpen');
              firstCard.style.opacity = '0';
              secondCard.style.opacity = '0';
              firstCard.style.pointerEvents = 'none';
              secondCard.style.pointerEvents = 'none';


              function winAlert(message) { //簡介畫面
                document.querySelector('.pass-alert-message').textContent = message;
                document.getElementById('missionPass').style.display = 'flex';
              }
              if(document.querySelectorAll('.boxMatch').length === images.length){
                gameEnded = true;
                clearInterval(timer);
                winAlert('挑戰成功!');
                success++;
                localStorage.setItem('success', JSON.stringify(success));
                document.querySelector('.pass-alert-btn').addEventListener('click', function(){
                window.location.reload();
                })        
              }

            },500)
          }else{
            setTimeout(() => {
              firstCard.classList.remove('boxOpen');
              secondCard.classList.remove('boxOpen');
            },500); 
          }
        }
      }
        document.querySelector('.cards').appendChild(box);
  });
});