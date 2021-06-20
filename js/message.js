var today = new Date();
var dateOnly = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
var minutes = (today.getMinutes()<10?'0':'') + today.getMinutes();
var hours = (today.getHours()<10?'0':'') + today.getHours();
var timeOnly = hours + ":" + minutes + ":" + today.getSeconds()
var date = dateOnly+' '+timeOnly;
var comment = $('#comment');

function htmlEncode ( html )
{
    html = $.trim(html);
    return html.replace(/[&"'\<\>]/g, function(c) 
    {
        switch (c) 
        {
            case "&":
                return "&amp;";
            case "'":
                return "&#39;";
            case '"':
                return "&quot;";
            case "<":
                return "&lt;";
            default:
                return "&gt;";
        }
    });
};

function ajaxCall(callback){
    $.ajax({
        method: "GET",
        url: "https://json.geoiplookup.io/?callback=?",
        dataType: 'json',
        success: callback
    });
}
    
function writePesan(id, name, email, pesan, ip, metaData) {
    firebase.database().ref('id/'+id).set({
        time : date,
        content : {
            username: name,
            email: email,
            pesan : pesan,
            ip : ip,
            meta: metaData,
            timestamp : date
        },
    });
}

function checkVal(text)
{
    var bad_words = new Array("anjing","bansgat","babi");
    var error=0;

    for(var i=0;i<bad_words.length;i++)
    {
        var val=bad_words[i];
        if((text.toLowerCase()).indexOf(val.toString())>-1)
        {
            error=error+1;
        }
    }
        
    if(error>0) {
        throw new Error("Something went badly wrong!");
    } 
}

function successInput() {
    
}

$(document).ready(function() {
    $('form#formPesan').on('submit', function (e) {
        let username = $('#username').val();
        let email = $('#email').val();
        let pesan = $('#pesan').val();
        
        if ( username.match( /(anjing|bangsat|babi|kontol|kimak|asu|goblok|ngentot|<|>)/ ) ||
                email.match( /(anjing|bangsat|babi|kontol|kimak|asu|goblok|ngentot|<|>)/ ) || 
                pesan.match( /(anjing|bangsat|babi|kontol|kimak|asu|goblok|ngentot|<|>)/ )
        ) {
            alert('Forbidden Words')
            e.preventDefault()
        } else {
            ajaxCall(result => {
                writePesan(Date.now(),username,email, pesan, result.ip, JSON.stringify(result,null,2))
                }) 
            e.preventDefault()
            UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> Terimakasih Ucapan / Doa Anda'})

            let prependHmtl = `
            <article class="uk-comment uk-comment-primary">
                        <header class="uk-comment-header">
                            <div class="uk-grid-medium uk-flex-middle" uk-grid>
                                <div class="uk-width-auto">
                                    <span uk-icon="icon: user; ratio:4;"></span>
                                </div>
                                <div class="uk-width-expand">
                                    <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">${username}</a></h4>
                                    <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                                        <li><a href="#">${date}</a></li>
                                    </ul>
                                </div>
                            </div>
                        </header>
                        <div class="uk-comment-body">
                            <p>${pesan}</p>
                        </div>
                    </article>`;
            comment.prepend(prependHmtl).fadeIn()
            console.log('success');
        }
        
    });
});

const dbRef = firebase.database().ref('id');

dbRef.orderByKey().get().then((snapshot) => {
    if (snapshot.exists()) {
        let data = snapshot.val();                
        let result = [];
        for(var d in data){
            let content = data[d].content
            content.time = data[d].time
            result.push(content);
        }
        function renderResult(result) {
            let html = result.map(r => {
                return `
                <article class="uk-comment uk-comment-primary">
                    <header class="uk-comment-header">
                        <div class="uk-grid-medium uk-flex-middle" uk-grid>
                            <div class="uk-width-auto">
                                <span uk-icon="icon: user; ratio:4;"></span>
                            </div> 
                            <div class="uk-width-expand">
                                <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">${htmlEncode(r.username)}</a></h4>
                                <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                                    <li><a href="#">${r.time}</a></li>
                                </ul>
                            </div>
                        </div>
                    </header>
                    <div class="uk-comment-body">
                        <p>${ htmlEncode(r.pesan)}</p>
                    </div>
                </article>
                `
            }).join(' ');
            comment.html(html);
        }
        function sortResults(prop, asc) {
            result.sort(function(a, b) {
                if (asc) {
                    return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                } else {
                    return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                }
            });
            renderResult(result)
        }
        sortResults('time', false)
    } else {
        console.log("No data available");
        comment.html('Tidak Ada Pesan');
    }
}).catch((error) => {
    console.error(error);
});