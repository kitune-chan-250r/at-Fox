
import Particles from 'react-particles-js';

export const Particle = () => {
    return(
        <div style={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            zIndex: 0
        }}>
            <Particles 
                params={{
                    "fps_limit": 28,
                    "particles": {
                        // "collisions": {
                        //     "enable": false
                        // },
                        "number": {
                            "value": 400,
                            "density": {
                                "enable": false
                            }
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 90,
                            "opacity": 0.4
                        },
                        "move": {
                            "speed": 2
                        },
                        "opacity": {
                            "anim": {
                                "enable": true,
                                "opacity_min": 0.05,
                                "speed": 30,
                                "sync": false
                            },
                            "value": 0.4
                        }
                    },
                    "polygon": {
                        "enable": true,
                        "scale": 1.8,
                        "type": "inline",
                        "move": {
                            "radius": 10
                        },
                        "url": "./fox.svg",
                        // "url": "./deer.svg",
                        "inline": {
                            "arrangement": "equidistant"
                        },
                        "draw": {
                            "enable": true,
                            "stroke": {
                                "color": "rgba(255, 255, 255, .2)"
                            }
                        }
                    },
                    "retina_detect": false,
                    "interactivity": {
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "bubble"
                            }
                        },
                        "modes": {
                            "bubble": {
                                "size": 6,
                                "distance": 40
                            }
                        }
                    }
                }}
            />
        </div>
    )
}

export default Particle;