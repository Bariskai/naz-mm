// =========================================================================
// MEVCUT KODLAR (Yazı Animasyonu ve Kalp Efekti)
// =========================================================================
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

function kalpUcur() {
    const kalp = document.createElement('span');
    kalp.innerHTML = '❤️'; // Kırmızı kalp
    kalp.classList.add('floating-heart'); // CSS için sınıf ekle
    kalp.style.left = Math.random() * 100 + 'vw';
    kalp.style.bottom = '0px'; 
    document.body.appendChild(kalp);
    
    setTimeout(() => {
        kalp.remove();
    }, 5000);
}

const kalpButonu = document.getElementById('kalp-butonu');
kalpButonu.addEventListener('click', () => {
    alert("Bize özel bir sır: Seni ÇOK seviyorum!");
    
    const kalp = document.createElement('span');
    kalp.innerHTML = '💖';
    kalp.style.fontSize = '3em';
    kalp.style.position = 'absolute';
    kalp.style.top = (kalpButonu.offsetTop - 50) + 'px';
    kalp.style.left = kalpButonu.offsetLeft + (kalpButonu.offsetWidth / 2) + 'px';
    kalp.style.transform = 'translateX(-50%)'; 
    
    document.body.appendChild(kalp);
    
    setTimeout(() => {
        kalp.remove();
    }, 1000);
});

// Sayfa yüklendiğinde animasyonu başlat
window.onload = function() {
    yaziyiYaz();
    // NOT: Arama kodu kendi onload olayını kullanmayacak, doğrudan çalışacak.
};

// =========================================================================
// YENİ SESLİ ARAMA KODU (WebRTC/PeerJS)
// =========================================================================

// Sesli Arama için Gerekli Öğeler
const localAudio = document.getElementById('localAudio');
const remoteAudio = document.getElementById('remoteAudio');
const callButton = document.getElementById('callButton');
const endCallButton = document.getElementById('endCallButton');
const peerIdDisplay = document.getElementById('peerId');
const remotePeerIdInput = document.getElementById('remotePeerId');
const statusDisplay = document.getElementById('status'); 

const peer = new Peer();
let localStream;
let currentCall = null; 

// 1. PeerJS Bağlantısını Kurma
peer.on('open', (id) => {
    peerIdDisplay.value = id;
    statusDisplay.textContent = 'Hazır. Sizin ID: ' + id;
});

peer.on('error', (err) => {
    console.error("PeerJS Hatası:", err);
    statusDisplay.textContent = 'Hata oluştu. Yenilemeyi deneyin.';
    callButton.disabled = true; // Hata varsa aramayı engelle
});

// 2. Mikrofon Erişimi
navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    .then(stream => {
        localStream = stream;
        localAudio.srcObject = stream;
        statusDisplay.textContent = 'Mikrofon Hazır.';
    })
    .catch(err => {
        console.error("Mikrofon erişimi başarısız oldu:", err);
        statusDisplay.textContent = 'Arama için MİKROFON İZNİ vermeniz gerekiyor!';
        callButton.disabled = true; 
    });


// 3. Arama Başlatma (Siz, Naz'ı aradığınızda)
callButton.addEventListener('click', () => {
    const remoteId = remotePeerIdInput.value;
    if (!remoteId || !localStream) {
        alert("Naz'ın ID'sini girin ve mikrofonun hazır olduğundan emin olun.");
        return;
    }

    statusDisplay.textContent = 'Naz aranıyor...';
    
    const call = peer.call(remoteId, localStream);
    currentCall = call;

    call.on('stream', (remoteStream) => {
        remoteAudio.srcObject = remoteStream;
        statusDisplay.textContent = 'Arama Bağlandı.';
    });

    call.on('close', () => {
        statusDisplay.textContent = 'Arama Sonlandı.';
        endCall();
    });

    callButton.disabled = true;
    endCallButton.disabled = false;
});


// 4. Aramayı Cevaplama (Naz, Sizi aradığında)
peer.on('call', (call) => {
    const onay = confirm("Naz sizi arıyor. Cevaplamak ister misiniz?");
    if (onay) {
        currentCall = call;
        call.answer(localStream);
        statusDisplay.textContent = 'Arama Bağlandı.';

        call.on('stream', (remoteStream) => {
            remoteAudio.srcObject = remoteStream;
        });
        
        call.on('close', () => {
            statusDisplay.textContent = 'Arama Sonlandı.';
            endCall();
        });

        callButton.disabled = true;
        endCallButton.disabled = false;
    } else {
        call.close();
    }
});


// 5. Aramayı Sonlandırma Fonksiyonu
function endCall() {
    if (currentCall) {
        currentCall.close();
        currentCall = null;
    }
    // Mikrofon akışlarını durdur
    if (localStream) {
        localStream.getTracks().forEach(track => {
            if (track.kind === 'audio') {
                 track.stop();
            }
        });
    }

    // Basitçe sayfayı yenilemek en güvenli yöntemdir
    window.location.reload(); 
}

endCallButton.addEventListener('click', endCall);
