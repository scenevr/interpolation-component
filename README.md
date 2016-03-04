# interpolation-component

    <a-entity interpolation="100ms" id="pink" geometry="primitive: box" material="color: #ff00aa"></a-entity>

This component interpolates positional and rotational updates over the `timestep` specified (must use the unity `milliseconds`). Good for use where you are getting position updates over the network, or some other source that is less than the screen refresh speed, and you want smooth interpolation between them. Doesn't do any future prediction, so everything will always display where it was `timestep` milliseconds ago.