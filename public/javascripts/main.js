$( document ).ready(function() {
    //Kết nối tới server socket đang lắng nghe
    var socket = io();


    loadSlideBar();

    //Kiểm tra khi người dùng cuộn đến xuống gần cuối trang thì load thêm bài viết
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            let index = $("body").attr("data-index"); 
            let action = $("body").attr("data-action");
            if(action == "load"){
                if($("body").attr("data-trang") == "trangchu"){
                    console.log(index);
                    $("body").attr("data-action", "loading");
                    loadPost(index);
                }
            }
        }
    });
     


    $('#input-image-post').change(function(){
        const file = this.files[0];
        if (file){
          let reader = new FileReader();
          reader.onload = function(event){
            $(".review-image").empty();
            $(".review-image").html(`<img class="preview-image" src="${event.target.result}" alt="">`)
          }
          reader.readAsDataURL(file);
        }
    });

    $('.input-linkyoutube').change(function(){
        let id = getIdYoutube($(this).val());
        $(".reviewyoutube").html(`<iframe src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
    });



    $(".close-modal").click(function(){
        $(".modal").css("display", "none");
        $(".item-content").css("display", "none");
        $("textarea").val("");
        $("input").val("");
        $(".review-image").empty();
        $(".reviewyoutube").empty();
        $(".btn-up-post").attr("data-action", "");
        $(".btn-up-post").attr("data-type", "");
        $(".btn-up-post").attr("data-idpost", "");
        $(".button-delete-post").attr("data-idpost", "");
        $(`.dropdown-menu`).css("display", "none");
        
    });

    $(".inputcontent").click(function(){
        $(".modal").css("display", "block");
        $(".avt-name").css("display", "flex");
        $(".inputcontent").css("display", "flex");
        $(".review-image").css("display", "block");
        $(".inputimage").css("display", "block");
        $(".button-port").css("display", "block");
        $(".modal-create-post").css("display", "block");
        $(".textarea-content").focus();
        $(".btn-up-post").attr("data-action", "uppost");
        $(".btn-up-post").attr("data-action", "uppost");
        $(".btn-up-post").attr("data-type", "post");
        $(".btn-up-post").attr("data-idpost", "");
    });

    $(".imagepost").click(function(){
        $(".modal").css("display", "block");
        $(".avt-name").css("display", "flex");
        $(".inputcontent").css("display", "flex");
        $(".review-image").css("display", "block");
        $(".inputimage").css("display", "block");
        $(".button-port").css("display", "block");
        $(".modal-create-post").css("display", "block");
        $("#input-image-post").click();
        $(".btn-up-post").attr("data-action", "uppost");
        $(".btn-up-post").attr("data-action", "uppost");
        $(".btn-up-post").attr("data-type", "post");
        $(".btn-up-post").attr("data-idpost", "");
    });

    $(".linkyoutube").click(function(){
        $(".modal").css("display", "block");
        $(".avt-name").css("display", "flex");
        $(".reviewyoutube").css("display", "flex");
        $(".inputlinkyoutube").css("display", "block");
        $(".button-port").css("display", "block");
        $(".inputlinkyoutube input").focus();
        $(".btn-up-post").attr("data-action", "uppost");
        $(".btn-up-post").attr("data-type", "youtube");
        $(".btn-up-post").attr("data-idpost", "");
    });


    /*Modal trang thêm người dùng - Thêm người dungg mới*/
    $(".open-tnd-modal").click(function(){
        $(".tnd-modal").css("display", "block");
    })

    $(".close-tnd-modal").click(function(){
        $(".tnd-modal").css("display", "none");
    })

    /*Modal trang thông báo - tạo thông báo mới*/
    $(".open-ttb-modal").click(function(){
        $(".ttb-modal").css("display", "block");
    })

    $(".close-ttb-modal").click(function(){
        $(".ttb-modal").css("display", "none");
    })

    /*Modal trang chi tiết thông báo - xoá sửa thông báo*/
    $(".open-tcttb-modal").click(function(){
        $(".tcttb-modal").css("display", "block");
        $(".tcttb-box-error").css("display", "block");
        $(".item-edit-notification").css("display", "block");
        $(".item-delete-notification").css("display", "none");
    })

    $(".close-tcttb-modal").click(function(){
        $(".tcttb-modal").css("display", "none");
        $(".tcttb-box-error").css("display", "none");
        $(".item-edit-notification").css("display", "none");
        $(".item-delete-notification").css("display", "none");
    })

    $(".open-tcttb-modal-delete").click(function(){
        $(".tcttb-modal").css("display", "block");
        $(".item-delete-notification").css("display", "block");
        $(".tcttb-box-error").css("display", "none");
        $(".item-edit-notification").css("display", "none");
    })


    //Xem trước ảnh đại diện
    $('#tcn-input-avt').change(function(){
        const file = this.files[0];
        if (file){
          let reader = new FileReader();
          reader.onload = function(event){
            $(".tcn-preview-avt").attr("src", event.target.result);
          }
          reader.readAsDataURL(file);
        }
    });

    //Cập nhật thông tin sinh viên
    $(".tcn-btn-save").click(function(e){
        let name = $(".tcn-input-name").val();
        let lop = $(".tcn-input-class").val();
        let khoa = $(".tcn-input-khoa").val();

        let dataform = new FormData();
        dataform.append("name", name);
        dataform.append("lop", lop);
        dataform.append("khoa", khoa);
        let avt = $("#tcn-input-avt")[0].files;
        if (avt.length > 0) {
            for (let i = 0; i < avt.length; i++) {
                dataform.append("avtfile[]", document.getElementById("tcn-input-avt").files[i]);
            }
        }

        let errorContent = "";

        if(khoa == ""){
            errorContent = "Khoa không được để trống!";
        }

        if(lop == ""){
            errorContent = "Lớp không được để trống!";
        }

        if(name == ""){
            errorContent = "Tên không được để trống!";
        }

        if(!errorContent){
            $.ajax({
                type: 'POST',
                url: '/capnhatthongtincanhan',
                cache: false,
                contentType: false,
                processData: false,
                data: dataform,
                enctype: 'multipart/form-data',
                success: function(data) {
                    $(".tcn-box-error").html(`<p class="tcn-success">Cập nhật thông tin thành công</p>`);
                },
                error: function(e) {
                    $(".tcn-box-error").html(`<p class="tcn-error">Cập nhật thông tin không thành công</p>`);
                }

            })
        }else{
            $(".tcn-box-error").empty();
            $(".tcn-box-error").html(`<p class="tcn-error">${errorContent}</p>`);

        }
    });

    //Button up bai viet tren form modal
    $(".btn-up-post").click(function(e){
        let action = $(this).attr("data-action");
        let type = $(this).attr("data-type");
        let idpost = $(this).attr("data-idpost");
        if(action == "uppost"){
            if(type == "post"){
                upPost();
            }

            if(type == "youtube"){
                upPostYoutube();
            }
        }

        if(action == "editpost"){
            if(type == "post" && idpost != ""){
                editPost(idpost);
            }

            if(type == "youtube" && idpost != ""){
                editPostYoutube(idpost);
            }
        }

        $(".close-modal").click();
        $(`.dropdown-menu`).css("display", "none");
    });

    //Button xoa bai viet  tren form modal
    $(".button-delete-post").click(function(e){
        let idpost = $(this).attr("data-idpost");
        deletePort(idpost);
        $(".close-modal").click();
        $(`.dropdown-menu`).css("display", "none");
    });

    $('#ttb-loaithongbao').on('change', function (e) {
        let idphongkhoa =  $("#ttb-loaithongbao option:selected").val();
        let dataform = new FormData();
        dataform.append("idphongkhoa", idphongkhoa);
        $.ajax({
            type: "POST",
            url: "/thongbaotheokhoa",
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            success: function(data) {
                $(".item-box-full-thongbao").empty();
                data.thongbao.forEach((element, index) => {
                    index += 1;
                    if(index % 2 == 0){
                        $(".item-box-full-thongbao").append(`
                            <a href="/chitietthongbao/${element._id}">
                                <div class="item item-a">
                                    <p class="title-notification">${element.title}</p>
                                    <p class="content-notification content-notification-limit">${element.content}</p>
                                    <p class="khoa-time">[${element.namekhoa}] - ${element.time}</p>
                                </div>
                            </a>
                        `)
                    }else{
                        $(".item-box-full-thongbao").append(`
                            <a href="/chitietthongbao/${element._id}">
                                <div class="item item-b">
                                    <p class="title-notification">${element.title}</p>
                                    <p class="content-notification content-notification-limit">${element.content}</p>
                                    <p class="khoa-time">[${element.namekhoa}] - ${element.time}</p>
                                </div>
                            </a>
                        `)
                    }
                });


                $(".item-page").empty();
                for(let i = 1; i <= Number(data.page); i++){    
                    if(i==1){
                        $(".item-page").append(`  
                            <button class="page page-${i} active" onclick="loadThongBao('${idphongkhoa}', '${i}')">${i}</button>
                        `);                   
                    }else{
                        $(".item-page").append(`  
                            <button class="page page-${i}" onclick="loadThongBao('${idphongkhoa}', '${i}')">${i}</button>
                        `);  
                    }
                }
            },
            error: function() {
                alert("Tải thông báo không thành công!");
            }
        });
    });


    socket.on("thongbao", function (data) {
        $(".notification").prepend(`
            <a href="/chitietthongbao/${data.id}" class="tb-${data.id}">
                <div class="new-notification">
                    <p>${data.khoa} vừa có thông báo mới</p>
                    <p class="title">${data.title}</p>
                </div>
            </a>
        `);

        setTimeout(() => { $(`.tb-${data.id}`).remove() }, 10000);
    })
});


function openOrCloseSidebar(action){
    if(action == "open"){
        $("#home .sidebar").css("width", "250px");
        $("#home .root").css("margin-left", "250px");
        $("#home .root .hearder .avt-name").css("margin-right", "250px");
        $("#btn-close-open-sidebar").attr("onclick", "openOrCloseSidebar('close')");

    }else{
        $("#home .sidebar").css("width", "0px");
        $("#home .root").css("margin-left", "0px");
        $("#home .root .hearder .avt-name").css("margin-right", "0px");
        $("#btn-close-open-sidebar").attr("onclick", "openOrCloseSidebar('open')");

    }
}

function login(){
    let username = $('#input-username').val();
    let pass = $('#input-pass').val();
    $(".notification").empty();


    if(username == "" || pass == ""){
        $(".notification").append(`<p class="error">Vui lòng nhập đầy đủ thông tin đăng nhập!</p>`);
    }else{

        let dataform = new FormData();
        dataform.append("username", username);
        dataform.append("pass", pass);

        $.ajax({
            type: 'POST',
            url: '/loginbyusername',
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            enctype: 'multipart/form-data',
            success: function(data) {
                if(data.code == 400){
                    $(".notification").append(`<p class="error">Tài khoản hoặc mật khẩu không đúng!</p>`);
                }
                window.location.href = "/";
            },
            error: function(e) {
                console.log(e);
                $(".notification").append(`<p class="error">Vui lòng đăng nhập lại!</p>`);
            }

        })
    }
}

function loadPost(index){
    let dataform = new FormData();
    dataform.append("index", index); 
    $.ajax({
        type: 'POST',
        url: '/loadpost',
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        enctype: 'multipart/form-data',
        success: function(data) {
            data.datapost.forEach(element => {
                
                if(element.post.type == "post"){
                    if(element.chinhchu){
                        if(element.post.image != ""){
                            $( ".box-port" ).append(`
                                <div class="port post-${element.post._id}">
                                    <div class="avt-name-menu">
                                        <div class="avt-name">
                                            <div class="avt">
                                                <img src="/images/${element.user.avt}" alt="Avt">
                                            </div>
                                            <div class="name">
                                                <p><a href="/trangcanhan/${element.user._id}">${element.user.name}</a>  <span>${element.post.time}</span></p>
                                            </div>
                                        </div>
                                        <div class="menu">
                                            <button class="dropbtn" onclick="openOrCloseMenu('${element.post._id}')"><i class="fas fa-bars"></i></button>
                                            <div class="dropdown-menu dropdown-menu-${element.post._id}">
                                                <button onclick="getPostToEdit('${element.post._id}')">Chỉnh sửa</button>
                                                <button onclick="getPostToDelete('${element.post._id}')">Xoá</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="line"></div>
                                    <div class="contentport">
                                        <div class="content">
                                            <p class="contentpost-${element.post._id}">${element.post.content}</p>
                                            <div class="image imagepost-${element.post._id}">
                                                <a href="/images/${element.post.image}">
                                                    <img src="/images/${element.post.image}" alt="image port">
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="line"></div>
                                    <div class="interact">
                                        <div class="box-interact">
                                            <div class="box-like box-like-${element.post._id}" onclick="likePost('${element.post._id}')">
                                                <div class="like-count">
                                                    <p>${element.countLike}</p>
                                                </div>
                                                <div class="like-icon liked">
                                                    <i class="far fa-heart"></i>
                                                </div>
                                            </div>
                                            <div class="box-comment box-comment-${element.user.avt}" onclick="openFormComment('${element.post._id}')">
                                                <div class="comment-count">
                                                    <p>${element.countComment}</p>
                                                </div>
                                                <div class="comment-icon">
                                                    <i class="far fa-comment"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="comments comments-${element.post._id}">
                                        <div class="box-comments box-comments-${element.post._id}">
                                            
                                        </div>
                                        <div class="box-input-comments">
                                            <div class="avt">
                                                <img src="/images/${element.avt}" alt="AVT">
                                            </div>
                                            <div class="input-comment">
                                                <input class="input-comment-${element.post._id}" type="text" placeholder="Bình luận của bạn">
                                            </div>
                                            <div class="btn-send-comment">
                                                <button onclick="upComment('${element.post._id}')">
                                                    <p><i class="fas fa-paper-plane"></i></p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `);
                        }else{
                            $( ".box-port" ).append(`
                                <div class="port post-${element.post._id}">
                                    <div class="avt-name-menu">
                                        <div class="avt-name">
                                            <div class="avt">
                                                <img src="/images/${element.user.avt}" alt="Avt">
                                            </div>
                                            <div class="name">
                                                <p><a href="/trangcanhan/${element.user._id}">${element.user.name}</a>  <span>${element.post.time}</span></p>
                                            </div>
                                        </div>
                                        <div class="menu">
                                            <button class="dropbtn" onclick="openOrCloseMenu('${element.post._id}')"><i class="fas fa-bars"></i></button>
                                            <div class="dropdown-menu dropdown-menu-${element.post._id}">
                                                <button onclick="getPostToEdit('${element.post._id}')">Chỉnh sửa</button>
                                                <button onclick="getPostToDelete('${element.post._id}')">Xoá</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="line"></div>
                                    <div class="contentport">
                                        <div class="content">
                                            <p class="contentpost-${element.post._id}">${element.post.content}</p>
                                            <div class="image imagepost-${element.post._id}">
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div class="line"></div>
                                    <div class="interact">
                                        <div class="box-interact">
                                            <div class="box-like box-like-${element.post._id}" onclick="likePost('${element.post._id}')">
                                                <div class="like-count">
                                                    <p>${element.countLike}</p>
                                                </div>
                                                <div class="like-icon liked">
                                                    <i class="far fa-heart"></i>
                                                </div>
                                            </div>
                                            <div class="box-comment box-comment-${element.user.avt}" onclick="openFormComment('${element.post._id}')">
                                                <div class="comment-count">
                                                    <p>${element.countComment}</p>
                                                </div>
                                                <div class="comment-icon">
                                                    <i class="far fa-comment"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="comments comments-${element.post._id}">
                                        <div class="box-comments box-comments-${element.post._id}">
                                            
                                        </div>
                                        <div class="box-input-comments">
                                            <div class="avt">
                                                <img src="/images/${element.avt}" alt="AVT">
                                            </div>
                                            <div class="input-comment">
                                                <input class="input-comment-${element.post._id}" type="text" placeholder="Bình luận của bạn">
                                            </div>
                                            <div class="btn-send-comment">
                                                <button onclick="upComment('${element.post._id}')">
                                                    <p><i class="fas fa-paper-plane"></i></p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `);
                        }
                    }else{
                        if(element.post.image != ""){
                            $( ".box-port" ).append(`
                                <div class="port post-${element.post._id}">
                                    <div class="avt-name-menu">
                                        <div class="avt-name">
                                            <div class="avt">
                                                <img src="/images/${element.user.avt}" alt="Avt">
                                            </div>
                                            <div class="name">
                                                <p><a href="/trangcanhan/${element.user._id}">${element.user.name}</a>  <span>${element.post.time}</span></p>
                                            </div>
                                        </div>
                                        <div class="menu">
                                           
                                        </div>
                                    </div>
                                    <div class="line"></div>
                                    <div class="contentport">
                                        <div class="content">
                                            <p class="contentpost-${element.post._id}">${element.post.content}</p>
                                            <div class="image imagepost-${element.post._id}">
                                                <a href="/images/${element.post.image}">
                                                    <img src="/images/${element.post.image}" alt="image port">
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="line"></div>
                                    <div class="interact">
                                        <div class="box-interact">
                                            <div class="box-like box-like-${element.post._id}" onclick="likePost('${element.post._id}')">
                                                <div class="like-count">
                                                    <p>${element.countLike}</p>
                                                </div>
                                                <div class="like-icon liked">
                                                    <i class="far fa-heart"></i>
                                                </div>
                                            </div>
                                            <div class="box-comment box-comment-${element.user.avt}" onclick="openFormComment('${element.post._id}')">
                                                <div class="comment-count">
                                                    <p>${element.countComment}</p>
                                                </div>
                                                <div class="comment-icon">
                                                    <i class="far fa-comment"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="comments comments-${element.post._id}">
                                        <div class="box-comments box-comments-${element.post._id}">
                                            
                                        </div>
                                        <div class="box-input-comments">
                                            <div class="avt">
                                                <img src="/images/${element.avt}" alt="AVT">
                                            </div>
                                            <div class="input-comment">
                                                <input class="input-comment-${element.post._id}" type="text" placeholder="Bình luận của bạn">
                                            </div>
                                            <div class="btn-send-comment">
                                                <button onclick="upComment('${element.post._id}')">
                                                    <p><i class="fas fa-paper-plane"></i></p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `);
                        }else{
                            console.log(element);
                            $( ".box-port" ).append(`
                            <div class="port post-${element.post._id}">
                                <div class="avt-name-menu">
                                    <div class="avt-name">
                                        <div class="avt">
                                            <img src="/images/${element.user.avt}" alt="Avt">
                                        </div>
                                        <div class="name">
                                            <p><a href="/trangcanhan/${element.user._id}">${element.user.name}</a>  <span>${element.post.time}</span></p>
                                        </div>
                                    </div>
                                    <div class="menu">
                                       
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="contentport">
                                    <div class="content">
                                        <p class="contentpost-${element.post._id}">${element.post.content}</p>
                                        <div class="image imagepost-${element.post._id}">
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="interact">
                                    <div class="box-interact">
                                        <div class="box-like box-like-${element.post._id}" onclick="likePost('${element.post._id}')">
                                            <div class="like-count">
                                                <p>${element.countLike}</p>
                                            </div>
                                            <div class="like-icon liked">
                                                <i class="far fa-heart"></i>
                                            </div>
                                        </div>
                                        <div class="box-comment box-comment-${element.user.avt}" onclick="openFormComment('${element.post._id}')">
                                            <div class="comment-count">
                                                <p>${element.countComment}</p>
                                            </div>
                                            <div class="comment-icon">
                                                <i class="far fa-comment"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="comments comments-${element.post._id}">
                                    <div class="box-comments box-comments-${element.post._id}">
                                        
                                    </div>
                                    <div class="box-input-comments">
                                        <div class="avt">
                                            <img src="/images/${element.avt}" alt="AVT">
                                        </div>
                                        <div class="input-comment">
                                            <input class="input-comment-${element.post._id}" type="text" placeholder="Bình luận của bạn">
                                        </div>
                                        <div class="btn-send-comment">
                                            <button onclick="upComment('${element.post._id}')">
                                                <p><i class="fas fa-paper-plane"></i></p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `);
                        }
                    }
                }else{
                    if(element.chinhchu){
                        $( ".box-port" ).append(`
                            <div class="port post-${element.post._id}">
                                <div class="avt-name-menu">
                                    <div class="avt-name">
                                        <div class="avt">
                                            <img src="/images/${element.user.avt}" alt="Avt">
                                        </div>
                                        <div class="name">
                                            <p><a href="/trangcanhan/${element.user._id}">${element.user.name}</a>  <span>${element.post.time}</span></p>
                                        </div>
                                    </div>
                                    <div class="menu">
                                        <button class="dropbtn" onclick="openOrCloseMenu('${element.post._id}')"><i class="fas fa-bars"></i></button>
                                        <div class="dropdown-menu dropdown-menu-${element.post._id}">
                                            <button onclick="getPostToEdit('${element.post._id}')">Chỉnh sửa</button>
                                            <button onclick="getPostToDelete('${element.post._id}')">Xoá</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="contentport">
                                    <div class="content">
                                    <div class="post-youtube post-youtube-${element.post._id}">
                                    <iframe width="600" height="400" src="https://www.youtube.com/embed/${element.post.idyoutube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="interact">
                                    <div class="box-interact">
                                        <div class="box-like box-like-${element.post._id}" onclick="likePost('${element.post._id}')">
                                            <div class="like-count">
                                                <p>${element.countLike}</p>
                                            </div>
                                            <div class="like-icon liked">
                                                <i class="far fa-heart"></i>
                                            </div>
                                        </div>
                                        <div class="box-comment box-comment-${element.user.avt}" onclick="openFormComment('${element.post._id}')">
                                            <div class="comment-count">
                                                <p>${element.countComment}</p>
                                            </div>
                                            <div class="comment-icon">
                                                <i class="far fa-comment"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="comments comments-${element.post._id}">
                                    <div class="box-comments box-comments-${element.post._id}">
                                        
                                    </div>
                                    <div class="box-input-comments">
                                        <div class="avt">
                                            <img src="/images/${element.avt}" alt="AVT">
                                        </div>
                                        <div class="input-comment">
                                            <input class="input-comment-${element.post._id}" type="text" placeholder="Bình luận của bạn">
                                        </div>
                                        <div class="btn-send-comment">
                                            <button onclick="upComment('${element.post._id}')">
                                                <p><i class="fas fa-paper-plane"></i></p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `);
                    }else{
                        $( ".box-port" ).append(`
                            <div class="port post-${element.post._id}">
                                <div class="avt-name-menu">
                                    <div class="avt-name">
                                        <div class="avt">
                                            <img src="/images/${element.user.avt}" alt="Avt">
                                        </div>
                                        <div class="name">
                                            <p><a href="/trangcanhan/${element.user._id}">${element.user.name}</a>  <span>${element.post.time}</span></p>
                                        </div>
                                    </div>
                                    <div class="menu">
                                        
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="contentport">
                                    <div class="content">
                                    <div class="post-youtube post-youtube-${element.post._id}">
                                    <iframe width="600" height="400" src="https://www.youtube.com/embed/${element.post.idyoutube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="interact">
                                    <div class="box-interact">
                                        <div class="box-like box-like-${element.post._id}" onclick="likePost('${element.post._id}')">
                                            <div class="like-count">
                                                <p>${element.countLike}</p>
                                            </div>
                                            <div class="like-icon liked">
                                                <i class="far fa-heart"></i>
                                            </div>
                                        </div>
                                        <div class="box-comment box-comment-${element.user.avt}" onclick="openFormComment('${element.post._id}')">
                                            <div class="comment-count">
                                                <p>${element.countComment}</p>
                                            </div>
                                            <div class="comment-icon">
                                                <i class="far fa-comment"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="comments comments-${element.post._id}">
                                    <div class="box-comments box-comments-${element.post._id}">
                                        
                                    </div>
                                    <div class="box-input-comments">
                                        <div class="avt">
                                            <img src="/images/${element.avt}" alt="AVT">
                                        </div>
                                        <div class="input-comment">
                                            <input class="input-comment-${element.post._id}" type="text" placeholder="Bình luận của bạn">
                                        </div>
                                        <div class="btn-send-comment">
                                            <button onclick="upComment('${element.post._id}')">
                                                <p><i class="fas fa-paper-plane"></i></p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `);
                    }
                }
            });
           

            if(data.datapost.length == 0){
                $("body").attr("data-action", "stop");
                $( ".box-port" ).append(`Đã hết bài đăng`);

            }else{
                $("body").attr("data-index", Number(index)+1); 
                $("body").attr("data-action", "load");
            }
        },
        error: function(e) {
            alert("Chỉnh sửa bài viết không thành công");
        }

    })
}


function getIdYoutube(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function upPost(){
    let content = $(".textarea-content").val();
    let image = $("#input-image-post")[0].files;

    if(content != "" || image.length > 0){
        let dataform = new FormData();
        dataform.append("content", content); 
        if(image.length > 0){
            dataform.append("image[]", document.getElementById("input-image-post").files[0]);
        }

        $.ajax({
            type: 'POST',
            url: '/uppost',
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            enctype: 'multipart/form-data',
            success: function(data) {
                console.log(data); 	
                if(data.post.image != ''){
                    $( ".box-port" ).prepend(`
                        <div class="port post-${data.post._id}">
                            <div class="avt-name-menu">
                                <div class="avt-name">
                                    <div class="avt">
                                        <img src="/images/${data.user.avt}" alt="Avt">
                                    </div>
                                    <div class="name">
                                        <p><a href="/trangcanhan/${data.user._id}">${data.user.name}</a>  <span>${data.post.time}</span></p>
                                    </div>
                                </div>
                                <div class="menu">
                                    <button class="dropbtn" onclick="openOrCloseMenu('${data.post._id}')"><i class="fas fa-bars"></i></button>
                                    <div class="dropdown-menu dropdown-menu-${data.post._id}">
                                        <button onclick="getPostToEdit('${data.post._id}')">Chỉnh sửa</button>
                                        <button onclick="getPostToDelete('${data.post._id}')">Xoá</button>
                                    </div>
                                </div>
                            </div>
                            <div class="line"></div>
                            <div class="contentport">
                                <div class="content">
                                    <p class="contentpost-${data.post._id}">${data.post.content}</p>
                                    <div class="image imagepost-${data.post._id}">
                                        <a href="/images/${data.post.image}">
                                            <img src="/images/${data.post.image}" alt="image port">
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="line"></div>
                            <div class="interact">
                                <div class="box-interact">
                                    <div class="box-like box-like-${data.post._id}" onclick="likePost('${data.post._id}')">
                                        <div class="like-count">
                                            <p>0</p>
                                        </div>
                                        <div class="like-icon liked">
                                            <i class="far fa-heart"></i>
                                        </div>
                                    </div>
                                    <div class="box-comment box-comment-${data.user.avt}" onclick="openFormComment('${data.post._id}')">
                                        <div class="comment-count">
                                            <p>0</p>
                                        </div>
                                        <div class="comment-icon">
                                            <i class="far fa-comment"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="comments comments-${data.post._id}">
                                <div class="box-comments box-comments-${data.post._id}">
                                    
                                </div>
                                <div class="box-input-comments">
                                    <div class="avt">
                                        <img src="/images/${data.user.avt}" alt="AVT">
                                    </div>
                                    <div class="input-comment">
                                        <input class="input-comment-${data.post._id}" type="text" placeholder="Bình luận của bạn">
                                    </div>
                                    <div class="btn-send-comment">
                                        <button onclick="upComment('${data.post._id}')">
                                            <p><i class="fas fa-paper-plane"></i></p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                }else{
                    $( ".box-port" ).prepend(`
                        <div class="port post-${data.post._id}">
                            <div class="avt-name-menu">
                                <div class="avt-name">
                                    <div class="avt">
                                        <img src="/images/${data.user.avt}" alt="Avt">
                                    </div>
                                    <div class="name">
                                        <p><a href="/trangcanhan/${data.user._id}">${data.user.name}</a>  <span>${data.post.time}</span></p>
                                    </div>
                                </div>
                                <div class="menu">
                                    <button class="dropbtn" onclick="openOrCloseMenu('${data.post._id}')"><i class="fas fa-bars"></i></button>
                                    <div class="dropdown-menu dropdown-menu-${data.post._id}">
                                        <button onclick="getPostToEdit('${data.post._id}')">Chỉnh sửa</button>
                                        <button onclick="getPostToDelete('${data.post._id}')">Xoá</button>
                                    </div>
                                </div>
                            </div>
                            <div class="line"></div>
                            <div class="contentport">
                                <div class="content">
                                    <p class="contentpost-${data.post._id}">${data.post.content}</p>
                                    <div class="image imagepost-${data.post._id}">
                                    </div>
                                </div>
                            </div>
                            <div class="line"></div>
                            <div class="interact">
                                <div class="box-interact">
                                    <div class="box-like box-like-${data.post._id}" onclick="likePost('${data.post._id}')">
                                        <div class="like-count">
                                            <p>0</p>
                                        </div>
                                        <div class="like-icon liked">
                                            <i class="far fa-heart"></i>
                                        </div>
                                    </div>
                                    <div class="box-comment box-comment-${data.user.avt}" onclick="openFormComment('${data.post._id}')">
                                        <div class="comment-count">
                                            <p>0</p>
                                        </div>
                                        <div class="comment-icon">
                                            <i class="far fa-comment"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="comments comments-${data.post._id}">
                                <div class="box-comments box-comments-${data.post._id}">
                                    
                                </div>
                                <div class="box-input-comments">
                                    <div class="avt">
                                        <img src="/images/${data.user.avt}" alt="AVT">
                                    </div>
                                    <div class="input-comment">
                                        <input class="input-comment-${data.post._id}" type="text" placeholder="Bình luận của bạn">
                                    </div>
                                    <div class="btn-send-comment">
                                        <button onclick="upComment('${data.post._id}')">
                                            <p><i class="fas fa-paper-plane"></i></p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                }

            },
            error: function(e) {
                alert("Tải bài viết không thành công");
            }

        })

    }else{
        $(".textarea-content").focus();
    }
}


function editPost(idpost){
    let content = $(".textarea-content").val();
    let image = $("#input-image-post")[0].files;

    if(content != "" || image.length > 0){
        let dataform = new FormData();
        dataform.append("idpost", idpost);
        dataform.append("content", content); 
        if(image.length > 0){
            dataform.append("image[]", document.getElementById("input-image-post").files[0]);
        }

        $.ajax({
            type: 'POST',
            url: '/editpost',
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            enctype: 'multipart/form-data',
            success: function(data) {
                $(`.contentpost-${data._id}`).text(data.content);

                if(data.image){
                    $(`.imagepost-${data._id}`).html(`
                        <a href="/images/${data.image}">
                            <img src="/images/${data.image}" alt="image port">
                        </a>
                    `);
                }
            },
            error: function(e) {
                alert("Chỉnh sửa bài viết không thành công");
            }

        })

    }else{
        $(".textarea-content").focus();
    }
}


function deletePort(idpost){
    let dataform = new FormData();
    dataform.append("idpost", idpost);
    $.ajax({
        type: "POST",
        url: "/deletepost",
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            $(`.post-${idpost}`).remove();
            alert("Xoá bài viết thành công!");
        },
        error: function() {
            alert("Không thể xoá bài viết!");
        }
    });
}


function upPostYoutube(){
    let link = $(".input-linkyoutube").val();
    let idyoutube = getIdYoutube(link);
    let dataform = new FormData();
    dataform.append("idyoutube", idyoutube);
    $.ajax({
        type: "POST",
        url: "/uppostyoutube",
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            $( ".box-port" ).prepend(`
                <div class="port post-${data.post._id}">
                    <div class="avt-name-menu">
                        <div class="avt-name">
                            <div class="avt">
                                <img src="/images/${data.user.avt}" alt="Avt">
                            </div>
                            <div class="name">
                                <p><a href="/trangcanhan/${data.user._id}">${data.user.name}</a>  <span>${data.post.time}</span></p>
                            </div>
                        </div>
                        <div class="menu">
                            <button class="dropbtn" onclick="openOrCloseMenu('${data.post._id}')"><i class="fas fa-bars"></i></button>
                            <div class="dropdown-menu dropdown-menu-${data.post._id}">
                                <button onclick="getPostToEdit('${data.post._id}')">Chỉnh sửa</button>
                                <button onclick="getPostToDelete('${data.post._id}')">Xoá</button>
                            </div>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="contentport">
                        <div class="content">
                            <div class="post-youtube post-youtube-${data.post._id}">
                                <iframe width="600" height="400" src="https://www.youtube.com/embed/${data.post.idyoutube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="interact">
                        <div class="box-interact">
                            <div class="box-like box-like-${data.post._id}" onclick="likePost('${data.post._id}')">
                                <div class="like-count">
                                    <p>0</p>
                                </div>
                                <div class="like-icon liked">
                                    <i class="far fa-heart"></i>
                                </div>
                            </div>
                            <div class="box-comment box-comment-${data.user.avt}" onclick="openFormComment('${data.post._id}')">
                                <div class="comment-count">
                                    <p>0</p>
                                </div>
                                <div class="comment-icon">
                                    <i class="far fa-comment"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="comments comments-${data.post._id}">
                        <div class="box-comments box-comments-${data.post._id}">
                            
                        </div>
                        <div class="box-input-comments">
                            <div class="avt">
                                <img src="/images/${data.user.avt}" alt="AVT">
                            </div>
                            <div class="input-comment">
                                <input class="input-comment-${data.post._id}" type="text" placeholder="Bình luận của bạn">
                            </div>
                            <div class="btn-send-comment">
                                <button onclick="upComment('${data.post._id}')">
                                    <p><i class="fas fa-paper-plane"></i></p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        },
        error: function() {
            alert("Đăng bài viết không thành công");
        }
    });
}

