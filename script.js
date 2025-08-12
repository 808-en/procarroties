        document.addEventListener("DOMContentLoaded", function() {
            const musicPopup = document.getElementById("musicPopup");
            const noThanksBtn = document.getElementById("noThanksBtn");
            const listenBtn = document.getElementById("listenBtn");
            const backgroundMusic = document.getElementById("backgroundMusic");

            setTimeout(function() {
                musicPopup.style.display = "flex";
            }, 2000);

            noThanksBtn.addEventListener("click", function() {
                musicPopup.style.display = "none";
            });

            listenBtn.addEventListener("click", function() {
                musicPopup.style.display = "none";
                backgroundMusic.play(); // Play the music
            });
        });