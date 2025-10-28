// 1. Yazı Yazma Animasyonu ve Kalp Efekti
const yaziElementi = document.getElementById('yazi-animasyonu');
const tamYazi = "Seninle her an bir macera, Naz. Hayatımdaki en güzel şeysin!";
let indeks = 0;

function yaziyiYaz() {
    if (indeks < tamYazi.length) {
        yaziElementi.innerHTML += tamYazi.charAt(indeks);
        indeks++;
        setTimeout(yaziyiYaz, 70); // 70ms aralıklarla harf yaz
    } else {
        // Yazı bittiğinde kalpleri göstermeye başla
        setInterval(kalpUcur, 500); 
    }
}

// Kalp Uçurma Fonksiyonu 
function kalpUcur() {
    const kalp = document.createElement('span');
    kalp.innerHTML = '❤️'; // Kırmızı kalp
    kalp.classList.add('floating-heart'); // CSS için sınıf ekle
    
    // Rastgele başlangıç pozisyonu
    kalp.style.left = Math.random() * 100 + 'vw';
    kalp.style.bottom = '0px'; 
    
    document.body.appendChild(kalp);
    
    // 5 saniye sonra kalbi kaybet
    setTimeout(() => {
        kalp.remove();
    }, 5000);
}


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
    // Butonun tam ortasına yakın bir yere konumlandırmak için hesaplama
    kalp.style.top = (kalpButonu.offsetTop - 50) + 'px';
    kalp.style.left = kalpButonu.offsetLeft + (kalpButonu.offsetWidth / 2) + 'px';
    kalp.style.transform = 'translateX(-50%)'; // Ortalamak için
    
    document.body.appendChild(kalp);
    
    // Kalbi 1 saniye sonra kaybet
    setTimeout(() => {
        kalp.remove();
    }, 1000);
});


// Sayfa yüklendiğinde animasyonu başlat
window.onload = function() {
    yaziyiYaz();
};