function editPostYoutube(idpost){
    let link = $(".input-linkyoutube").val();
    let idyoutube = getIdYoutube(link);
    let dataform = new FormData();
    dataform.append("idpost", idpost);
    dataform.append("idyoutube", idyoutube);
    $.ajax({
        type: "POST",
        url: "/editpostyoutube",
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            alert("Chỉnh sửa bài viết thành công");
        },
        error: function() {
            alert("Chỉnh sửa bài viết không thành công");
        }
    });
}



function openOrCloseMenu(id){
    let display = $(`.dropdown-menu-${id}`).css("display");
    if(display == "block"){
        $(`.dropdown-menu-${id}`).css("display", "none");
    }else{
        $(`.dropdown-menu`).css("display", "none");
        $(`.dropdown-menu-${id}`).css("display", "block");
    }
}

function getPostToEdit(idpost){
    let dataform = new FormData();
    dataform.append("idpost", idpost);
    $.ajax({
        type: "POST",
        url: "/getpost",
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            if(data.idyoutube == ""){
                $(".modal").css("display", "block");
                $(".avt-name").css("display", "flex");
                $(".inputcontent").css("display", "flex");
                $(".review-image").css("display", "block");
                $(".inputimage").css("display", "block");
                $(".button-port").css("display", "block");
                $(".modal-create-post").css("display", "block");
                $(".textarea-content").focus();
                $(".btn-up-post").attr("data-action", "uppost");

                $(".textarea-content").val(data.content);
                if(data.image){
                    $(".review-image").html(`<img class="preview-image" src="/images/${data.image}" alt="">`)
                }
                $(".textarea-content").focus();

                $(".btn-up-post").attr("data-action", "editpost");
                $(".btn-up-post").attr("data-type", "post");
                $(".btn-up-post").attr("data-idpost", `${idpost}`);
            }else{
                $(".modal").css("display", "block");
                $(".avt-name").css("display", "flex");
                $(".reviewyoutube").css("display", "flex");
                $(".inputlinkyoutube").css("display", "block");
                $(".button-port").css("display", "block");
                $(".input-linkyoutube").val(`https://youtu.be/${data.idyoutube}`);
                $(".inputlinkyoutube input").focus();   
                $(".reviewyoutube").html(`<iframe src="https://www.youtube.com/embed/${data.idyoutube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
                $(".btn-up-post").attr("data-action", "editpost");
                $(".btn-up-post").attr("data-type", "youtube");
                $(".btn-up-post").attr("data-idpost", `${idpost}`);
            }
        },
        error: function() {
            alert("Error");
        }
    });
}




function getPostToDelete(idpost){
    $(".modal").css("display", "block");
    $(".avt-name").css("display", "flex");
    $(".button-delete").css("display", "block");
    $(".delete-post").css("display", "block");
    $(".button-delete-post").attr("data-idpost", `${idpost}`);
}



//like va dislike
function likePost(idpost){
    let dataform = new FormData();
    dataform.append("idpost", idpost);
    $.ajax({
        type: "POST",
        url: "/likepost",
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            if(data.action == "like"){
                $(`.box-like-${idpost} .like-count p`).text(data.countlike);
                $(`.box-like-${idpost} .like-icon`).html(`<i class="fas fa-heart"></i>`);
            }else{
                $(`.box-like-${idpost} .like-count p`).text(data.countlike);
                $(`.box-like-${idpost} .like-icon`).html(`<i class="far fa-heart"></i>`);

            }
        },
        error: function() {
            alert("Tương tác bài viết không thành công!");
        }
    });
}

function openFormComment(idpost){
    let cssDisplay = $(`.comments-${idpost}`).css("display");
    if(cssDisplay == "none"){
        $(`.comments-${idpost}`).css("display", "block");


        let dataform = new FormData();
        dataform.append("idpost", idpost);
        $.ajax({
            type: "POST",
            url: "/loadcomment",
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            success: function(data) {
                data.comments.forEach(element => {
                    if(data.iduser == data.iduserpost || data.iduser == element.user._id){
                        $(`.box-comments-${idpost}`).append(`
                            <div class="item item-comments-${element.comment._id}">
                                <div class="avt">
                                    <img src="/images/${element.user.avt}" alt="Avt">
                                </div>
                                <div class="name-content">
                                    <p class="name">${element.user.name}
                                        <span>${element.comment.time}</span>
                                    </p>
                                    <p class="content">
                                        ${element.comment.content}
                                        <span onclick="deleteComment('${element.comment._id}')">Xoá</span>
                                    </p>
                                </div>
                            </div>
                        `);
                    }else{
                        $(`.box-comments-${idpost}`).append(`
                            <div class="item item-comments-${element.comment._id}">
                                <div class="avt">
                                    <img src="/images/${element.user.avt}" alt="Avt">
                                </div>
                                <div class="name-content">
                                    <p class="name">${element.user.name}
                                        <span>${element.comment.time}</span>
                                    </p>
                                    <p class="content">
                                        ${element.comment.content}
                                    </p>
                                </div>
                            </div>
                        `);
                    }
                });

            },
            error: function() {
                alert("Tải bình luận bài viết không thành công!");
            }
        });

    }else{
        $(`.comments-${idpost}`).css("display", "none");
        $(`.box-comments-${idpost}`).empty();

    }
}


function upComment(idpost){
    let content = $(`.input-comment-${idpost}`).val();
    $(`.input-comment-${idpost}`).val("");
    if(content){
        let dataform = new FormData();
        dataform.append("idpost", idpost);
        dataform.append("content", content);
        $.ajax({
            type: "POST",
            url: "/upcomment",
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            success: function(data) {
                $(`.box-comments-${idpost}`).append(`
                    <div class="item item-comments-${data.comment._id}">
                        <div class="avt">
                            <img src="/images/${data.user.avt}" alt="Avt">
                        </div>
                        <div class="name-content">
                            <p class="name">${data.user.name}
                                <span>${data.comment.time}</span>
                            </p>
                            <p class="content">
                                ${data.comment.content}
                                <span onclick="deleteComment('${data.comment._id}')">Xoá</span>
                            </p>
                        </div>
                    </div>
                `);

                $(`.box-comment-${idpost} .comment-count p`).text(data.countComment);

            },
            error: function() {
                alert("Bình luận bài viết không thành công!");
            }
        });
    }
}

function deleteComment(idcomment){
    let dataform = new FormData();
    dataform.append("idcomment", idcomment);
    $.ajax({
        type: "POST",
        url: "/deletecomment",
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            $(`.item-comments-${idcomment}`).remove();
        },
        error: function() {
            alert("Xoá bình luận không thành công!");
        }
    });
}


function loadSlideBar(){
    let chucvu = $(".sidebar").attr("data-chucvu");
    if(chucvu == "sinhvien"){
        $(".box-item-slidebar").empty();
        $(".box-item-slidebar").append(`
            <a href="/">
                <div class="itemlink linkhome">
                    <p><i class="fas fa-home"></i> Trang chủ</p>
                </div>
            </a>

            <a href="/trangthongtincanhan">
                <div class="itemlink linkinfo">
                    <p><i class="fas fa-pen"></i> Thông tin cá nhân</p>
                </div>
            </a>

            <a href="/trangthongbao">
                <div class="itemlink linknotification">
                    <p><i class="fas fa-bell"></i> Thông báo</p>
                </div>
            </a>

            <a href="/logout">
                <div class="itemlink linklogout">
                    <p><i class="fas fa-sign-out-alt"></i> Đăng xuất</p>
                </div>
            </a>

        `);
    }

    if(chucvu == "admin"){
        $(".box-item-slidebar").empty();
        $(".box-item-slidebar").append(`
            <a href="/">
                <div class="itemlink linkhome">
                    <p><i class="fas fa-home"></i> Trang chủ</p>
                </div>
            </a>
            <!---->
            <a href="/trangthongbao">
                <div class="itemlink linknotification">
                    <p><i class="fas fa-bell"></i> Thông báo</p>
                </div>
            </a>
            <!---->
            <a href="/nguoidung">
                <div class="itemlink linkuser">
                    <p><i class="fas fa-users"></i> Người dùng</p>
                </div>
            </a>
            <!---->
            <a href="/trangdoimatkhau">
                <div class="itemlink linkchangepassword
        ">
                    <p><i class="fas fa-key"></i> Đổi mật khẩu</p>
                </div>
            </a>
            <!---->
            <a href="/logout">
                <div class="itemlink linklogout">
                    <p><i class="fas fa-sign-out-alt"></i> Đăng xuất</p>
                </div>
            </a>

        `);
    }

    if(chucvu == "phongkhoa"){
        $(".box-item-slidebar").empty();
        $(".box-item-slidebar").append(`
            <a href="/">
                <div class="itemlink linkhome">
                    <p><i class="fas fa-home"></i> Trang chủ</p>
                </div>
            </a>
            <!---->
            <a href="/trangthongbao">
                <div class="itemlink linknotification">
                    <p><i class="fas fa-bell"></i> Thông báo</p>
                </div>
            </a>
            <!---->
            <a href="/trangdoimatkhau">
                <div class="itemlink linkchangepassword
        ">
                    <p><i class="fas fa-key"></i> Đổi mật khẩu</p>
                </div>
            </a>
            <!---->
            <a href="/logout">
                <div class="itemlink linklogout">
                    <p><i class="fas fa-sign-out-alt"></i> Đăng xuất</p>
                </div>
            </a>

        `);
    }
}



function createUser(){
    let name = $(".tnd-name").val();
    let username = $(".tnd-username").val();
    let password = $(".tnd-password").val();
    let password2 = $(".tnd-password2").val();
    let phongkhoa = '';
    $.each($("input[name='tnd-phongkhoa']:checked"), function(){
        //favorite.push($(this).val());
        phongkhoa = phongkhoa + $(this).val() + " ";
    });

    let dataform = new FormData();
    dataform.append("name", name);
    dataform.append("username", username);
    dataform.append("password", password);
    dataform.append("phongkhoa", phongkhoa);


    if(name = '' || username == '' || password == '' || password2 == '' || phongkhoa == ''){
        $(".item-tnd-error").html(`
            <p class="error">
                Vui lòng nhập đầy đủ thông tin!
            </p>  
        `)
    }else{
        if(password != password2){
            $(".item-tnd-error").html(`
                <p class="error">
                    Xác nhận mật khẩu không chính xác!
                </p>  
            `)
        }else{
            $.ajax({
                type: "POST",
                url: "/themnguoidung",
                cache: false,
                contentType: false,
                processData: false,
                data: dataform,
                success: function(data) {
                    if(data.code == 404){
                        $(".item-tnd-error").html(`
                            <p class="error">
                                Tài khoản đã tồn tại!
                            </p>  
                        `)
                    }else{
                        alert("Thêm người dùng thành công!");
                        location.reload();
                    }
                },
                error: function() {
                    $(".item-tnd-error").html(`
                        <p class="error">
                            Thêm người dùng không thành công!
                        </p>  
                    `)
                }
            });
        }
    }
    
}

function doiMatKhau(){
    let oldpass = $(".dmk-input-oldpass").val();
    let newpass = $(".dmk-input-newpass").val();
    let newpass2 = $(".dmk-input-newpass2").val();

    if(oldpass == '' || newpass == '' || newpass2 == ''){
        $(".dmk-box-error").html(`
            <p class="dmk-error">Vui lòng nhập đầy đủ thông tin!</p>
        `)
    }else{
        if(newpass != newpass2){
            $(".dmk-box-error").html(`
                <p class="dmk-error">Xác nhận mật khẩu không chính xác!</p>
            `)
        }else{

            let dataform = new FormData();
            dataform.append("oldpass", oldpass);
            dataform.append("newpass", newpass);

            $.ajax({
                type: "POST",
                url: "/doimatkhau",
                cache: false,
                contentType: false,
                processData: false,
                data: dataform,
                success: function(data) {
                    if(data.code == 404){
                        $(".dmk-box-error").html(`
                            <p class="dmk-error">Mật khẩu củ không chính xác</p>
                        `)
                    }else{
                        $(".dmk-box-error").html(`
                            <p class="dmk-success">Đổi mật khẩu thành công!</p>
                        `)
                        $(".dmk-input-oldpass").val('');
                        $(".dmk-input-newpass").val('');
                        $(".dmk-input-newpass2").val('');
                    }
                },
                error: function() {
                    $(".dmk-box-error").html(`
                        <p class="dmk-error">Đổi mật khẩu không thành công!</p>
                    `)
                }
            });
        }
    }
    
}

function createThongBao(){
    let idphongkhoa = $("#ttb-input-phongkhoa").val();
    let title = $(".ttb-input-title").val();
    let content = $(".ttb-input-content").val();
    
    if(idphongkhoa == '' || title == '' || content == ''){
        $(".ttb-box-error").html(`
            <p class="ttb-error">Vui lòng nhập đầy đủ thông tin</p>
        `)
    }else{
        let dataform = new FormData();
        dataform.append("idphongkhoa", idphongkhoa);
        dataform.append("title", title);
        dataform.append("content", content);

        $.ajax({
            type: "POST",
            url: "/themthongbao",
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            success: function(data) {
                $(".close-ttb-modal").click();
                $(".ttb-input-title").val('');
                $(".ttb-input-content").val('');
                let socket = io();
                socket.emit('thongbao', {'id': data._id, 'khoa': data.namekhoa, 'title': data.title});
                location.reload();
            },
            error: function() {
                $(".ttb-box-error").html(`
                    <p class="ttb-error">Thêm thông báo không thành công</p>
                `)
            }
        });
    }
}

function loadThongBao(idphongkhoa, page){
    let dataform = new FormData();
    dataform.append("idphongkhoa", idphongkhoa);
    dataform.append("page", page);

    $.ajax({
        type: "POST",
        url: "/taithongbaophantrang",
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            $(".item-box-full-thongbao").empty();
            data.forEach((element, index) => {
                index += 1;
                if(index % 2 == 0){
                    $(".item-box-full-thongbao").append(`
                        <a href="/chitietthongbao/${element._id}">
                            <div class="item item-a">
                                <p class="title-notification">${element.title}</p>
                                <p class="content-notification content-notification-limit">${element.content}</p>
                                <p class="khoa-time">[${element.namekhoa}] - ${element.time}</p>
                            </div>
                        </a>
                    `)
                }else{
                    $(".item-box-full-thongbao").append(`
                        <a href="/chitietthongbao/${element._id}">
                            <div class="item item-b">
                                <p class="title-notification">${element.title}</p>
                                <p class="content-notification content-notification-limit">${element.content}</p>
                                <p class="khoa-time">[${element.namekhoa}] - ${element.time}</p>
                            </div>
                        </a>
                    `)
                }

                $(".page").removeClass('active');
                $(`.page-${page}`).addClass('active');
            });
        },
        error: function() {
            $(".ttb-box-error").html(`
                <p class="ttb-error">Tải thông báo không thành công</p>
            `)
        }
    });
}


function deleteThongBao(idthongbao){
    let dataform = new FormData();
    dataform.append("idthongbao", idthongbao);
    $.ajax({
        type: "POST",
        url: "/xoathongbao",
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            alert("Xoá thông báo thành công");
            window.location="/trangthongbao";
        },
        error: function() {
            alert("Xoá thông báo không thành công");
        }
    });
}


function updateThongBao(idthongbao){
    let dataform = new FormData();
    let title = $(".tcttb-input-title").val();
    let content = $(".tcttb-input-content").val();

    dataform.append("idthongbao", idthongbao);
    dataform.append("title", title);
    dataform.append("content", content);
    $.ajax({
        type: "POST",
        url: "/capnhatthongbao",
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            $(".close-tcttb-modal").click();
            $(".title-notification").html(title);
            $(".content-notification").html(content);
        },
        error: function() {
            alert("Cập nhật thông báo không thành công");
        }
    });
}




