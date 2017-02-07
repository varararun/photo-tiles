var PhotoTiles = {
    config: {
        initialized: false,
        demoMode: false,
        container: ".photo-tiles-container",
        shouldPlay: true,
        transition: 2000,
        timerId: 0,
        photoListIndex: 0,
        photoList: [],
    },
    initialize: function (config) {
        if (PhotoTiles.config.initialized) {
            console.info("PhotoTiles already initialized.");
            return;
        }
        if (!config) {
            console.info("No configuration object was passed, checkout https://github.com/arvarghese/photo-tiles#customization for an example.");
            return;
        }
        PhotoTiles.config.container = config.selector || ".photo-tiles-container";
        PhotoTiles.config.shouldPlay = config.shouldPlay || true;
        PhotoTiles.config.transition = config.transition || 2000;
        PhotoTiles.config.photoList = config.photoList || [];
        PhotoTiles.config.demoMode = config.demoMode || false;
        if (!PhotoTiles.validateConfigs(config)) {
            console.info("PhotoTiles not initialized.");
            return;
        }
        if (config.demoMode) {
            PhotoTiles.config.photoList = [
                "assets/images/demo/demo-image-1.jpeg",
                "assets/images/demo/demo-image-2.jpeg",
                "assets/images/demo/demo-image-3.jpeg",
                "assets/images/demo/demo-image-4.jpeg",
                "assets/images/demo/demo-image-5.jpeg",
                "assets/images/demo/demo-image-6.jpeg",
                "assets/images/demo/demo-image-7.jpeg",
                "assets/images/demo/demo-image-8.jpeg",
                "assets/images/demo/demo-image-9.jpeg",
                "assets/images/demo/demo-image-10.jpeg"
            ];
        }
        PhotoTiles.buildTiles();
        PhotoTiles.loadTiles();
        PhotoTiles.loadEvents();
        PhotoTiles.config.initialized = true;
    },
    validateConfigs: function (config) {
        if (!document.querySelector(PhotoTiles.config.container)) {
            console.info("No container specified or container doesn't exist on the page with selector '" + PhotoTiles.config.container + "'.");
            return false;
        }
        if (PhotoTiles.config.photoList.length === 0 && !PhotoTiles.config.demoMode) {
            console.info("No photos specified, please initialize PhotoTiles with the attribute 'photoList' set to a list of photos.");
            return false;
        }
        return true;
    },
    buildTiles: function () {
        var container = document.querySelector(PhotoTiles.config.container);
        var tiles = document.createElement("div");
        tiles.className = "photo-tiles";
        var rowTop = document.createElement("div");
        rowTop.className = "photo-tiles-row";
        var rowBottom = document.createElement("div");
        rowBottom.className = "photo-tiles-row";
        tiles.appendChild(rowTop);
        tiles.appendChild(rowBottom);
        container.appendChild(tiles);
    },
    loadTiles: function () {
        Array.prototype.forEach.call(document.querySelectorAll(".photo-tiles-row"), function (tile) {
            var newPhoto, newPhotoSm, offset, newPhotoSmTop, newPhotoSmBottom;
            newPhoto = document.createElement("div");
            newPhoto.className = "photo left photo-lg";
            newPhoto.style.transform = "translateX(0px)";
            newPhoto.style["background-image"] = "url(" + PhotoTiles.getNextPhoto() + ")";
            tile.appendChild(newPhoto);
            newPhoto = document.createElement("div");
            newPhoto.className = "photo middle photo-sm";
            newPhotoSmTop = document.createElement("div");
            newPhotoSmTop.className = "photo-sm-dual";
            newPhotoSmBottom = document.createElement("div");
            newPhotoSmBottom.className = "photo-sm-dual";
            newPhoto.appendChild(newPhotoSmTop);
            newPhoto.appendChild(newPhotoSmBottom);
            tile.appendChild(newPhoto);
            offset = PhotoTiles.tileInfo.getLgWidth();
            newPhoto.style.transform = "translateX(" + offset + "px)";
            Array.prototype.forEach.call(newPhoto.children, function (smallTile) {
                smallTile.style["background-image"] = "url(" + PhotoTiles.getNextPhoto() + ")";
            });
            newPhoto = document.createElement("div");
            newPhoto.className = "photo right photo-lg";
            offset = PhotoTiles.tileInfo.getLgWidth() + PhotoTiles.tileInfo.getSmWidth();
            newPhoto.style.transform = "translateX(" + offset + "px)";
            newPhoto.style["background-image"] = "url(" + PhotoTiles.getNextPhoto() + ")";
            tile.appendChild(newPhoto);
        });
        setTimeout(function () {
            Array.prototype.forEach.call(document.querySelectorAll(".photo"), function (tile) {
                tile.classList.add("loaded");
            });
        }, 1000);
    },
    loadEvents: function () {
        if (PhotoTiles.config.shouldPlay) {
            PhotoTiles.loadTimer();
        }
        var offset;
        window.addEventListener("resize", function () {
            Array.prototype.forEach.call(document.querySelectorAll(".photo-tiles-row"), function (tile) {
                if (tile.querySelector(".left") && tile.querySelector(".left").classList.contains("photo-sm")) {
                    offset = PhotoTiles.tileInfo.getSmWidth();
                }
                else {
                    offset = PhotoTiles.tileInfo.getLgWidth();
                }
                tile.querySelector(".middle").style.transform = "translateX(" + offset + "px)";
                if (tile.querySelector(".right") && tile.querySelector(".right").classList.contains("photo-sm")) {
                    offset = PhotoTiles.tileInfo.getLgWidth() * 2;
                }
                else {
                    offset = PhotoTiles.tileInfo.getSmWidth() + PhotoTiles.tileInfo.getLgWidth();
                }
                tile.querySelector(".right").style.transform = "translateX(" + offset + "px)";
            });
        });
        PhotoTiles.loadKeyboardEvents();
    },
    loadTimer: function () {
        PhotoTiles.config.timerId = setInterval(function () {
            PhotoTiles.shiftPhotos();
        }, PhotoTiles.config.transition);
    },
    tagRandomPhotoForRemoval: function () {
        var photos = document.querySelectorAll(".photo:not(.remove)");
        if (photos.length < 2) {
            clearInterval(PhotoTiles.config.timerId);
        }
        var photo = photos[Math.floor(Math.random() * photos.length)];
        if (photo.classList.contains("left")) {
            photo.style.transform += "translateX(-100%)";
        }
        else if (photo.classList.contains("right")) {
            photo.style.transform += "translateX(100%)";
        }
        if (photo.classList.contains("middle")) {
            if (Array.prototype.indexOf.call(photo.parentElement.parentElement.children, photo.parentElement) === 0) {
                photo.style.transform += "translateY(-100%)";
            }
            else {
                photo.style.transform += "translateY(100%)";
            }
        }
        photo.classList.add("remove");
    },
    shiftPhotos: function () {
        var imgUrl = PhotoTiles.getNextPhoto();
        var img = new Image();
        img.onload = function () {
            PhotoTiles.tagRandomPhotoForRemoval();
            setTimeout(function () {
                PhotoTiles.adjustTiles();
                PhotoTiles.addPhoto(imgUrl);
            }, 300);
        };
        img.src = imgUrl;
    },
    addPhoto: function (imgUrl) {
        Array.prototype.forEach.call(document.querySelectorAll(".photo-tiles-row"), function (tile) {
            if (tile.querySelectorAll(".photo").length === 3) {
                return;
            }
            var newPhoto, offset;
            if (tile.querySelector(".photo-sm")) {
                newPhoto = document.createElement("div");
                newPhoto.className = "photo right photo-lg";
                offset = PhotoTiles.tileInfo.getSmWidth() + PhotoTiles.tileInfo.getLgWidth();
            }
            else {
                newPhoto = document.createElement("div");
                newPhoto.className = "photo right photo-sm";
                var newPhotoSmTop = document.createElement("div");
                newPhotoSmTop.className = "photo-sm-dual";
                var newPhotoSmBottom = document.createElement("div");
                newPhotoSmBottom.className = "photo-sm-dual";
                newPhoto.appendChild(newPhotoSmTop);
                newPhoto.appendChild(newPhotoSmBottom);
                offset = PhotoTiles.tileInfo.getLgWidth() * 2;
            }
            tile.appendChild(newPhoto);
            var startPosition = window.innerWidth;
            if (newPhoto.classList.contains("photo-sm")) {
                newPhoto.style.transform = "translateX(" + startPosition + "px)";
                Array.prototype.forEach.call(tile.querySelectorAll(".photo-sm-dual"), function (tile) {
                    imgUrl = PhotoTiles.getNextPhoto();
                    tile.style["background-image"] = "url(" + imgUrl + ")";
                });
            }
            else {
                newPhoto.style.transition = "0s";
                newPhoto.style.transform = "translateX(" + startPosition + "px)";
                newPhoto.style["background-image"] = "url(" + imgUrl + ")";
            }
            setTimeout(function () {
                newPhoto.style.transition = ".5s ease-in-out";
                newPhoto.style.transform = "translateX(" + offset + "px)";
                newPhoto.classList.add("loaded");
            }, 200);
        });
    },
    adjustTiles: function () {
        var offset, photo;
        Array.prototype.forEach.call(document.querySelectorAll(".remove"), function (tile) {
            tile.parentNode.removeChild(tile);
        });
        Array.prototype.forEach.call(document.querySelectorAll(".photo-tiles-row"), function (tile) {
            if (!tile.querySelector(".left")) {
                if (tile.querySelector(".middle")) {
                    photo = tile.querySelector(".middle");
                    photo.style.transform = "translateX(0px)";
                    photo.classList.remove("middle");
                    photo.classList.add("left");
                    if (tile.querySelector(".right")) {
                        offset = tile.querySelector(".left").offsetWidth;
                        photo = tile.querySelector(".right");
                        photo.style.transform = "translateX(" + offset + "px)";
                        photo.classList.remove("right");
                        photo.classList.add("middle");
                    }
                }
                else {
                    if (tile.querySelector(".right")) {
                        tile.querySelector(".right").style.transform = "translateX(0px)";
                    }
                }
            }
            if (!tile.querySelector(".middle")) {
                if (tile.querySelector(".right")) {
                    offset = tile.querySelector(".left").offsetWidth;
                    photo = tile.querySelector(".right");
                    photo.style.transform = "translateX(" + offset + "px)";
                    photo.classList.remove("right");
                    photo.classList.add("middle");
                }
            }
        });
    },
    getNextPhoto: function () {
        if (PhotoTiles.config.photoListIndex >= PhotoTiles.config.photoList.length) {
            PhotoTiles.config.photoListIndex = 0;
        }
        return PhotoTiles.config.photoList[PhotoTiles.config.photoListIndex++];
    },
    toggleExecution: function () {
        PhotoTiles.config.shouldPlay = !PhotoTiles.config.shouldPlay;
        if (PhotoTiles.config.shouldPlay) {
            PhotoTiles.play();
        }
        else {
            PhotoTiles.pause();
        }
    },
    pause: function () {
        clearInterval(PhotoTiles.config.timerId);
    },
    play: function () {
        PhotoTiles.config.shouldPlay = true;
        PhotoTiles.loadTimer();
    },
    tileInfo: {
        getLgWidth: function () {
            if (!document.querySelector(".photo-lg")) {
                return 0;
            }
            return document.querySelector(".photo-lg").offsetWidth;
        },
        getSmWidth: function () {
            if (!document.querySelector(".photo-sm")) {
                return 0;
            }
            return document.querySelector(".photo-sm").offsetWidth;
        }
    },
    loadKeyboardEvents: function () {
        document.onkeydown = function (event) {
            switch (event.keyCode) {
                case 32:
                    PhotoTiles.toggleExecution();
                    break;
            }
        };
    },
    reset: function () {
        if (!PhotoTiles.config.initialized) {
            console.info("PhotoTiles cannot be reset as it has not been initialized yet.");
            return;
        }
        clearInterval(PhotoTiles.config.timerId);
        var container = document.querySelector(PhotoTiles.config.container);
        Array.prototype.forEach.call(document.querySelectorAll(".photo"), function (photo) {
            PhotoTiles.tagRandomPhotoForRemoval();
        });
        setTimeout(function () {
            Array.prototype.forEach.call(container.children, function (element) {
                element.parentNode.removeChild(element);
            });
            PhotoTiles.config = {
                initialized: false,
                demoMode: false,
                container: "",
                shouldPlay: true,
                transition: 0,
                timerId: 0,
                photoListIndex: 0,
                photoList: [],
            };
        }, 1000);
    }
};
