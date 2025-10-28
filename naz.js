// 1. Yazı Yazma Animasyonu
const yaziElementi = document.getElementById('yazi-animasyonu');
const tamYazi = "Seninle her an bir macera, Naz. Hayatımdaki en güzel şeysin!";
let indeks = 0;

function yaziyiYaz() {
    if (indeks < tamYazi.length) {
        yaziElementi.innerHTML += tamYazi.charAt(indeks);
        indeks++;
        setTimeout(yaziyiYaz, 70); // 70ms aralıklarla harf yaz
    }
}

// Sayfa yüklendiğinde animasyonu başlat
window.onload = function() {
    yaziyiYaz();
};


// 2. Kalp Butonu Etkileşimi
const kalpButonu = document.getElementById('kalp-butonu');

kalpButonu.addEventListener('click', () => {
    // Tıklandığında küçük bir bildirim ver
    alert("Bize özel bir sır: Seni ÇOK seviyorum!");
    
    // Butonun yanına geçici bir kalp ikonu ekle (ekstra süsleme)
    const kalp = document.createElement('span');
    kalp.innerHTML = '💖';
    kalp.style.fontSize = '3em';
    kalp.style.position = 'absolute';
    kalp.style.top = (kalpButonu.offsetTop - 50) + 'px';
    kalp.style.left = kalpButonu.offsetLeft + 'px';
    
    document.body.appendChild(kalp);
    
    // Kalbi 1 saniye sonra kaybet
    setTimeout(() => {
        kalp.remove();
    }, 1000);
});