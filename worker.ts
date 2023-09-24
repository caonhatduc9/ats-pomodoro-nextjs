/// <reference lib="webworker" />
export default null
declare let self: ServiceWorkerGlobalScope
let intervalId: any;
function startInterval(callback: any) {
  clearInterval(intervalId); // Dừng interval hiện tại nếu có
  intervalId = setInterval(callback, 1000);
}


function stopInterval() {
  clearInterval(intervalId);
}
// Sử dụng postMessage để gửi thông điệp đến trình duyệt
self.addEventListener('message', (event) => {  
  if (event.data === 'startInterval') {
    // Bắt đầu đếm ngược
    startInterval(() => {
      self.self.postMessage('updateSecond');
    });
  } else if (event.data === 'stopInterval') {
    // Dừng đếm ngược
    stopInterval();
  }
});

self.addEventListener('push',(event: any) => {

    const options = {
    body: 'Your timer has finished.',
  };

  event.waitUntil(
    self.registration.showNotification('Thông báo tiêu đề', options)
  );
 });
