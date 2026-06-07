var Mathutils = {
    normalize: function($value, $min, $max) {
        return ($value - $min) / ($max - $min);
    },
    interpolate: function($normValue, $min, $max) {
        return $min + ($max - $min) * $normValue;
    },
    map: function($value, $min1, $max1, $min2, $max2) {
        if ($value < $min1) {
            $value = $min1;
        }
        if ($value > $max1) {
            $value = $max1;
        }
        var res = this.interpolate(this.normalize($value, $min1, $max1), $min2, $max2);
        return res;
    }
};
var markers = [];


//Get window size
var ww = window.innerWidth,
  wh = window.innerHeight;

var composer, params = {
    exposure: 1.3,
    bloomStrength: .9,
    bloomThreshold: 0,
    bloomRadius: 0
  };

//Create a WebGL renderer
var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
  antialias: true,
  shadowMapEnabled: true,
  shadowMapType: THREE.PCFSoftShadowMap
});
renderer.setSize(ww, wh);

//Create an empty scene
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000308, 0, 80);
scene.background = new THREE.Color(0x000308);

var clock = new THREE.Clock();

//Create a perpsective camera
var cameraRotationProxyX = 3.14159;
var cameraRotationProxyY = 0;

var camera = new THREE.PerspectiveCamera(45, ww / wh, 0.001, 300);
camera.rotation.y = cameraRotationProxyX;
camera.rotation.z = cameraRotationProxyY;

//camera.position.z = 400;
var c = new THREE.Group();
c.position.z = 400;

c.add(camera);
scene.add(c);


//set up render pass
var renderScene = new THREE.RenderPass( scene, camera );
var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.renderToScreen = true;
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;
composer = new THREE.EffectComposer( renderer );
composer.setSize( window.innerWidth, window.innerHeight );
composer.addPass( renderScene );
composer.addPass( bloomPass );


//Array of points
var points = [
	[10, 89, 0],
	[50, 88, 10],
	[76, 139, 20],
	[126, 141, 12],
	[150, 112, 8],
	[157, 73, 0],
	[180, 44, 5],
	[207, 35, 10],
	[232, 36, 0]
];

var p1, p2;

//Convert the array of points into vertices
for (var i = 0; i < points.length; i++) {
  var x = points[i][0];
  var y = points[i][2];
  var z = points[i][1];
  points[i] = new THREE.Vector3(x, y, z);
}
//Create a path from the points
var path = new THREE.CatmullRomCurve3(points);
//path.curveType = 'catmullrom';
path.tension = .5;

//Create a new geometry with a different radius
var geometry = new THREE.TubeGeometry( path, 300, 4, 32, false );

var texture = new THREE.TextureLoader().load( 'assets/images/heic1424a.jpg', function ( texture ) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0.3 );
    texture.repeat.set( 2, 1 );

} );


// Procedural waveform bump texture replacing 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/waveform-bump3.jpg'
var mapHeight = (function() {
    var cvs = document.createElement('canvas');
    cvs.width = 512; cvs.height = 256;
    var ctx = cvs.getContext('2d');
    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, 512, 256);
    for (var row = 0; row < 32; row++) {
        ctx.beginPath();
        for (var x = 0; x <= 512; x += 2) {
            var freq = 0.035 + row * 0.003;
            var amp = 3 + (row % 6) * 1.5;
            var y = (row / 32) * 256
                + Math.sin(x * freq + row * 1.5) * amp
                + Math.sin(x * freq * 0.5 + row) * amp * 0.4;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        var bright = 100 + Math.floor((row % 4) * 45);
        ctx.strokeStyle = 'rgb('+bright+','+bright+','+bright+')';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    var tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.offset.set(0,0);
    tex.repeat.set(15,2);
    return tex;
}());

var material = new THREE.MeshPhongMaterial({
  side:THREE.BackSide,
  map: texture,
  shininess: 15,
  bumpMap: mapHeight,
  bumpScale: -.03,
  specular: 0x051520,
  emissive: 0x050f20,       // subtle glow so the nebula texture doesn't look flat
  emissiveIntensity: 0.25
});

//Create a mesh
var tube = new THREE.Mesh( geometry, material );
//tube.receiveShadows = true;
//Push the mesh into the scene
scene.add( tube );

//inner tube.=========================================

//Create a new geometry with a different radius
var geometry = new THREE.TubeGeometry( path, 150, 3.4, 32, false );
var geo = new THREE.EdgesGeometry( geometry );
//THREE.EdgesGeometry( geometry );

var mat = new THREE.LineBasicMaterial( {
  linewidth: 2,
  opacity: .08,
  transparent: 1
} );

var wireframe = new THREE.LineSegments( geo, mat );
scene.add( wireframe );

//-------------------------


//Create a point light in our scene
var light = new THREE.PointLight(0xffffff, .35, 4,0);
light.castShadow = true;
scene.add(light);


// ==============================================
// AMBIENT ELEMENTS
// ==============================================

// --- LAYER 1: NEBULA WISPS ---
var nebulaMeshes = [];
(function() {
  var wispDefs = [
    { x: -25, y:  18, z:  -30, size: 60, rz:  0.3, c0: 'rgba(40,80,160,0.15)',  c1: 'rgba(20,50,120,0.07)'  },
    { x:  35, y: -12, z:  -50, size: 80, rz: -0.4, c0: 'rgba(40,80,160,0.15)',  c1: 'rgba(20,50,120,0.07)'  },
    { x:  -8, y:  25, z:  -40, size: 70, rz:  0.6, c0: 'rgba(40,80,160,0.15)',  c1: 'rgba(20,50,120,0.07)'  },
    { x:  20, y:  10, z:  -35, size: 55, rz: -0.2, c0: 'rgba(60,40,140,0.12)',  c1: 'rgba(30,20,100,0.06)'  }
  ];
  wispDefs.forEach(function(w) {
    var cvs = document.createElement('canvas');
    cvs.width = 256; cvs.height = 256;
    var ctx = cvs.getContext('2d');
    var g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0,   w.c0);
    g.addColorStop(0.5, w.c1);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    var mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w.size, w.size),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(cvs),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 1
      })
    );
    mesh.position.set(w.x, w.y, w.z);
    mesh.rotation.z = w.rz;
    scene.add(mesh);
    nebulaMeshes.push(mesh);
  });
}());

