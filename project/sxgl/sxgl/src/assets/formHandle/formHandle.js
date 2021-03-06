require.config(requireConfig);
define(['jquery',
        'fly',
        'form'
    ],
    function($, fly) {
        window.top.init = function(code, version) {
            code = code ? code : 'FORM20171220001';
            version = version ? version : '0.1';
            setTimeout(function() {
                $("#showForm").loadForm({
                    name: code + '-' + version,
                    isFormShow: false,
                    stage: 0,
                    isView: false
                });
            }, 300);
            setTimeout(function() {
                $('#ifram', window.parent.document).css('height', this.document.body.scrollHeight + 30);
            }, 400);
        };
    });