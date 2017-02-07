[![GitHub version](https://badge.fury.io/gh/arvarghese%2Fphoto-tiles.svg)](https://badge.fury.io/gh/arvarghese%2Fphoto-tiles)
[![Build Status](https://travis-ci.org/arvarghese/photo-tiles.svg?branch=master)](https://travis-ci.org/arvarghese/photo-tiles) 

# PhotoTiles

#### Photo Tiles, JS implementation of Mac's Photo Tiles Screensaver

### [Changelog](https://github.com/arvarghese/photo-tiles/wiki/Changelog)
### [Contribution Guidelines](https://github.com/arvarghese/photo-tiles/wiki/Contributing)  
### [Submitting Issues](https://github.com/arvarghese/photo-tiles/wiki/Issue-Template)  

### Run Demo on Your Machine
```bash
$ npm start
```  

### Install
```bash
$ bower install --save photo-tiles
```  

### Usage
~~~ javascript
<head> 
    ... 
    <!-- Bower -->
    <link rel="stylesheet" href="${BOWER_DIR}/photo-tiles/dist/css/photo-tiles.min.css">
</head>
<body>
...
<div class="photo-tiles-container"></div>
<!-- Bower -->
<script type="text/javascript" src="${BOWER_DIR}/photo-tiles/dist/js/photo-tiles-min.js"></script>
<script>
    PhotoTiles.initialize({
        demoMode: true
    });
</script>
</body>
~~~

### Customization
~~~ javascript
<script>
	PhotoTiles.initialize({
        // optional; true launches demo.  
        demoMode: false,
        // element used to generate the photo layout.            
        container: ".photo-tiles-container",
        // true = start animation on load.
        shouldPlay: true,
        // how long before images shift.
        transition: 2000,                        
        // list of img urls to use in the photo tiles container.
        photoList = [
            "assets/images/demo/demo-image-1.jpeg",
            "assets/images/demo/demo-image-2.jpeg"
            ...
        ]
	});
</script> 
~~~