// --- LAYER 2: STARDUST CLUSTERS ---
var cluster1, cluster2;
(function() {
  function makeCluster(cx, cy, cz, radius, count) {
    var geo = new THREE.Geometry();
    for (var i = 0; i < count; i++) {
      var theta = Math.random() * Math.PI * 2;
      var phi   = Math.acos(2 * Math.random() - 1);
      var r     = Math.random() * radius;
      geo.vertices.push(new THREE.Vector3(
        cx + r * Math.sin(phi) * Math.cos(theta),
        cy + r * Math.sin(phi) * Math.sin(theta),
        cz + r * Math.cos(phi)
      ));
    }
    return new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x8ab4f8,
      size: 0.12,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    }));
  }
  cluster1 = makeCluster(-15, 8, -20, 15, 150);
  cluster2 = makeCluster( 20,-10, -35, 12, 150);
  scene.add(cluster1);
  scene.add(cluster2);
}());

// --- LAYER 3: ENERGY MOTES ---
var orbs = [];
(function() {
  var cvs = document.createElement('canvas');
  cvs.width = 128; cvs.height = 128;
  var ctx = cvs.getContext('2d');
  var g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,    'rgba(255,255,255,1.0)');
  g.addColorStop(0.15, 'rgba(160,200,255,0.8)');
  g.addColorStop(0.45, 'rgba(80,140,255,0.3)');
  g.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  var glowTex = new THREE.CanvasTexture(cvs);

  var orbDefs = [
    { x: -15, y:  10, z: -15, scale: 3.5, baseOpacity: 0.35 },
    { x:  18, y:  -6, z: -22, scale: 2.2, baseOpacity: 0.28 },
    { x:  -6, y: -16, z: -18, scale: 1.6, baseOpacity: 0.40 },
    { x:  24, y:  12, z: -30, scale: 3.0, baseOpacity: 0.32 },
    { x: -20, y:   4, z: -25, scale: 1.8, baseOpacity: 0.38 },
    { x:   8, y:  20, z: -20, scale: 1.4, baseOpacity: 0.25 },
    { x: -28, y:  -8, z: -28, scale: 3.8, baseOpacity: 0.30 }
  ];
  orbDefs.forEach(function(def) {
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: def.baseOpacity
    }));
    sprite.position.set(def.x, def.y, def.z);
    sprite.scale.set(def.scale, def.scale, 1);
    sprite.userData.baseOpacity = def.baseOpacity;
    scene.add(sprite);
    orbs.push(sprite);
  });
  console.log('Ambient elements added:', nebulaMeshes.length, 'wisps,', '2 clusters,', orbs.length, 'orbs');
}());


function updateCameraPercentage(percentage) {
  p1 = path.getPointAt(percentage);
  p2 = path.getPointAt(percentage + 0.03);

  c.position.set(p1.x,p1.y,p1.z);
  c.lookAt(p2);
  light.position.set(p2.x, p2.y, p2.z);
}


var cameraTargetPercentage = 0;
var currentCameraPercentage = 0;



