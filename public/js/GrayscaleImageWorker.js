// -----------------------------------------------------------------------
// Inspired by KinectWorker-1.8.0.js from the 1.8 Microsoft SDK.
// -----------------------------------------------------------------------

(function () {

    importScripts('pako.inflate.min.js');

    var imageData;

    function init() {
        addEventListener('message', function (event) {
            switch (event.data.message) {
                case "setImageData":
                    imageData = event.data.imageData;
                    break;
                case "processImageData":
                    processImageData(event.data.imageBuffer);
                    break;
            }
        });
    }

    function processImageData(compressedData) {
        var imageBuffer = pako.inflate(atob(compressedData));
        // var pixelArray = imageData.data;
        // var newPixelData = new Uint8Array(imageBuffer);
        var depthPixelIndex = 0;
        var imageDataSize = imageData.data.length;

        for (var i = 0; i < imageDataSize; i += 4) {
            // imageData.data[i] = newPixelData[depthPixelIndex];
            // imageData.data[i + 1] = newPixelData[depthPixelIndex];
            // imageData.data[i + 2] = newPixelData[depthPixelIndex];
            // imageData.data[i + 3] = 0xff;
            const brightness = imageBuffer[depthPixelIndex] * 0.8
            if (brightness > 0x80) {
                imageData.data[i] = brightness
                imageData.data[i + 1] = brightness
                imageData.data[i + 2] = brightness
                imageData.data[i + 3] = 0xff;
            } else {
                imageData.data[i] = 0xef;
                imageData.data[i + 1] = 0x47;
                imageData.data[i + 2] = 0x47;
                imageData.data[i + 3] = 0xff;
            }



            depthPixelIndex++
        }
        self.postMessage({ "message": "imageReady", "imageData": imageData });


    }

    init();
})();