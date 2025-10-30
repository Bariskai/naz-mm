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
    // Kalp pozisyonunu dinamik olarak ayarlamak daha iyi
    const rect = kalpButonu.getBoundingClientRect();
    kalp.style.top = (rect.top + window.scrollY - 50) + 'px';
    kalp.style.left = (rect.left + window.scrollX + rect.width / 2) + 'px';
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

// YENİ: Sayaç Öğeleri
const callTimerContainer = document.getElementById('callTimerContainer');
const callTimerDisplay = document.getElementById('callTimer');
let callTimerInterval = null; // Sayacın setInterval kimliğini tutar
let callStartTime = 0; // Aramanın başladığı zamanı (timestamp) tutar


// Tarayıcı Desteği Kontrolü
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    statusDisplay.textContent = 'Tarayıcı desteklenmiyor!';
    alert('Sesli arama için güncel bir tarayıcı (Chrome, Firefox, Safari) kullanın.');
}

// 1. PeerJS Bağlantısını Kurma (Sunucu Denemeleri ve Güvenilir Ayarlar)
const peer = new Peer({
    host: '0.peerjs.com', 
    port: 443, 
    path: '/',
    secure: true,
    // Sunucudan yanıt gelmezse yeniden denemesi için ek ayarlar
    config: { 'iceServers': [ { 'urls': 'stun:stun.l.google.com:19302' } ] } 
});
let localStream;
let currentCall = null; 

peer.on('open', (id) => {
    peerIdDisplay.value = id;
    statusDisplay.textContent = 'Hazır. Sizin ID: ' + id;
});

peer.on('error', (err) => {
    console.error("PeerJS Hatası:", err);
    statusDisplay.textContent = 'HATA: Bağlantı kurulamadı. Sayfayı yenileyin.';
    callButton.disabled = true; // Hata varsa aramayı engelle
});

// =========================================================================
// YENİ: ARAMA SAYACI FONKSİYONLARI
// =========================================================================

function startCallTimer() {
    // Zaten çalışan bir sayaç varsa temizle
    if (callTimerInterval) {
        clearInterval(callTimerInterval);
    }
    
    callTimerContainer.style.display = 'block'; // Sayacı görünür yap
    callStartTime = Date.now(); // Başlangıç zamanını kaydet

    callTimerInterval = setInterval(() => {
        const elapsed = Date.now() - callStartTime;
        const totalSeconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        // MM:SS formatı için '0' ile doldurma
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        
        callTimerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }, 1000); // Her saniye güncelle
}

function stopCallTimer() {
    if (callTimerInterval) {
        clearInterval(callTimerInterval);
        callTimerInterval = null;
    }
    callTimerContainer.style.display = 'none'; // Sayacı gizle
    callTimerDisplay.textContent = '00:00'; // Sayacı sıfırla
}


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
        startCallTimer(); // SAYAÇ BAŞLAT
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
    // Sayfada çıkan confirm yerine daha zarif bir şey kullanmalısınız.
    const onay = confirm("Naz sizi arıyor. Cevaplamak ister misiniz?"); 
    if (onay) {
        currentCall = call;
        call.answer(localStream);
        statusDisplay.textContent = 'Arama Bağlandı.';

        call.on('stream', (remoteStream) => {
            remoteAudio.srcObject = remoteStream;
            startCallTimer(); // SAYAÇ BAŞLAT
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
    stopCallTimer(); // SAYAÇ DURDUR

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