gsap.defaultEase = Linear.easeNone;

var tubePerc = {
  percent: 0
}

gsap.registerPlugin(ScrollTrigger);

var tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scrollTarget",
    start: "top top",
    end: "bottom 100%",
    scrub: 5
  }
})
tl.to(tubePerc, {
   percent:.96,
   ease: Linear.easeNone,
   duration: 10,
   onUpdate: function() {
     cameraTargetPercentage = tubePerc.percent;
   }
});

function render(){
  //texture.offset.x+=.004
  //texture2.needsUpdate = true;
  currentCameraPercentage = cameraTargetPercentage

  camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
  camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;

  updateCameraPercentage(currentCameraPercentage);

  //animate texture

  particleSystem1.rotation.y += 0.00002;
  particleSystem2.rotation.x += 0.00005;
  particleSystem3.rotation.z += 0.00001;

  // AMBIENT ELEMENTS — drift and pulse
  var ambTime = Date.now();
  cluster1.position.y = -20 + Math.sin(ambTime * 0.0003) * 3;
  cluster2.position.x =  20 + Math.cos(ambTime * 0.0002) * 2;
  orbs.forEach(function(orb, i) {
    var pulse = 0.85 + Math.sin(ambTime * 0.0008 + i * 1.2) * 0.15;
    orb.material.opacity = pulse * orb.userData.baseOpacity;
  });

  //Render the scene
  //renderer.render(scene, camera);
  composer.render();

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

$('canvas').click(function(){
  console.clear();
  markers.push(p1);
  console.log(JSON.stringify(markers));
});

window.addEventListener( 'resize', function () {

  var width = window.innerWidth;
  var height = window.innerHeight;

  camera.aspect = width / height;
	camera.updateProjectionMatrix();

  renderer.setSize( width, height );
  composer.setSize( width, height );

}, false );



var lastPlace = 0;
var newPlace = 0;



//particle system
// create the particle variables
//
// Procedural spikey particle texture replacing 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/spikey.png'
var spikeyTexture = (function() {
    var cvs = document.createElement('canvas');
    cvs.width = 64; cvs.height = 64;
    var ctx = cvs.getContext('2d');
    var g = ctx.createRadialGradient(32,32,0,32,32,32);
    g.addColorStop(0,   'rgba(255,255,255,1)');
    g.addColorStop(0.35,'rgba(255,255,255,0.5)');
    g.addColorStop(0.7, 'rgba(200,220,255,0.15)');
    g.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,64,64);
    return new THREE.CanvasTexture(cvs);
}());


var particleCount = 20000,
    particles1 = new THREE.Geometry(),
    particles2 = new THREE.Geometry(),
    particles3 = new THREE.Geometry(),
    pMaterial = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: .5,
      map: spikeyTexture,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

// now create the individual particles
for (var p = 0; p < particleCount; p++) {

  // create a particle with random
  // position values, -250 -> 250
  var pX = Math.random() * 600 - 300,
      pY = Math.random() * 80 - 40,
      pZ = Math.random() * 600 - 300,
      particle = new THREE.Vector3(pX, pY, pZ);

  // add it to the geometry
  particles1.vertices.push(particle);
}

// now create the individual particles
for (var p = 0; p < particleCount; p++) {

  // create a particle with random
  // position values, -250 -> 250
  var pX = Math.random() * 600,
      pY = Math.random() * 20 - 10,
      pZ = Math.random() * 600,
      particle = new THREE.Vector3(pX, pY, pZ);

  // add it to the geometry
  particles2.vertices.push(particle);
}

// now create the individual particles
for (var p = 0; p < particleCount; p++) {

  // create a particle with random
  // position values, -250 -> 250
  var pX = Math.random() * 600,
      pY = Math.random() * 20 - 10,
      pZ = Math.random() * 600,
      particle = new THREE.Vector3(pX, pY, pZ);

  // add it to the geometry
  particles3.vertices.push(particle);
}

// create the particle system
var particleSystem1 = new THREE.ParticleSystem(
    particles1,
    pMaterial);

var particleSystem2 = new THREE.ParticleSystem(
    particles2,
    pMaterial);

var particleSystem3 = new THREE.ParticleSystem(
    particles3,
    pMaterial);

// add it to the scene
scene.add(particleSystem1);
scene.add(particleSystem2);
scene.add(particleSystem3);


document.addEventListener('mousemove', function(evt) {
  cameraRotationProxyX = Mathutils.map(evt.clientX, 0, window.innerWidth, 3.24, 3.04);
  cameraRotationProxyY = Mathutils.map(evt.clientY, 0, window.innerHeight, -0.1, 0.1);
});

