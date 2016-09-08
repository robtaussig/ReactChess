self.onmessage = function (e) {
  let workerResult = 'Message received!';
  postMessage(e.data.data);
};
