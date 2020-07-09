;(function() {
	var base64 = 'VCVaqlUAAFVEqqqEq1UAACVaqlUFVEqqqEqqqEqqqEqqqEqqqlUVVKtVCVaqEq1UAAlUqqVQFVEqqqEqqqEq1UlUqpKtVCVaqlUFVEqqqlUVVKtVCVaqEq1UCVaqlUFVEqqqEq1UAAAACVaqlUVVKtVAlUqpKoqpKoqpKtVCVaqlUVVKtVAlUqpKtVACVaqEqqqlUVVKoqpKoqpKoqqVVVEq1UlUqqVQVVKtVCVaqlUVVKoqpKoqpKoqqVQVVKtVAlUqpKtVAlUqpKtVAACVaqlUVVKtVCVaqlUAAVVKtVCVaqlUVVKtVCVaqlUVVKtVAlUqpKoqqVVVEqqqEqqqEqqqEq1UlUqqVVVEqqqEq1UlUqqVVVEqqqEqqqEqqqlUFVEq1UlUqqVQVVKoqqVQVVKtVAACVaqlUVVKtVCVaqlUAAVVKtVCVaqlUVVKtVCVaqlUVVKoqqVQFVEq1UlUqpKoqpKtVAlUqqVVVEq1UAlUqqVVVEq1UlUqpKoqpKoqqVQVVKoqqVQAAFVEq1UAACVaqlUVVKtVCVaqEqqqEqqqEq1UCVaqlUVVKtVCVaqlUFVEqqqEq1UCVaqEqqqEq1UCVaqlUVVKtVACVaqlUVVKoqqVQAFVEqqqlUAAFVEqqqlUVVKtVAAACVaqlUVVKoqpKoqpKoqpKoqpKoqqVQVVKtVCVaqlUVVKtVAlUqpKtVAlUqpKoqpKoqqVQVVKoqpKoqqVQAFVEqqqEq1UCVaqEqqqlUAVVKoqqVVVEq1UAAACVaqEqqqEqqqEqqqEqqqEqqqEqqqEq1UCVaqEq1UCVaqEq1UCVaqEqqqEqqqEqqqEqqqEqqqEqqqEqqqEq1UAAACVaqEqqqEqqqEq1UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/8QAFBABAAAAAAAAAAAAAAAAAAAAwP/aAAgBAQABBQIAB//EABQRAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQMBAT8BAB//xAAUEQEAAAAAAAAAAAAAAAAAAACg/9oACAECAQE/AQAf/8QAFBABAAAAAAAAAAAAAAAAAAAAwP/aAAgBAQAGPwIAB//EABQQAQAAAAAAAAAAAAAAAAAAAMD/2gAIAQEAAT8hAAf/2gAMAwEAAgADAAAAEPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP/EABQRAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQMBAT8QAB//xAAUEQEAAAAAAAAAAAAAAAAAAACg/9oACAECAQE/EAAf/8QAFBABAAAAAAAAAAAAAAAAAAAAwP/aAAgBAQABPxAAB//Z';
	var eventHandle = {
		// 将base64位转换成 formaData
	    dataURItoBlob: function (base64Data) {
	        var byteString;
	        if (base64Data.split(',')[0].indexOf('base64') >= 0) {
	            byteString = atob(base64Data.split(',')[1]);
	        }else {
	            byteString = unescape(base64Data.split(',')[1]);
	        }
	        var mimeString = base64Data.split(',')[0];  // .split(':')[1].split(';')[0]
	        var ia = new Uint8Array(byteString.length);
	        for (var i = 0; i < byteString.length; i++) {
	            ia[i] = byteString.charCodeAt(i);
	        }
	        return new Blob([ia], {
	            type: mimeString
	        });
	    },
	    // 构建formData
	    conFormData: function(imageBase64) {
	        var blob = eventHandle.dataURItoBlob(imageBase64); // 上一步中的函数
	        var canvas = document.createElement('canvas');
	        var dataURL = canvas.toDataURL('image/jpeg', 0.5);
	        var  fd = new FormData(document.forms[0]);
	        fd.append("the_file", blob, 'image.png');
	        return fd;
	    }
	};
	var a = eventHandle.conFormData(base64);
	console.log(a);
})();