(function() {
  var introText = document.getElementById('intro-text');
  if (!introText) return;

  var currentScale = 1;
  var currentOpacity = 1;
  var targetScale = 1;
  var targetOpacity = 1;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function getProgress() {
    var scrollTop = window.scrollY;
    var totalHeight = document.querySelector('.scrollTarget').offsetHeight - window.innerHeight;
    console.log('scrollTop:', scrollTop, 'totalHeight:', totalHeight);
    return Math.min(scrollTop / totalHeight, 1);
  }

  function animateIntroText() {
    var progress = getProgress();

    if (progress <= 0.08) {
      var t = progress / 0.08;
      targetScale = 1 + t * 3;
      targetOpacity = t < 0.5 ? 1 : 1 - ((t - 0.5) / 0.5);
    } else {
      targetScale = 4;
      targetOpacity = 0;
    }

    // Lerp for smooth organic feel — 0.06 = slow/weighted
    currentScale = lerp(currentScale, targetScale, 0.06);
    currentOpacity = lerp(currentOpacity, targetOpacity, 0.06);

    introText.style.transform =
      'translate(-50%, -50%) scale(' + currentScale + ')';
    introText.style.opacity = currentOpacity;

    if (currentOpacity > 0.01) {
      introText.style.display = 'flex';
    } else {
      introText.style.display = 'none';
    }

    requestAnimationFrame(animateIntroText);
  }

  animateIntroText();
}());

(function() {
  var texts = [
    { el: document.getElementById('tunnel-text-1'), start: 0.18, end: 0.36 },
    { el: document.getElementById('tunnel-text-2'), start: 0.44, end: 0.58 },
    { el: document.getElementById('tunnel-text-3'), start: 0.70, end: 0.84 }
  ];

  // Initial state matches starting keyframe — speck, not a full-size element
  var states = texts.map(function() {
    return { currentScale: 0.008, currentOpacity: 0,
             targetScale: 0.008, targetOpacity: 0 };
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getProgress() {
    var scrollTop = window.scrollY;
    var totalHeight = document.querySelector('.scrollTarget').offsetHeight
                      - window.innerHeight;
    console.log('scrollTop:', scrollTop, 'totalHeight:', totalHeight);
    return Math.min(scrollTop / totalHeight, 1);
  }

  // Scale/opacity keyframes — t is normalised position within each text's window (0→1)
  var keyframes = [
    { t: 0.00, scale: 0.008, opacity: 0.0  },
    { t: 0.10, scale: 0.015, opacity: 0.15 },
    { t: 0.50, scale: 0.12,  opacity: 0.6  },
    { t: 0.80, scale: 1.0,   opacity: 1.0  },
    { t: 0.92, scale: 2.2,   opacity: 0.4  },
    { t: 1.00, scale: 3.8,   opacity: 0.0  }
  ];

  function mapKeyframes(t) {
    for (var k = 0; k < keyframes.length - 1; k++) {
      var a = keyframes[k];
      var b = keyframes[k + 1];
      if (t >= a.t && t <= b.t) {
        var seg = (t - a.t) / (b.t - a.t);
        return {
          scale:   a.scale   + (b.scale   - a.scale)   * seg,
          opacity: a.opacity + (b.opacity - a.opacity) * seg
        };
      }
    }
    return { scale: keyframes[keyframes.length - 1].scale,
             opacity: keyframes[keyframes.length - 1].opacity };
  }

  function animateTunnelTexts() {
    var progress = getProgress();

    texts.forEach(function(item, i) {
      if (!item.el) return;
      var s = states[i];
      var start = item.start;
      var end = item.end;

      if (progress >= start && progress <= end) {
        var t = (progress - start) / (end - start);
        var kf = mapKeyframes(t);
        s.targetScale = kf.scale;
        s.targetOpacity = kf.opacity;
      } else if (progress < start) {
        // Not reached yet — genuine speck in the distance
        s.targetScale = 0.008;
        s.targetOpacity = 0;
      } else {
        // Already passed — gone
        s.targetScale = 3.8;
        s.targetOpacity = 0;
      }

      s.currentScale   = lerp(s.currentScale,   s.targetScale,   0.035);
      s.currentOpacity = lerp(s.currentOpacity, s.targetOpacity, 0.035);

      if (s.currentOpacity > 0.005) {
        item.el.style.display = 'block';
        item.el.style.opacity = s.currentOpacity;
        // translate(-50%,-50%) always in the same string as scale — never separate
        item.el.style.transform =
          'translate(-50%, -50%) scale(' + s.currentScale + ')';
      } else {
        item.el.style.display = 'none';
      }
    });

    requestAnimationFrame(animateTunnelTexts);
  }

  animateTunnelTexts();
}());
